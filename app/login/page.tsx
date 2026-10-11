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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">People Desk Login</h1>
          <p className="text-xs text-slate-500">Use only username & password</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Admin"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="text-xs text-center text-slate-400">Default: Admin / admin123</p>
      </form>
    </div>
  )
}