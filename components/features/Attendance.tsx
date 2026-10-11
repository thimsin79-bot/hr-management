"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Person, Pill } from "@/components/ui/ui";
import type { Emp } from "@/lib/types";
import { empAt, nowHM, onLeave, tomin } from "@/lib/utils";

export default function Attendance() {
  const { S, update } = useApp();
  if (!S) return null;

  const list = S.emps.filter((e) => !onLeave(S, e.id));
  const lim = tomin(S.set.workStart) + S.set.grace;
  const rec = (e: Emp) => S.att[e.id];
  const present = list.filter((e) => rec(e)).length;
  const late = list.filter((e) => rec(e) && tomin(rec(e)[0]) > lim).length;
  const away = S.emps.length - list.length;

  const clockIn = (id: number) => update((d) => void (d.att[id] = [nowHM(), ""]), empAt(S, id).name + " clocked in");
  const clockOut = (id: number) => update((d) => void (d.att[id][1] = nowHM()), empAt(S, id).name + " clocked out");

  return (
    <>
      <div className="strip">
        <div>
          <b>{present}</b>
          <span>Clocked in</span>
        </div>
        <div>
          <b>{late}</b>
          <span>
            Late (after {S.set.workStart} + {S.set.grace} min)
          </span>
        </div>
        <div>
          <b>{list.length - present}</b>
          <span>Not in yet</span>
        </div>
        <div>
          <b>{away}</b>
          <span>On leave</span>
        </div>
      </div>
      <div className="panel">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>In</th>
                <th>Out</th>
                <th>Hours</th>
                <th className="r">Action</th>
              </tr>
            </thead>
            <tbody>
              {S.emps.map((e) => {
                if (onLeave(S, e.id))
                  return (
                    <tr key={e.id}>
                      <td>
                        <Person e={e} />
                      </td>
                      <td>
                        <Pill t="On leave" k="info" />
                      </td>
                      <td>–</td>
                      <td>–</td>
                      <td>–</td>
                      <td />
                    </tr>
                  );
                const r = rec(e);
                let st = <Pill t="Not in yet" k="mute" />;
                let h = "–";
                if (r) {
                  st = tomin(r[0]) > lim ? <Pill t="Late" k="warn" /> : <Pill t="On time" k="ok" />;
                  if (r[1]) h = ((tomin(r[1]) - tomin(r[0])) / 60).toFixed(1);
                }
                return (
                  <tr key={e.id}>
                    <td>
                      <Person e={e} />
                    </td>
                    <td>{st}</td>
                    <td>{r ? r[0] : "–"}</td>
                    <td>{r && r[1] ? r[1] : "–"}</td>
                    <td>{h}</td>
                    <td className="r">
                      {!r ? (
                        <button className="btn sm" onClick={() => clockIn(e.id)}>
                          Clock in
                        </button>
                      ) : !r[1] ? (
                        <button className="btn sm ghost" onClick={() => clockOut(e.id)}>
                          Clock out
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}