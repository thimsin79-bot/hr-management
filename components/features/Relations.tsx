"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Pill } from "@/components/ui/ui";
import { TODAY } from "@/lib/constants";
import { empAt, fdate, nid } from "@/lib/utils";

export default function Relations() {
  const { S, update, form } = useApp();
  if (!S) return null;

  const kind: Record<string, string> = { High: "bad", Medium: "warn", Low: "mute" };
  const open = S.cases.filter((c) => c.status !== "Resolved").length;

  const add = () =>
    form(
      "Open a case",
      [
        { k: "type", label: "What is it about?", req: true },
        { k: "emp", label: "Raised by", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
        { k: "sev", label: "Priority", type: "select", o: ["Low", "Medium", "High"] },
      ],
      (v) => {
        update((d) => {
          d.cases.push({ id: nid(d.cases), type: v.type, emp: +v.emp, opened: TODAY, status: "Open", sev: v.sev });
          if (v.sev === "High") {
            d.notes.unshift({ id: nid(d.notes), text: "A high-priority case was opened: " + v.type + ".", time: "Just now", read: false, go: "relations" });
          }
        }, "Case opened");
      }
    );

  const setStatus = (id: number, v: string) =>
    update((d) => {
      const c = d.cases.find((x) => x.id === id);
      if (c) c.status = v;
    }, "Case marked " + v.toLowerCase());

  return (
    <>
      <div className="strip">
        <div>
          <b>{open}</b>
          <span>Open cases</span>
        </div>
        <div>
          <b>{S.cases.filter((c) => c.sev === "High" && c.status !== "Resolved").length}</b>
          <span>High priority</span>
        </div>
        <div>
          <b>{S.cases.filter((c) => c.status === "Resolved").length}</b>
          <span>Resolved</span>
        </div>
      </div>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={add}>
          Open a case
        </button>
      </div>
      <div className="panel">
        {S.cases.length ? (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Raised by</th>
                  <th>Opened</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {S.cases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.type}</b>
                    </td>
                    <td>
                      <Person e={empAt(S, c.emp)} />
                    </td>
                    <td>{fdate(c.opened)}</td>
                    <td>
                      <Pill t={c.sev} k={kind[c.sev]} />
                    </td>
                    <td>
                      <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value)} aria-label="Status" style={{ minWidth: 150 }}>
                        {["Open", "Investigating", "Resolved"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No cases. Open a case when an employee raises a concern." />
        )}
      </div>
    </>
  );
}