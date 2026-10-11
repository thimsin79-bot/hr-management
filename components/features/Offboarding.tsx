"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Progress } from "@/components/ui/ui";
import { useStartOffboard } from "@/components/features/offboardForm";
import { empAt, fdate } from "@/lib/utils";

export default function Offboarding() {
  const { S, update } = useApp();
  const start = useStartOffboard();
  if (!S) return null;

  const tick = (id: number, i: number, checked: boolean) =>
    update((d) => {
      const o = d.off.find((x) => x.id === id);
      if (o) o.tasks[i].done = checked;
    });

  return (
    <>
      <p className="lead">Make sure nothing is missed when someone leaves: access, equipment, final pay and handover.</p>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={() => start()}>
          Start offboarding
        </button>
      </div>
      {S.off.length ? (
        <div className="grid3">
          {S.off.map((o) => {
            const e = empAt(S, o.emp);
            const done = o.tasks.filter((t) => t.done).length;
            const p = Math.round((done / o.tasks.length) * 100);
            return (
              <div className="panel" key={o.id}>
                <div className="pb">
                  <Person e={e} sub={e.role} />
                  <p style={{ color: "var(--muted)", margin: "10px 0 0" }}>
                    {o.reason} · last day {fdate(o.last)}
                  </p>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "10px 0 6px" }}>
                    <Progress p={p} />
                    <b>{p}%</b>
                  </div>
                  {o.tasks.map((t, i) => (
                    <label className={"chk" + (t.done ? " done" : "")} key={i}>
                      <input type="checkbox" checked={t.done} onChange={(ev) => tick(o.id, i, ev.target.checked)} />
                      <span>{t.t}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty t="No one is leaving. Start offboarding when an employee gives notice." />
      )}
    </>
  );
}