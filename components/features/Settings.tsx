"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProvider";

export default function Settings() {
  const { S, dbStatus, checkDb, update, reset } = useApp();
  if (!S) return null;

  const setV = (k: string, val: string) =>
    update((d) => {
      const t = d.set as unknown as Record<string, string | number>;
      if (k === "grace" || k === "annualDays" || k === "deduction") t[k] = +val;
      else t[k] = val;
    }, "Settings saved");

  const doReset = () => {
    if (window.confirm("Reset all data to the sample set?")) reset();
  };

  const row = (label: string, desc: string, input: ReactNode) => (
    <div className="set">
      <div>
        <b>{label}</b>
        <small>{desc}</small>
      </div>
      {input}
    </div>
  );

  const s = S.set;
  return (
    <div className="panel">
      <div className="pb">
        {row("Company name", "Shown in the sidebar.", (
          <input data-c="set" value={s.company} onChange={(e) => setV("company", e.target.value)} />
        ))}
        {row("Work day starts", "Used to decide who is late.", (
          <input type="time" value={s.workStart} onChange={(e) => setV("workStart", e.target.value)} />
        ))}
        {row("Grace period (minutes)", "Clock-ins within this window count as on time.", (
          <input type="number" min={0} max={120} value={s.grace} onChange={(e) => setV("grace", e.target.value)} />
        ))}
        {row("Annual leave (days)", "Yearly allowance for each employee.", (
          <input type="number" min={0} max={60} value={s.annualDays} onChange={(e) => setV("annualDays", e.target.value)} />
        ))}
        {row("Payroll deductions (%)", "Combined tax and social contributions applied to gross pay.", (
          <input type="number" min={0} max={60} value={s.deduction} onChange={(e) => setV("deduction", e.target.value)} />
        ))}
        {row(
          "Appearance",
          "Follow your device or pick a theme.",
          <select value={s.theme} onChange={(e) => setV("theme", e.target.value)}>
            {["system", "light", "dark"].map((o) => (
              <option key={o} value={o}>
                {o[0].toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        )}
        {row(
          "Database",
          dbStatus === "connected"
            ? "Connected to Supabase. Changes are saved to your cloud database."
            : dbStatus === "error"
              ? "Could not reach Supabase. Working from local cache; click to retry."
              : dbStatus === "connecting"
                ? "Checking the database connection…"
                : "Not connected. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to sync.",
          <button
            type="button"
            className={"pill " + (dbStatus === "connected" ? "ok" : dbStatus === "error" ? "bad" : dbStatus === "connecting" ? "warn" : "mute")}
            onClick={checkDb}
          >
            {dbStatus === "connected" ? "Supabase" : dbStatus === "error" ? "Offline" : dbStatus === "connecting" ? "Connecting…" : "Local only"}
          </button>
        )}
        {row("Sample data", "Restore the starting employees and requests. This removes your changes.", (
          <button className="btn bad" onClick={doReset}>
            Reset sample data
          </button>
        ))}
      </div>
    </div>
  );
}