"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Pill } from "@/components/ui/ui";
import { useStartOffboard } from "@/components/features/offboardForm";
import { DEFAULT_ONB, DEPTS, TODAY } from "@/lib/constants";
import { emailFrom, empAt, estatus, fdate, money, nid, stKind } from "@/lib/utils";

export default function Employees() {
  const { S, update, modal, close, form, notify } = useApp();
  const startOffboard = useStartOffboard();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");

  if (!S) return null;

  const rows = S.emps.filter(
    (e) =>
      (dept === "All" || e.dept === dept) &&
      (!q || (e.name + " " + e.role + " " + e.email).toLowerCase().includes(q.toLowerCase()))
  );

  const openEmp = (id: number) => {
    const e = empAt(S, id);
    modal(
      <h3>{e.name}</h3>,
      <dl className="kv">
        <dt>Role</dt>
        <dd>{e.role}</dd>
        <dt>Department</dt>
        <dd>{e.dept}</dd>
        <dt>Type</dt>
        <dd>{e.type}</dd>
        <dt>Status</dt>
        <dd>{estatus(S, e)}</dd>
        <dt>Email</dt>
        <dd>{e.email}</dd>
        <dt>Start date</dt>
        <dd>{fdate(e.start)}</dd>
        <dt>Annual salary</dt>
        <dd>{money(e.salary)}</dd>
      </dl>,
      <>
        <button
          className="btn bad"
          onClick={() => {
            close();
            startOffboard(e.id);
          }}
        >
          Start offboarding
        </button>
        <button className="btn ghost" onClick={close}>
          Close
        </button>
      </>
    );
  };

  const addEmployee = () =>
    form(
      "Add employee",
      [
        { k: "name", label: "Full name", req: true },
        { k: "role", label: "Job title", req: true },
        { k: "dept", label: "Department", type: "select", o: DEPTS },
        { k: "type", label: "Employment type", type: "select", o: ["Full-time", "Part-time", "Contract"] },
        { k: "salary", label: "Annual salary (USD)", type: "number", v: "60000", req: true },
        { k: "start", label: "Start date", type: "date", v: TODAY },
      ],
      (v) => {
        update((d) => {
          const id = nid(d.emps);
          d.emps.push({
            id,
            name: v.name,
            role: v.role,
            dept: v.dept,
            type: v.type,
            status: "Probation",
            start: v.start,
            salary: +v.salary || 0,
            email: emailFrom(v.name),
          });
          d.onb.push({ id: nid(d.onb), emp: id, tasks: DEFAULT_ONB.map((t) => ({ t, done: false })) });
          notify(v.name + " was added and onboarding has started.", "onboarding");
        }, v.name + " added");
      }
    );

  return (
    <>
      <div className="bar-tools">
        <input
          type="search"
          placeholder="Search by name, role or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search employees"
          style={{ minWidth: 260 }}
        />
        <select value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
          {["All", ...DEPTS].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="grow" />
        <button className="btn" onClick={addEmployee}>
          Add employee
        </button>
      </div>
      <div className="panel">
        {rows.length ? (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Start date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr className="click" key={e.id} onClick={() => openEmp(e.id)}>
                    <td>
                      <Person e={e} />
                    </td>
                    <td>{e.dept}</td>
                    <td>{e.type}</td>
                    <td>
                      <Pill t={estatus(S, e)} k={stKind(estatus(S, e))} />
                    </td>
                    <td>{fdate(e.start)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No employees match. Clear the search or add a new employee." />
        )}
      </div>
    </>
  );
}