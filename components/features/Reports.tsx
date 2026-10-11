"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Bars } from "@/components/ui/ui";
import { DEPTS, TODAY } from "@/lib/constants";
import { gross, money, wd } from "@/lib/utils";

export default function Reports() {
  const { S } = useApp();
  if (!S) return null;

  const list = S.emps;
  const tenure = list.reduce((s, e) => s + (new Date(TODAY).getTime() - new Date(e.start).getTime()) / (365.25 * 864e5), 0) / list.length;
  const rated = S.perf.filter((p) => p.rating);
  const avg = rated.length ? (rated.reduce((s, p) => s + p.rating, 0) / rated.length).toFixed(1) : "–";
  const types = ["Annual", "Sick", "Parental", "Unpaid"];
  const lv = types.map((t) => [t, S.leaves.filter((l) => l.type === t && l.status !== "Declined").reduce((s, l) => s + wd(l.from, l.to), 0)] as [string, number]);
  const pay = DEPTS.map((d) => [d, S.emps.filter((e) => e.dept === d).reduce((s, e) => s + gross(e), 0)] as [string, number]);
  const src: Record<string, number> = {};
  S.cands.forEach((c) => (src[c.source] = (src[c.source] || 0) + 1));

  return (
    <>
      <div className="strip">
        <div>
          <b>{list.length}</b>
          <span>Headcount</span>
        </div>
        <div>
          <b>{tenure.toFixed(1)}</b>
          <span>Average years of service</span>
        </div>
        <div>
          <b>{avg}</b>
          <span>Average rating</span>
        </div>
        <div>
          <b>{S.cands.filter((c) => c.stage !== "Hired").length}</b>
          <span>Active candidates</span>
        </div>
      </div>
      <div className="grid3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <div className="panel">
          <h3>Headcount by department</h3>
          <div className="pb">
            <Bars items={DEPTS.map((d) => [d, list.filter((e) => e.dept === d).length])} />
          </div>
        </div>
        <div className="panel">
          <h3>Leave days by type</h3>
          <div className="pb">
            <Bars items={lv} />
          </div>
        </div>
        <div className="panel">
          <h3>Monthly gross pay by department</h3>
          <div className="pb">
            <Bars items={pay} fmt={money} />
          </div>
        </div>
        <div className="panel">
          <h3>Where candidates come from</h3>
          <div className="pb">
            <Bars items={Object.entries(src) as [string, number][]} />
          </div>
        </div>
      </div>
    </>
  );
}