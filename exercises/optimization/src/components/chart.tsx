"use client"

import { useState } from "react"

// Simulates a heavy chart library (~50KB+ of code)
// In real apps this would be recharts, chart.js, d3, etc.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DATA = [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 52]
const MAX_VALUE = Math.max(...DATA)

export function Chart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="bg-card border-border rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Projects Completed</h3>
        <span className="text-muted-foreground text-sm">Last 12 months</span>
      </div>

      {/* Bar Chart */}
      <div className="flex h-64 items-end gap-2">
        {DATA.map((value, index) => {
          const height = (value / MAX_VALUE) * 100

          return (
            <div
              key={index}
              className="group flex flex-1 flex-col items-center gap-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <span className="text-foreground text-xs font-medium">{value}</span>
              )}
              <div
                className={`w-full rounded-t transition-colors ${
                  hoveredIndex === index ? "bg-foreground" : "bg-foreground/20"
                }`}
                style={{ height: `${String(height)}%` }}
              />
              <span className="text-muted-foreground text-xs">{MONTHS[index]}</span>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
        <div>
          <p className="text-muted-foreground text-xs">Total</p>
          <p className="text-lg font-bold">{DATA.reduce((a, b) => a + b, 0)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Average</p>
          <p className="text-lg font-bold">{Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Best Month</p>
          <p className="text-lg font-bold">{MONTHS[DATA.indexOf(MAX_VALUE)]}</p>
        </div>
      </div>

      {/* Extra weight: SVG decorations to simulate bundle size */}
      <svg className="hidden" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="chartGrad1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <linearGradient id="chartGrad2">
            <stop offset="0%" stopColor="#333" />
            <stop offset="100%" stopColor="#ccc" />
          </linearGradient>
          <linearGradient id="chartGrad3">
            <stop offset="0%" stopColor="#666" />
            <stop offset="100%" stopColor="#999" />
          </linearGradient>
          <pattern id="chartPattern1" height="10" patternUnits="userSpaceOnUse" width="10">
            <rect fill="#eee" height="10" width="10" />
            <circle cx="5" cy="5" fill="#ddd" r="3" />
          </pattern>
          <pattern id="chartPattern2" height="20" patternUnits="userSpaceOnUse" width="20">
            <rect fill="#f5f5f5" height="20" width="20" />
            <path d="M0,10 L20,10 M10,0 L10,20" stroke="#e0e0e0" />
          </pattern>
        </defs>
      </svg>
    </div>
  )
}
