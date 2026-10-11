"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { NAV } from "@/lib/constants";
import { todayLabel } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { S } = useApp();
  const path = usePathname();
  const slug = path.split("/")[1] || "dashboard";
  const title = NAV.find((n) => n[0] === slug);

  return (
    <header className="top">
      <button className="menu" onClick={onMenu} aria-label="Open navigation">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <h1>{title ? title[1] : "Not found"}</h1>
      {S ? <span className="date">{todayLabel()}</span> : null}
    </header>
  );
}