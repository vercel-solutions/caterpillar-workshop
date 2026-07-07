#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runValidation } from './lib/index.mjs'

const root = process.cwd()
const configPath = join(root, 'validate.config.mjs')

if (!existsSync(configPath)) {
  console.error('No validate.config.mjs found in this directory.')
  console.error('Run `pnpm validate` from inside an exercise folder.')
  process.exit(1)
}

const { default: config } = await import(pathToFileURL(configPath).href)

await runValidation(config, root)
process.exit(0)
