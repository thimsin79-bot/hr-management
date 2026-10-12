"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/AppProvider"

export default function LoginPage() {
  const { S, toast } = useApp()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const state = S
    const users = state?.users || []
    const found = users.find(
      (x: { name?: string; password?: string; id?: number; role?: string }) =>
        (x.name || "").trim().toLowerCase() === username.trim().toLowerCase() &&
        (x.password || "") === password
    )

    if (!found) {
      toast("Invalid username or password")
      setLoading(false)
      return
    }

    const auth = { id: found.id, name: found.name, role: found.role, ts: Date.now() }
    localStorage.setItem("peopledesk_auth", JSON.stringify(auth))
    document.cookie = "pd_auth=1; path=/; max-age=86400; SameSite=Lax"

    router.replace("/")
    setLoading(false)
  }

  return (
    <div className="login">
      <form onSubmit={onSubmit} className="login-card">
        <div className="login-brand">
          <div className="mark">P</div>
          <h1>People Desk</h1>
          <p>Sign in with your username and password</p>
        </div>
        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Admin"
            autoComplete="username"
            required
            autoFocus
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn login-btn">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="login-hint">Default: Admin / admin123</p>
      </form>
    </div>
  )
}