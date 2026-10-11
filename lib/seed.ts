import type { Data } from "./types";
import { emailFrom } from "./utils";

export function buildSeed(): Data {
  const E = [
    [1, "Alice Johnson", "Software Engineer", "Engineering", "Full-time", "Active", "2023-01-15", 85000],
    [2, "Bob Smith", "Product Manager", "Product", "Full-time", "Active", "2022-06-01", 95000],
    [3, "Carol Lee", "UI Designer", "Design", "Full-time", "Active", "2024-03-10", 78000],
  ].map((a) => ({
    id: a[0] as number,
    name: a[1] as string,
    role: a[2] as string,
    dept: a[3] as string,
    type: a[4] as string,
    status: a[5] as string,
    start: a[6] as string,
    salary: a[7] as number,
    email: emailFrom(a[1] as string),
  }));

  return {
    emps: E,
    heads: {},
    leaves: [],
    jobs: [],
    stages: [],
    cands: [],
    onb: [],
    att: {},
    payroll: { period: "September 2026", status: "Draft" },
    perf: [],
    courses: [],
    assign: [],
    plans: [],
    enrol: [],
    docs: [],
    cases: [],
    off: [],
    notes: [],
    set: { company: "Northwind Group", workStart: "09:00", grace: 15, annualDays: 18, deduction: 14, theme: "light" },
  };
}
