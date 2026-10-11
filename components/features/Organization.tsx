"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Person, Pill } from "@/components/ui/ui";
import { DEPTS } from "@/lib/constants";
import { empAt } from "@/lib/utils";

export default function Organization() {
  const { S, update, form, toast } = useApp();
  if (!S) return null;

  const addDept = () =>
    form(
      "Add department",
      [
        { k: "name", label: "Department name", req: true },
        { k: "head", label: "Department head", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
      ],
      (v) => {
        if (S.heads[v.name]) {
          toast("That department already exists");
          return false;
        }
        update((d) => {
          d.heads[v.name] = +v.head;
          if (!DEPTS.includes(v.name)) DEPTS.push(v.name);
          const e = d.emps.find((x) => x.id === +v.head);
          if (e) e.dept = v.name;
        }, "Department added");
      }
    );

  return (
    <>
      <p className="lead">Departments, who leads them and who works in each.</p>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={addDept}>
          Add department
        </button>
      </div>
      <div className="grid3">
        {Object.keys(S.heads).map((d) => {
          const members = S.emps.filter((e) => e.dept === d);
          const h = empAt(S, S.heads[d]);
          return (
            <div className="panel" key={d}>
              <div className="pb">
                <h3>{d}</h3>
                <p style={{ color: "var(--muted)", margin: "2px 0 12px" }}>
                  {members.length} {members.length === 1 ? "person" : "people"}
                </p>
                <Person e={h} sub="Department head" />
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {members.filter((e) => e.id !== h.id).map((e) => (
                    <Pill key={e.id} t={e.name} />
                  ))}
                  {members.filter((e) => e.id !== h.id).length === 0 && (
                    <span style={{ color: "var(--muted)" }}>No other members yet.</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}