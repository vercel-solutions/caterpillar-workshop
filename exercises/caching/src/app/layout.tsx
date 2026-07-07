import type { Metadata } from "next"

import Link from "next/link"

import "./globals.css"

export const metadata: Metadata = {
  title: "Cat Insights",
  description: "Caterpillar's insights on equipment, jobsites, and innovation",
  metadataBase: new URL("https://caterpillar-blog-16.vercel.app"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <div className="relative flex min-h-screen flex-col">
          {/* Header */}
          <header className="bg-background sticky top-0 z-50 w-full border-b border-t-4 border-t-brand">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
              <div className="mr-4 flex">
                <Link className="mr-6 flex items-center gap-2" href="/">
                  <span className="bg-brand text-brand-foreground rounded-sm px-2 py-0.5 text-xl font-extrabold tracking-tight">CAT</span>
                  <span className="text-lg font-semibold">Caterpillar</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="/"
                  >
                    Home
                  </Link>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t">
            <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-muted-foreground text-center text-sm md:text-left">
                  Built by
                  {" "}
                  <a
                    className="hover:text-foreground font-medium underline underline-offset-4"
                    href="https://vercel.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Vercel
                  </a>
                  {" "}
                  for Caterpillar.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
