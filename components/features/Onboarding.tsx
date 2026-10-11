"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Progress } from "@/components/ui/ui";
import { DEFAULT_ONB } from "@/lib/constants";
import { empAt, fdate, nid } from "@/lib/utils";

export default function Onboarding() {
  const { S, update, form, toast } = useApp();
  if (!S) return null;

  const start = () => {
    const free = S.emps.filter((e) => !S.onb.some((o) => o.emp === e.id));
    if (!free.length) {
      toast("Everyone already has an onboarding checklist");
      return;
    }
    form(
      "Start onboarding",
      [{ k: "emp", label: "Employee", type: "select", o: free.map((e) => [String(e.id), e.name]) }],
      (v) => {
        update((d) => {
          d.onb.push({ id: nid(d.onb), emp: +v.emp, tasks: DEFAULT_ONB.map((t) => ({ t, done: false })) });
        }, "Onboarding started");
      }
    );
  };

  const tick = (id: number, i: number, checked: boolean) =>
    update((d) => {
      const o = d.onb.find((x) => x.id === id);
      if (o) o.tasks[i].done = checked;
    });

  return (
    <>
      <p className="lead">Track each new hire{"'"}s first weeks. Tick tasks off as they are completed.</p>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={start}>
          Start onboarding
        </button>
      </div>
      {S.onb.length ? (
        <div className="grid3">
          {S.onb.map((o) => {
            const e = empAt(S, o.emp);
            const done = o.tasks.filter((t) => t.done).length;
            const p = Math.round((done / o.tasks.length) * 100);
            return (
              <div className="panel" key={o.id}>
                <div className="pb">
                  <Person e={e} sub={e.role + " · starts " + fdate(e.start)} />
                  <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "14px 0 6px" }}>
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
        <Empty t="No one is onboarding. Start onboarding when a new hire is added." />
      )}
    </>
  );
}