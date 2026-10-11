"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Pill } from "@/components/ui/ui";
import { empAt, money } from "@/lib/utils";

export default function Benefits() {
  const { S, update, form, toast } = useApp();
  if (!S) return null;

  const total = S.enrol.reduce((s, x) => s + (S.plans.find((p) => p.id === x.plan)?.cost || 0), 0);

  const enrolAdd = () =>
    form(
      "Enrol employee",
      [
        { k: "emp", label: "Employee", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
        { k: "plan", label: "Plan", type: "select", o: S.plans.map((p) => [String(p.id), p.name]) },
      ],
      (v) => {
        if (S.enrol.some((x) => x.emp === +v.emp && x.plan === +v.plan)) {
          toast("Already enrolled in this plan");
          return false;
        }
        update((d) => {
          d.enrol.push({ emp: +v.emp, plan: +v.plan });
        }, "Enrolled");
      }
    );

  const unenrol = (emp: number, plan: number) =>
    update((d) => {
      d.enrol = d.enrol.filter((x) => !(x.emp === emp && x.plan === plan));
    }, "Enrolment removed");

  return (
    <>
      <div className="strip">
        <div>
          <b>{S.plans.length}</b>
          <span>Plans offered</span>
        </div>
        <div>
          <b>{S.enrol.length}</b>
          <span>Enrolments</span>
        </div>
        <div>
          <b>{money(total)}</b>
          <span>Employer cost per month</span>
        </div>
      </div>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={enrolAdd}>
          Enrol employee
        </button>
      </div>
      <div className="grid3">
        {S.plans.map((p) => {
          const members = S.enrol.filter((x) => x.plan === p.id);
          return (
            <div className="panel" key={p.id}>
              <div className="pb">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <h3 style={{ fontSize: 16 }}>{p.name}</h3>
                  <Pill t={p.type} k="info" />
                </div>
                <p style={{ color: "var(--muted)", margin: "4px 0 10px" }}>
                  {p.provider} · {money(p.cost)} per person each month
                </p>
                <b>{members.length} enrolled</b>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {members.map((x) => (
                    <span className="pill mute" key={x.emp}>
                      {empAt(S, x.emp).name}{" "}
                      <button
                        className="x"
                        style={{ fontSize: 12, marginLeft: 4 }}
                        onClick={() => unenrol(x.emp, p.id)}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}