"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Pill } from "@/components/ui/ui";
import { TODAY } from "@/lib/constants";
import { empAt, fdate, nid, wd } from "@/lib/utils";

export default function Leave() {
  const { S, update, form, toast } = useApp();
  const [lf, setLf] = useState("All");
  if (!S) return null;

  const list = S.leaves.filter((l) => lf === "All" || l.status === lf).sort((a, b) => b.from.localeCompare(a.from));
  const kind: Record<string, string> = { Pending: "warn", Approved: "ok", Declined: "bad" };

  const set = (id: number, v: string) =>
    update((d) => {
      const x = d.leaves.find((y) => y.id === id);
      if (x) x.status = v;
    }, "Leave " + v.toLowerCase());

  const add = () =>
    form(
      "Add leave request",
      [
        { k: "emp", label: "Employee", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
        { k: "type", label: "Leave type", type: "select", o: ["Annual", "Sick", "Parental", "Unpaid"] },
        { k: "from", label: "From", type: "date", v: TODAY, req: true },
        { k: "to", label: "To", type: "date", v: TODAY, req: true },
      ],
      (v) => {
        if (v.to < v.from) {
          toast("End date must be on or after the start date");
          return false;
        }
        update((d) => {
          d.leaves.push({ id: nid(d.leaves), emp: +v.emp, type: v.type, from: v.from, to: v.to, status: "Pending" });
        }, "Request added");
      }
    );

  return (
    <>
      <div className="bar-tools">
        <select value={lf} onChange={(e) => setLf(e.target.value)} aria-label="Filter by status">
          {["All", "Pending", "Approved", "Declined"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="grow" />
        <span style={{ color: "var(--muted)" }}>Annual allowance: {S.set.annualDays} days</span>
        <button className="btn" onClick={add}>
          Add leave request
        </button>
      </div>
      <div className="panel">
        {list.length ? (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Working days</th>
                  <th>Status</th>
                  <th className="r">Decision</th>
                </tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Person e={empAt(S, l.emp)} />
                    </td>
                    <td>{l.type}</td>
                    <td>
                      {fdate(l.from)} to {fdate(l.to)}
                    </td>
                    <td>{wd(l.from, l.to)}</td>
                    <td>
                      <Pill t={l.status} k={kind[l.status]} />
                    </td>
                    <td className="r">
                      {l.status === "Pending" && (
                        <div className="acts" style={{ justifyContent: "flex-end" }}>
                          <button className="btn sm" onClick={() => set(l.id, "Approved")}>
                            Approve
                          </button>
                          <button className="btn sm ghost" onClick={() => set(l.id, "Declined")}>
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No leave requests with this status." />
        )}
      </div>
    </>
  );
}