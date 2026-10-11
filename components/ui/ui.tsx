"use client";

import type { Emp } from "@/lib/types";
import { colorFor } from "@/lib/utils";

export function Pill({ t, k }: { t: string; k?: string }) {
  return <span className={`pill ${k || "mute"}`}>{t}</span>;
}

export function Avatar({ e }: { e: Emp }) {
  return (
    <span className="av" style={{ background: colorFor(e.id) }}>
      {e.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function Person({ e, sub }: { e: Emp; sub?: string }) {
  return (
    <div className="who">
      <Avatar e={e} />
      <div>
        <b>{e.name}</b>
        <small>{sub == null ? e.role : sub}</small>
      </div>
    </div>
  );
}

export function Progress({ p }: { p: number }) {
  return (
    <div className="prog" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${p}%` }} />
    </div>
  );
}

export function Bars({ items, fmt }: { items: [string, number][]; fmt?: (n: number) => string }) {
  const max = Math.max(1, ...items.map((i) => i[1]));
  if (!items.length) return null;
  return (
    <>
      {items.map(([label, n]) => (
        <div className="hb" key={label}>
          <span>{label}</span>
          <div className="tr">
            <i style={{ width: `${Math.max(3, (n / max) * 100)}%` }} />
          </div>
          <b>{fmt ? fmt(n) : n}</b>
        </div>
      ))}
    </>
  );
}

export function Empty({ t }: { t: string }) {
  return <div className="empty">{t}</div>;
}