"use client";

import { useApp } from "@/components/providers/AppProvider";
import { nid } from "@/lib/utils";

export default function Recruitment() {
  const { S, update, form, toast } = useApp();
  if (!S) return null;

  const jobAdd = () =>
    form(
      "Open a role",
      [
        { k: "title", label: "Job title", req: true },
        { k: "dept", label: "Department", type: "select", o: Object.keys(S.heads) },
        { k: "n", label: "Openings", type: "number", v: "1" },
      ],
      (v) => {
        update((d) => {
          d.jobs.push({ id: nid(d.jobs), title: v.title, dept: v.dept, openings: +v.n || 1 });
        }, "Role opened");
      }
    );

  const candAdd = () => {
    if (!S.jobs.length) {
      toast("Open a role first");
      return;
    }
    form(
      "Add candidate",
      [
        { k: "name", label: "Candidate name", req: true },
        { k: "role", label: "Role", type: "select", o: S.jobs.map((j) => j.title) },
        { k: "source", label: "Source", type: "select", o: ["Careers page", "Job board", "Referral", "Agency"] },
      ],
      (v) => {
        update((d) => {
          d.cands.push({ id: nid(d.cands), name: v.name, role: v.role, stage: "Applied", source: v.source });
        }, "Candidate added");
      }
    );
  };

  const move = (id: number, dir: number) => {
    const c = S.cands.find((x) => x.id === id);
    if (!c) return;
    const i = S.stages.indexOf(c.stage) + dir;
    if (i < 0 || i >= S.stages.length) return;
    const ns = S.stages[i];
    update((d) => {
      const x = d.cands.find((y) => y.id === id);
      if (x) {
        x.stage = ns;
        if (ns === "Offer") {
          d.notes.unshift({ id: nid(d.notes), text: "An offer is ready for " + c.name + ".", time: "Just now", read: false, go: "recruitment" });
        }
      }
    }, c.name + " moved to " + ns);
  };

  return (
    <>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn ghost" onClick={jobAdd}>
          Open a role
        </button>
        <button className="btn" onClick={candAdd}>
          Add candidate
        </button>
      </div>
      <div className="strip">
        {S.jobs.map((j) => (
          <div key={j.id}>
            <b>{j.openings}</b>
            <span>
              {j.title} · {j.dept}
            </span>
          </div>
        ))}
        {!S.jobs.length && (
          <div>
            <span>No open roles. Open one to start hiring.</span>
          </div>
        )}
      </div>
      <div className="kan">
        {S.stages.map((st, si) => {
          const c = S.cands.filter((x) => x.stage === st);
          return (
            <div className="col" key={st}>
              <h3>
                {st}
                <span>{c.length}</span>
              </h3>
              {c.map((x) => (
                <div className="card" key={x.id}>
                  <b>{x.name}</b>
                  <small>
                    {x.role} · {x.source}
                  </small>
                  <div className="mv">
                    <button className="btn sm ghost" disabled={si === 0} onClick={() => move(x.id, -1)} aria-label="Move back">
                      ←
                    </button>
                    <button className="btn sm ghost" disabled={si === S.stages.length - 1} onClick={() => move(x.id, 1)} aria-label="Move forward">
                      →
                    </button>
                  </div>
                </div>
              ))}
              {!c.length && <small style={{ color: "var(--muted)", padding: 4 }}>No candidates here.</small>}
            </div>
          );
        })}
      </div>
    </>
  );
}