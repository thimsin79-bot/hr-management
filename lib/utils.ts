import { COLORS, TODAY } from "./constants";
import type { Data, Emp } from "./types";

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function fdate(d?: string) {
  return d
    ? new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "\u2013";
}

export function todayLabel() {
  return new Date(TODAY + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const nid = (a: { id: number }[]) => Math.max(0, ...a.map((x) => x.id)) + 1;

export function tomin(t?: string) {
  const p = (t || "0:0").split(":");
  return +p[0] * 60 + +p[1];
}

export const nowHM = () => new Date().toTimeString().slice(0, 5);

export function wd(a: string, b: string) {
  const d = new Date(a + "T00:00:00Z");
  const e = new Date(b + "T00:00:00Z");
  let n = 0;
  while (d <= e) {
    const g = d.getUTCDay();
    if (g && g !== 6) n++;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return Math.max(n, 1);
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export const colorFor = (id: number) => COLORS[id % COLORS.length];

const UNKNOWN: Emp = { id: 0, name: "Unknown", role: "", dept: "", type: "", status: "", start: "", salary: 0, email: "" };

export const empAt = (S: Data, id: number): Emp => S.emps.find((e) => e.id === id) || UNKNOWN;

export const onLeave = (S: Data, id: number) =>
  S.leaves.some((l) => l.emp === id && l.status === "Approved" && l.from <= TODAY && TODAY <= l.to);

export const estatus = (S: Data, e: Emp) => (onLeave(S, e.id) ? "On leave" : e.status);

export const stKind = (s: string) => (({ Active: "ok", Probation: "warn", "On leave": "info" } as Record<string, string>)[s] || "mute");

export const activeEmps = (S: Data) => S.emps.filter((e) => !S.off.some((o) => o.emp === e.id && o.last < TODAY));

export const gross = (e: Emp) => e.salary / 12;

export function emailFrom(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z ]/g, "")
      .replace(/ /g, ".") + "@northwind.example"
  );
}