"use client";

import { useApp } from "@/components/providers/AppProvider";
import { DEFAULT_OFF } from "@/lib/constants";
import { fdate, nid } from "@/lib/utils";

export function useStartOffboard() {
  const { S, form, toast, update } = useApp();

  return (presetEmp?: number) => {
    if (!S) return;
    const free = S.emps.filter((e) => !S.off.some((o) => o.emp === e.id));
    if (!free.length) {
      toast("Everyone is already being offboarded");
      return;
    }
    if (presetEmp && !free.some((e) => e.id === presetEmp)) presetEmp = undefined;

    form(
      "Start offboarding",
      [
        { k: "emp", label: "Employee", type: "select", o: free.map((e) => [String(e.id), e.name]), v: presetEmp ? String(presetEmp) : undefined },
        { k: "last", label: "Last working day", type: "date", v: "2026-10-30", req: true },
        { k: "reason", label: "Reason", type: "select", o: ["Resignation", "End of contract", "Retirement", "Dismissal"] },
      ],
      (v) => {
        const id = +v.emp;
        const e = S.emps.find((x) => x.id === id);
        update((d) => {
          d.off.push({ id: nid(d.off), emp: id, last: v.last, reason: v.reason, tasks: DEFAULT_OFF.map((t) => ({ t, done: false })) });
          d.notes.unshift({ id: nid(d.notes), text: e?.name + " is leaving on " + fdate(v.last) + ".", time: "Just now", read: false, go: "offboarding" });
        }, "Offboarding started");
      }
    );
  };
}