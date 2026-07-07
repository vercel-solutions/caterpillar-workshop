"use client"

import { useState } from "react"

// ANTI-PATTERN: Static import of heavy chart component (should use next/dynamic)
import { Chart } from "@/components"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground mt-2">Get in touch with our team</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          {submitted
            ? (
                <div className="bg-card border-border rounded-lg border p-8 text-center">
                  <h2 className="text-2xl font-bold">Thank you!</h2>
                  <p className="text-muted-foreground mt-2">We&apos;ll get back to you soon.</p>
                </div>
              )
            : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="name">
                      Name
                    </label>
                    <input
                      required
                      className="bg-background border-input focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <input
                      required
                      className="bg-background border-input focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      required
                      className="bg-background border-input focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                      id="message"
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-primary text-primary-foreground w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
                    type="submit"
                  >
                    Send Message
                  </button>
                </form>
              )}
        </div>

        {/* ANTI-PATTERN: Heavy chart loaded on contact page, should be dynamically imported */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Our Growth</h2>
          <Chart />
        </div>
      </div>
    </div>
  )
}
