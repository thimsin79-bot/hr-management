"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Pill } from "@/components/ui/ui";
import type { Emp } from "@/lib/types";
import { activeEmps, gross, money } from "@/lib/utils";

export default function Payroll() {
  const { S, update } = useApp();
  if (!S) return null;

  const list = activeEmps(S);
  const r = S.set.deduction / 100;
  const g = list.reduce((s, e) => s + gross(e), 0);
  const steps = ["Draft", "Approved", "Paid"];
  const i = steps.indexOf(S.payroll.status);

  const next = () =>
    update((d) => {
      d.payroll.status = d.payroll.status === "Draft" ? "Approved" : "Paid";
    }, "Payroll " + (S.payroll.status === "Draft" ? "approved" : "marked as paid"));

  return (
    <>
      <div className="hdr">
        <h2 style={{ fontSize: 18 }}>{S.payroll.period}</h2>
        {i < 2 ? (
          <button className="btn" onClick={next}>
            {i === 0 ? "Approve payroll" : "Mark as paid"}
          </button>
        ) : (
          <Pill t="Paid" k="ok" />
        )}
      </div>
      <div className="steps">
        {steps.map((s, j) => (
          <span className={j <= i ? "on" : ""} key={s}>
            {s}
          </span>
        ))}
      </div>
      <div className="strip">
        <div>
          <b>{money(g)}</b>
          <span>Gross pay</span>
        </div>
        <div>
          <b>{money(g * r)}</b>
          <span>
            Deductions ({S.set.deduction}%)
          </span>
        </div>
        <div>
          <b>{money(g * (1 - r))}</b>
          <span>Net pay</span>
        </div>
      </div>
      <div className="panel">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th className="r">Gross</th>
                <th className="r">Deductions</th>
                <th className="r">Net</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e: Emp) => (
                <tr key={e.id}>
                  <td>
                    <b>{e.name}</b>
                    <small style={{ display: "block", color: "var(--muted)" }}>{e.role}</small>
                  </td>
                  <td>{e.dept}</td>
                  <td className="r">{money(gross(e))}</td>
                  <td className="r">{money(gross(e) * r)}</td>
                  <td className="r">
                    <b>{money(gross(e) * (1 - r))}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}