"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Submitting login form")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login response status:", response.status)
      const data = await response.json()
      console.log("[v0] Login response data:", data)

      if (!response.ok) {
        setError(data.error || "Erreur de connexion")
        return
      }

      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("[v0] Login fetch error:", err)
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: "admin@ips.gov", password: "admin123", role: "Admin" },
    { email: "inspecteur@ips.gov", password: "inspecteur123", role: "Inspecteur" },
    { email: "chef@ips.gov", password: "chef123", role: "Chef de Service" },
  ]

  const fillDemo = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Connexion</CardTitle>
        <CardDescription className="text-center">Inspection Provinciale de Santé</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@ips.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Comptes de démonstration :</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-transparent"
                  onClick={() => fillDemo(account.email, account.password)}
                  disabled={loading}
                >
                  {account.role} - {account.email}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
