"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);

  return (
    <div className="app">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <div className={`scrim${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <div className="main-wrap">
        <Topbar onMenu={() => setOpen((o) => !o)} />
        <main>{children}</main>
      </div>
    </div>
  );
}