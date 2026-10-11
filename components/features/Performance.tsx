"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Person, Pill, Progress } from "@/components/ui/ui";
import { empAt } from "@/lib/utils";

export default function Performance() {
  const { S, update, form } = useApp();
  if (!S) return null;

  const rated = S.perf.filter((p) => p.rating > 0);
  const avg = rated.length ? (rated.reduce((s, p) => s + p.rating, 0) / rated.length).toFixed(1) : "–";

  const addGoal = () =>
    form(
      "Add goal",
      [
        { k: "emp", label: "Employee", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
        { k: "goal", label: "Goal", req: true },
      ],
      (v) => {
        update((d) => {
          d.perf.push({ emp: +v.emp, goal: v.goal, progress: 0, rating: 0 });
        }, "Goal added");
      }
    );

  return (
    <>
      <div className="strip">
        <div>
          <b>{S.perf.length}</b>
          <span>Reviews this cycle (H2 2026)</span>
        </div>
        <div>
          <b>{rated.length}</b>
          <span>Rated</span>
        </div>
        <div>
          <b>{avg}</b>
          <span>Average rating out of 5</span>
        </div>
      </div>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn" onClick={addGoal}>
          Add goal
        </button>
      </div>
      <div className="panel">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th>Progress</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {S.perf.map((p, i) => (
                <tr key={i}>
                  <td>
                    <Person e={empAt(S, p.emp)} />
                  </td>
                  <td>{p.goal}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Progress p={p.progress} />
                      <span>{p.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <select
                      value={p.rating}
                      onChange={(e) =>
                        update((d) => {
                          d.perf[i].rating = +e.target.value;
                        }, "Rating saved")
                      }
                      aria-label={"Rating for " + empAt(S, p.emp).name}
                    >
                      {["Not rated", 1, 2, 3, 4, 5].map((o, j) => (
                        <option value={j} key={j}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{p.rating ? <Pill t="Reviewed" k="ok" /> : <Pill t="In progress" k="warn" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}