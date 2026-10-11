"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Empty, Person, Pill, Progress } from "@/components/ui/ui";
import { empAt, nid } from "@/lib/utils";

export default function Training() {
  const { S, update, form } = useApp();
  if (!S) return null;

  const courseAdd = () =>
    form(
      "Add course",
      [
        { k: "title", label: "Course title", req: true },
        { k: "hours", label: "Hours", type: "number", v: "2" },
        { k: "req", label: "Required for everyone?", type: "select", o: ["No", "Yes"] },
      ],
      (v) => {
        update((d) => {
          d.courses.push({ id: nid(d.courses), title: v.title, hours: +v.hours || 1, mandatory: v.req === "Yes" });
        }, "Course added");
      }
    );

  const assignAdd = () =>
    form(
      "Assign course",
      [
        { k: "emp", label: "Employee", type: "select", o: S.emps.map((e) => [String(e.id), e.name]) },
        { k: "course", label: "Course", type: "select", o: S.courses.map((c) => [String(c.id), c.title]) },
      ],
      (v) => {
        update((d) => {
          d.assign.push({ id: nid(d.assign), emp: +v.emp, course: +v.course, progress: 0 });
        }, "Course assigned");
      }
    );

  const setProgress = (id: number, p: number) =>
    update((d) => {
      const a = d.assign.find((x) => x.id === id);
      if (a) a.progress = p;
    });

  return (
    <>
      <div className="bar-tools">
        <span className="grow" />
        <button className="btn ghost" onClick={courseAdd}>
          Add course
        </button>
        <button className="btn" onClick={assignAdd}>
          Assign course
        </button>
      </div>
      <div className="grid3" style={{ marginBottom: 18 }}>
        {S.courses.map((c) => {
          const a = S.assign.filter((x) => x.course === c.id);
          const done = a.filter((x) => x.progress === 100).length;
          return (
            <div className="panel" key={c.id}>
              <div className="pb">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <h3 style={{ fontSize: 16 }}>{c.title}</h3>
                  {c.mandatory ? <Pill t="Required" k="warn" /> : null}
                </div>
                <p style={{ color: "var(--muted)", margin: "4px 0 12px" }}>
                  {c.hours} hours · {a.length} assigned · {done} finished
                </p>
                <Progress p={a.length ? Math.round((done / a.length) * 100) : 0} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel">
        <h3>Assignments</h3>
        {S.assign.length ? (
          <div className="tw">
            <table style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Course</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {S.assign.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Person e={empAt(S, a.emp)} />
                    </td>
                    <td>{S.courses.find((c) => c.id === a.course)?.title}</td>
                    <td>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={10}
                          value={a.progress}
                          onChange={(e) => setProgress(a.id, +e.target.value)}
                          aria-label="Progress"
                        />
                        <span>{a.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="Nothing assigned yet. Assign a course to an employee." />
        )}
      </div>
    </>
  );
}