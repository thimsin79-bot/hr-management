"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import type { DbStatus } from "@/components/providers/AppProvider";
import { NAV } from "@/lib/constants";
import { todayLabel } from "@/lib/utils";

const DB_META: Record<DbStatus, { kind: string; label: string; title: string }> = {
  connected: { kind: "ok", label: "Connected", title: "Connected to Supabase — changes are saved to the cloud." },
  connecting: { kind: "warn", label: "Connecting", title: "Checking the database connection." },
  error: { kind: "bad", label: "Offline", title: "Could not reach Supabase — working from local cache. Click to retry." },
  local: { kind: "mute", label: "Local", title: "No Supabase configured — data is stored in this browser only." },
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { S, dbStatus, checkDb } = useApp();
  const path = usePathname();
  const slug = path.split("/")[1] || "dashboard";
  const title = NAV.find((n) => n[0] === slug);
  const db = DB_META[dbStatus];

  return (
    <header className="top">
      <button className="menu" onClick={onMenu} aria-label="Open navigation">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <h1>{title ? title[1] : "Not found"}</h1>
      <div className="topright">
        <button className={`pill dbpill ${db.kind}`} onClick={checkDb} title={db.title} type="button">
          <span className="dot" />
          {db.label}
        </button>
        {S ? <span className="date">{todayLabel()}</span> : null}
      </div>
    </header>
  );
}