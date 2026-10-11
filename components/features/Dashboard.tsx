"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Bars, Empty } from "@/components/ui/ui";
import { DEPTS } from "@/lib/constants";
import { activeEmps, empAt, fdate, onLeave, wd } from "@/lib/utils";

export default function Dashboard() {
  const { S, update } = useApp();
  const router = useRouter();
  if (!S) return null;

  const pend = S.leaves.filter((l) => l.status === "Pending");
  const offers = S.cands.filter((c) => c.stage === "Offer");
  const hi = S.cases.filter((c) => c.sev === "High" && c.status !== "Resolved");
  const byDept = DEPTS.map((d) => [d, S.emps.filter((e) => e.dept === d).length] as [string, number]);
  const openRoles = S.jobs.reduce((s, j) => s + j.openings, 0);

  const setLeave = (id: number, v: string) =>
    update((d) => {
      const x = d.leaves.find((y) => y.id === id);
      if (x) x.status = v;
    }, "Leave " + v.toLowerCase());

  const queue: ReactNode[] = [];
  pend.forEach((l) =>
    queue.push(
      <li key={"l" + l.id}>
        <div className="tx">
          <b>{empAt(S, l.emp).name}</b> asked for {wd(l.from, l.to)} days of {l.type.toLowerCase()} leave
          <small>
            {fdate(l.from)} to {fdate(l.to)}
          </small>
        </div>
        <div className="acts">
          <button className="btn sm" onClick={() => setLeave(l.id, "Approved")}>
            Approve
          </button>
          <button className="btn sm ghost" onClick={() => setLeave(l.id, "Declined")}>
            Decline
          </button>
        </div>
      </li>
    )
  );
  offers.forEach((c) =>
    queue.push(
      <li key={"c" + c.id}>
        <div className="tx">
          <b>{c.name}</b> has an offer out
          <small>{c.role}</small>
        </div>
        <button className="btn sm ghost" onClick={() => router.push("/recruitment")}>
          View pipeline
        </button>
      </li>
    )
  );
  hi.forEach((c) =>
    queue.push(
      <li key={"h" + c.id}>
        <div className="tx">
          <b>{c.type}</b> is high priority
          <small>Raised by {empAt(S, c.emp).name}</small>
        </div>
        <button className="btn sm ghost" onClick={() => router.push("/relations")}>
          Open case
        </button>
      </li>
    )
  );
  if (S.payroll.status === "Draft")
    queue.push(
      <li key="pay">
        <div className="tx">
          <b>{S.payroll.period} payroll</b> is waiting for approval
          <small>{activeEmps(S).length} employees</small>
        </div>
        <button className="btn sm ghost" onClick={() => router.push("/payroll")}>
          Review
        </button>
      </li>
    );

  return (
    <>
      <div className="strip">
        <div>
          <b>{S.emps.length}</b>
          <span>Employees</span>
        </div>
        <div>
          <b>{S.emps.filter((e) => onLeave(S, e.id)).length}</b>
          <span>On leave today</span>
        </div>
        <div>
          <b>{openRoles}</b>
          <span>Open roles</span>
        </div>
        <div>
          <b>{pend.length}</b>
          <span>Leave requests waiting</span>
        </div>
      </div>
      <div className="grid2">
        <div className="panel">
          <h3>Needs your attention</h3>
          {queue.length ? (
            <ul className="queue" style={{ marginTop: 8 }}>
              {queue}
            </ul>
          ) : (
            <Empty t="Nothing is waiting on you. New requests will show up here." />
          )}
        </div>
        <div style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <h3>Headcount by department</h3>
            <div className="pb">
              <Bars items={byDept} />
            </div>
          </div>
          <div className="panel">
            <h3>Coming up</h3>
            <ul className="queue" style={{ marginTop: 6 }}>
              <li>
                <div className="tx">
                  <b>Payroll cut-off</b>
                  <small>{fdate("2026-09-28")}</small>
                </div>
              </li>
              <li>
                <div className="tx">
                  <b>Performance reviews due</b>
                  <small>{fdate("2026-10-15")}</small>
                </div>
              </li>
              {S.off.map((o) => (
                <li key={o.id}>
                  <div className="tx">
                    <b>{empAt(S, o.emp).name} leaves</b>
                    <small>{fdate(o.last)}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}