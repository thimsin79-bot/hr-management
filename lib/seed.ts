import type { Data } from "./types";
import { emailFrom } from "./utils";

export function buildSeed(): Data {
  const E = [
    { id: 1, name: "Alice Johnson", role: "Software Engineer", dept: "Engineering", type: "Full-time", status: "Active", start: "2023-01-15", salary: 7000, gender: "Female", dob: "1992-04-18", nationality: "American", idNo: "US-8842190", contact: "+1 415 555 0132", placeOfBirth: "Seattle, USA", address: "128 Pine St, San Francisco, CA", qualification: "BSc Computer Science" },
    { id: 2, name: "Bob Smith", role: "Product Manager", dept: "Product", type: "Full-time", status: "Active", start: "2022-06-01", salary: 8000, gender: "Male", dob: "1988-11-02", nationality: "British", idNo: "GB-3391048", contact: "+44 20 7946 0958", placeOfBirth: "Manchester, UK", address: "45 Camden Rd, London", qualification: "MBA" },
    { id: 3, name: "Carol Lee", role: "UI Designer", dept: "Design", type: "Full-time", status: "Active", start: "2024-03-10", salary: 6500, gender: "Female", dob: "1995-07-27", nationality: "Singaporean", idNo: "SG-1188204", contact: "+65 8123 4456", placeOfBirth: "Singapore", address: "12 Tanjong Pagar Rd, Singapore", qualification: "BA Graphic Design" },
  ].map((a) => ({ ...a, email: emailFrom(a.name) }));

  return {
    emps: E,
    users: [
      { id: 1, name: "Admin", email: "admin@people.desk", role: "Admin", status: "Active", created: "2026-09-01", password: "admin123" },
    ],
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
