"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Empty } from "@/components/ui/ui";

export default function Notifications() {
  const { S, update } = useApp();
  const router = useRouter();
  if (!S) return null;

  const readAll = () =>
    update((d) => {
      d.notes.forEach((n) => (n.read = true));
    }, "All caught up");

  const toggle = (id: number) =>
    update((d) => {
      const n = d.notes.find((x) => x.id === id);
      if (n) n.read = !n.read;
    });

  return (
    <>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn ghost" onClick={readAll}>
          Mark all as read
        </button>
      </div>
      <div className="panel">
        {S.notes.length ? (
          <ul className="queue">
            {S.notes.map((n) => (
              <li key={n.id}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    flex: "none",
                    background: n.read ? "transparent" : "var(--accent)",
                    border: `1px solid ${n.read ? "var(--line)" : "var(--accent)"}`,
                  }}
                />
                <div className="tx" style={n.read ? { color: "var(--muted)" } : undefined}>
                  <b style={{ fontWeight: n.read ? 400 : 600 }}>{n.text}</b>
                  <small>{n.time}</small>
                </div>
                <div className="acts">
                  <button className="btn sm ghost" onClick={() => router.push("/" + n.go)}>
                    Open
                  </button>
                  <button className="btn sm ghost" onClick={() => toggle(n.id)}>
                    {n.read ? "Mark unread" : "Mark read"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty t="You are all caught up." />
        )}
      </div>
    </>
  );
}