"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ICONS, NAV } from "@/lib/constants";

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { S } = useApp();
  const path = usePathname();
  const slug = path.split("/")[1] || "dashboard";

  let show: ReactNode = null;
  if (S) {
    const badge: Record<string, number> = {
      leave: S.leaves.filter((l) => l.status === "Pending").length,
      notifications: S.notes.filter((n) => !n.read).length,
      relations: S.cases.filter((c) => c.status !== "Resolved").length,
    };
    show = (
      <aside className={`side${open ? " open" : ""}`} aria-label="Main navigation">
        <div className="brand">
          <div className="mark">P</div>
          <div>
            <b>People Desk</b>
            <small>{S.set.company}</small>
          </div>
        </div>
        <nav>
          {NAV.map(([id, label]) => {
            const active = slug === id;
            return (
              <Link key={id} href={`/${id}`} onClick={onNavigate} aria-current={active ? "page" : undefined}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={ICONS[id]} />
                </svg>
                {label}
                {badge[id] ? <span className="badge">{badge[id]}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  return show || <aside className="side" aria-label="Main navigation" />;
}