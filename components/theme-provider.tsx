"use client"

import * as React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Apply dark theme on mount
    document.documentElement.classList.add("dark")
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
