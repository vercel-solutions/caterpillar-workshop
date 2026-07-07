import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const VALIDATOR_PORT = 4901
const DEV_PORT = 3000
const SERVER_READY_TIMEOUT_MS = 90_000
const FETCH_TIMEOUT_MS = 30_000

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const c = (code, s) => (useColor ? `\x1B[${code}m${s}\x1B[0m` : s)
const green = s => c('32', s)
const red = s => c('31', s)
const yellow = s => c('33', s)
const cyan = s => c('36', s)
const dim = s => c('2', s)
const bold = s => c('1', s)

const stripAnsi = s => s.replace(/\x1B\[[0-9;]*m/g, '')

/**
 * Strip comments so checks match real code, not TODO/anti-pattern notes.
 * Heuristic: block comments, plus `//` at line start or after whitespace
 * (leaves `https://...` URLs intact).
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[ \t])\/\/[^\n]*/gm, '$1')
}

async function probeUrl(url, pattern, timeoutMs = 3000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    if (res.status >= 500)
      return false
    const body = await res.text()
    return pattern ? pattern.test(body) : true
  }
  catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Context — helpers available to every check via `ctx`
// ---------------------------------------------------------------------------

function createContext(root, config) {
  let baseUrl = null
  let serverNote = null
  let buildResult = null
  let typecheckResult = null
  const hrefCache = new Map()

  const abs = rel => join(root, rel)

  const ctx = {
    root,

    /** Read a file relative to the exercise root. Returns null if missing. */
    read(rel) {
      try {
        return readFileSync(abs(rel), 'utf-8')
      }
      catch {
        return null
      }
    },

    exists(rel) {
      return existsSync(abs(rel))
    },

    /** Like read(), but with comments stripped — use for pattern matching. */
    code(rel) {
      const content = ctx.read(rel)
      return content === null ? null : stripComments(content)
    },

    /** Recursively list files under a directory (relative paths). */
    files(relDir = 'src') {
      const out = []
      const walk = (dir) => {
        let entries
        try {
          entries = readdirSync(abs(dir))
        }
        catch {
          return
        }
        for (const name of entries) {
          if (name === 'node_modules' || name === '.next' || name.startsWith('.turbo'))
            continue
          const rel = join(dir, name)
          if (statSync(abs(rel)).isDirectory())
            walk(rel)
          else out.push(rel)
        }
      }
      walk(relDir)
      return out
    },

    /** First file under relDir whose basename matches nameRegex, or null. */
    findFile(relDir, nameRegex) {
      return ctx.files(relDir).find(f => nameRegex.test(f.split('/').pop())) ?? null
    },

    /** Does the file exist AND match the pattern (comments ignored)? */
    match(rel, regex) {
      const content = ctx.code(rel)
      return content !== null && regex.test(content)
    },

    /** Does the file exist AND NOT match the pattern (comments ignored)? Missing file counts as not done. */
    noMatch(rel, regex) {
      const content = ctx.code(rel)
      return content !== null && !regex.test(content)
    },

    countMatches(rel, regex) {
      const content = ctx.code(rel)
      if (content === null)
        return 0
      return (content.match(new RegExp(regex.source, `${regex.flags.replace('g', '')}g`)) ?? []).length
    },

    /** Does any file under relDir match the pattern (comments ignored)? */
    matchInDir(relDir, regex) {
      return ctx.files(relDir).some(f => regex.test(ctx.code(f) ?? ''))
    },

    /** Result for checks that need a condition the validator couldn't observe. */
    unverified(note) {
      return { unknown: true, note }
    },

    // -- runtime (HTTP) helpers ---------------------------------------------

    get serverUp() {
      return baseUrl !== null
    },

    get serverNote() {
      return serverNote
    },

    /** Fetch a path from the running app. Returns { status, body } or null when no server. */
    async http(path) {
      if (!baseUrl)
        return null
      try {
        const res = await fetch(baseUrl + path, {
          redirect: 'follow',
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          headers: { accept: 'text/html,*/*' },
        })
        return { status: res.status, body: await res.text() }
      }
      catch {
        return null
      }
    },

    /**
     * Fetch a page and return the first capture group of hrefRegex found in
     * its HTML — used to discover a real detail-page link at runtime.
     */
    async discoverHref(pagePath, hrefRegex) {
      const key = `${pagePath} ${hrefRegex}`
      if (hrefCache.has(key))
        return hrefCache.get(key)
      const res = await ctx.http(pagePath)
      const found = res ? (res.body.match(hrefRegex)?.[1] ?? null) : null
      hrefCache.set(key, found)
      return found
    },

    // -- expensive one-shot commands (cached) -------------------------------

    /** Run `tsc --noEmit` once and cache the result. */
    typecheck() {
      if (!typecheckResult) {
        const r = spawnSync('pnpm', ['exec', 'tsc', '--noEmit'], {
          cwd: root,
          encoding: 'utf-8',
          timeout: 120_000,
        })
        typecheckResult = { ok: r.status === 0, output: `${r.stdout ?? ''}${r.stderr ?? ''}` }
      }
      return typecheckResult
    },

    /**
     * Run `next build` once and parse the route table.
     * Returns { ok, routes: Map<route, symbol>, output }.
     * Symbols: ○ static, ● SSG/prerendered, ƒ dynamic, ◐ partial prerender.
     */
    async buildRoutes() {
      if (buildResult)
        return buildResult
      // Building would clobber the .next dir a running dev server is using —
      // skip if this exercise's dev server is up (ours or the student's).
      const devServerUp = (baseUrl && baseUrl.includes(`:${DEV_PORT}`))
        || await probeUrl(`http://localhost:${DEV_PORT}/`, config?.probe)
      if (devServerUp) {
        buildResult = { ok: false, routes: new Map(), skipped: true, output: '' }
        return buildResult
      }
      process.stdout.write(dim('  Running `next build` to inspect rendering output (this can take a minute)...\n'))
      const r = spawnSync('pnpm', ['exec', 'next', 'build'], {
        cwd: root,
        encoding: 'utf-8',
        timeout: 300_000,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
      })
      const output = stripAnsi(`${r.stdout ?? ''}${r.stderr ?? ''}`)
      const routes = new Map()
      for (const line of output.split('\n')) {
        const m = line.match(/^[\s├└┌│]*([○●ƒλ◐])\s+(\/\S*)/)
        if (m)
          routes.set(m[2], m[1])
      }
      buildResult = { ok: r.status === 0, routes, output }
      return buildResult
    },

    // internal
    _setServer(url, note) {
      baseUrl = url
      serverNote = note
    },
  }

  return ctx
}

// ---------------------------------------------------------------------------
// Dev server management
// ---------------------------------------------------------------------------

async function startServer(config, ctx) {
  // Prefer the student's own dev server if it's running THIS exercise.
  // Generous timeout: a cold dev server compiles the page on first request.
  if (await probeUrl(`http://localhost:${DEV_PORT}/`, config.probe, 30_000)) {
    ctx._setServer(`http://localhost:${DEV_PORT}`, `using your dev server on port ${DEV_PORT}`)
    return null
  }

  process.stdout.write(dim(`  Starting the app on port ${VALIDATOR_PORT} to run live checks...\n`))
  const child = spawn('pnpm', ['exec', 'next', 'dev', '-p', String(VALIDATOR_PORT)], {
    cwd: ctx.root,
    stdio: 'ignore',
    detached: true,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  })

  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (await probeUrl(`http://localhost:${VALIDATOR_PORT}/`))
      break
    await new Promise(r => setTimeout(r, 1000))
  }

  if (await probeUrl(`http://localhost:${VALIDATOR_PORT}/`)) {
    ctx._setServer(`http://localhost:${VALIDATOR_PORT}`, `started a temporary server on port ${VALIDATOR_PORT}`)
    return child
  }

  ctx._setServer(null, 'the app did not start — live checks were skipped')
  return child
}

function stopServer(child) {
  if (!child)
    return
  try {
    process.kill(-child.pid, 'SIGTERM')
  }
  catch {}
  setTimeout(() => {
    try {
      process.kill(-child.pid, 'SIGKILL')
    }
    catch {}
  }, 3000).unref()
}

// ---------------------------------------------------------------------------
// Runner + report
// ---------------------------------------------------------------------------

async function runCheck(check, ctx) {
  if (check.run === 'manual')
    return { state: 'manual', note: check.note }
  try {
    const result = await check.run(ctx)
    if (result === true)
      return { state: 'pass' }
    if (result === false)
      return { state: 'todo' }
    if (result && typeof result === 'object') {
      if (result.unknown)
        return { state: 'unknown', note: result.note }
      return { state: result.pass ? 'pass' : 'todo', note: result.note }
    }
    return { state: 'todo' }
  }
  catch {
    return { state: 'unknown', note: 'this check could not run' }
  }
}

function bar(passed, total, width = 10) {
  if (total === 0)
    return ''
  const filled = Math.round((passed / total) * width)
  return `${green('█'.repeat(filled))}${dim('░'.repeat(width - filled))}`
}

const ICONS = {
  pass: green('✓'),
  todo: dim('✗'),
  unknown: yellow('◌'),
  manual: cyan('➤'),
}

export async function runValidation(config, root) {
  const ctx = createContext(root, config)

  console.log('')
  console.log(bold(`Progress check — ${config.exercise}`))
  console.log(dim('This is guidance, not a grade. It checks whether each README task looks complete.'))
  console.log('')

  const needsServer = config.server !== false
  let serverProcess = null
  if (needsServer) {
    serverProcess = await startServer(config, ctx)
    if (ctx.serverNote)
      console.log(dim(`  ${ctx.serverNote}\n`))
  }

  let corePassed = 0
  let coreTotal = 0

  try {
    for (const task of config.tasks) {
      const results = []
      for (const check of task.checks)
        results.push({ check, ...(await runCheck(check, ctx)) })

      const auto = results.filter(r => r.state !== 'manual')
      const passed = auto.filter(r => r.state === 'pass').length
      const total = auto.length

      if (!task.optional) {
        corePassed += passed
        coreTotal += total
      }

      const tag = task.optional ? dim(' (bonus)') : ''
      let status
      if (total === 0)
        status = cyan('self-check')
      else if (passed === total)
        status = `${bar(passed, total)}  ${green('complete')}`
      else if (passed === 0)
        status = `${bar(passed, total)}  ${dim('not started')}`
      else
        status = `${bar(passed, total)}  ${yellow(`in progress (${passed}/${total})`)}`

      console.log(`${bold(`Task ${task.id}`)} · ${task.title}${tag}  ${status}`)

      for (const r of results) {
        const note = r.note ? dim(` — ${r.note}`) : ''
        console.log(`  ${ICONS[r.state]} ${r.state === 'todo' ? dim(r.check.label) : r.check.label}${note}`)
      }
      console.log('')
    }
  }
  finally {
    stopServer(serverProcess)
  }

  const pct = coreTotal === 0 ? 0 : Math.round((corePassed / coreTotal) * 100)
  console.log(bold(`Overall: ${bar(corePassed, coreTotal, 20)}  ${pct}% of core checks passing (${corePassed}/${coreTotal})`))
  console.log(dim('✓ looks complete · ✗ not detected yet · ◌ could not verify · ➤ check it yourself'))
  console.log('')
}
