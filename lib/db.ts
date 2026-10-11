import { isSupabaseConfigured, supabase } from "./supabase";
import type { Data, Doc, Leave, Job, Cand, Onb, Perf, Course, Assign, Plan, Case, Off, Note, Emp } from "./types";

const TABLE: Record<keyof Data, string> = {
  emps: "employees",
  heads: "departments",
  leaves: "leaves",
  jobs: "jobs",
  stages: "stages",
  cands: "candidates",
  onb: "onboarding",
  att: "attendance",
  payroll: "payroll",
  perf: "performance",
  courses: "courses",
  assign: "assignments",
  plans: "plans",
  enrol: "enrolments",
  docs: "documents",
  cases: "cases",
  off: "offboarding",
  notes: "notes",
  set: "settings",
};

/** Column used as a never-matching delete filter so we can wipe a table safely. */
const DELETE_COL: Record<keyof Data, string> = {
  emps: "id",
  heads: "name",
  leaves: "id",
  jobs: "id",
  stages: "position",
  cands: "id",
  onb: "id",
  att: "emp",
  payroll: "id",
  perf: "emp",
  courses: "id",
  assign: "id",
  plans: "id",
  enrol: "emp",
  docs: "id",
  cases: "id",
  off: "id",
  notes: "id",
  set: "id",
};

function rowsFor(k: keyof Data, d: Data): Record<string, unknown>[] {
  switch (k) {
    case "emps":
      return d.emps.map(e => ({ ...e }));
    case "heads":
      return Object.entries(d.heads).map(([name, head]) => ({ name, head }));
    case "leaves":
      return d.leaves.map(l => ({ ...l }));
    case "jobs":
      return d.jobs.map(j => ({ ...j }));
    case "stages":
      return d.stages.map((name, position) => ({ position, name }));
    case "cands":
      return d.cands.map(c => ({ ...c }));
    case "onb":
      return d.onb.map(o => ({ id: o.id, emp: o.emp, tasks: o.tasks }));
    case "att":
      return Object.entries(d.att).map(([emp, v]) => ({ emp: +emp, check_in: v[0], check_out: v[1] }));
    case "payroll":
      return [{ id: 1, period: d.payroll.period, status: d.payroll.status }];
    case "perf":
      return d.perf.map(p => ({ ...p }));
    case "courses":
      return d.courses.map(c => ({ ...c }));
    case "assign":
      return d.assign.map(a => ({ ...a }));
    case "plans":
      return d.plans.map(p => ({ ...p }));
    case "enrol":
      return d.enrol.map(x => ({ emp: x.emp, plan: x.plan }));
    case "docs":
      return d.docs.map(x => ({ ...x }));
    case "cases":
      return d.cases.map(c => ({ ...c }));
    case "off":
      return d.off.map(o => ({ id: o.id, emp: o.emp, last: o.last, reason: o.reason, tasks: o.tasks }));
    case "notes":
      return d.notes.map(n => ({ ...n }));
    case "set":
      return [{ id: 1, company: d.set.company, work_start: d.set.workStart, grace: d.set.grace, annual_days: d.set.annualDays, deduction: d.set.deduction, theme: d.set.theme }];
  }
}

/** Fetch every table and rebuild the app state. Throws if Supabase is unreachable. */
export async function databaseLoad(): Promise<Data> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");

  const d = (
    await Promise.all([
      supabase.from("employees").select("*"),
      supabase.from("departments").select("*"),
      supabase.from("leaves").select("*"),
      supabase.from("jobs").select("*"),
      supabase.from("stages").select("*").order("position"),
      supabase.from("candidates").select("*"),
      supabase.from("onboarding").select("*"),
      supabase.from("attendance").select("*"),
      supabase.from("payroll").select("*"),
      supabase.from("performance").select("*"),
      supabase.from("courses").select("*"),
      supabase.from("assignments").select("*"),
      supabase.from("plans").select("*"),
      supabase.from("enrolments").select("*"),
      supabase.from("documents").select("*"),
      supabase.from("cases").select("*"),
      supabase.from("offboarding").select("*"),
      supabase.from("notes").select("*"),
      supabase.from("settings").select("*"),
    ])
  ).map(r => r.data as Record<string, unknown>[] | null);

  const [employees, departments, leaves, jobs, stages, candidates, onboarding, attendance, payroll, performance, courses, assignments, plans, enrolments, documents, cases, offboarding, notes, settings] = d;

  return {
    emps: ((employees || []) as unknown as Emp[]).map(e => ({
      ...e,
      start: e.start ?? "",
      email: e.email ?? "",
    })),
    heads: Object.fromEntries((departments || []).map(r => [r.name as string, r.head as number])),
    leaves: ((leaves || []) as unknown as Leave[]).map(l => ({ ...l })),
    jobs: ((jobs || []) as unknown as Job[]).map(j => ({ ...j })),
    stages: (stages || []).map(s => s.name as string),
    cands: ((candidates || []) as unknown as Cand[]).map(c => ({ ...c })),
    onb: ((onboarding || []) as unknown as Onb[]).map(o => ({ ...o })),
    att: Object.fromEntries(
      (attendance || []).map(r => [r.emp as number, [r.check_in as string ?? "", r.check_out as string ?? ""]] as [number, [string, string]])
    ),
    payroll: {
      period: (payroll?.[0]?.period as string) || "September 2026",
      status: (payroll?.[0]?.status as string) || "Draft",
    },
    perf: ((performance || []) as unknown as Perf[]).map(p => ({ ...p })),
    courses: ((courses || []) as unknown as Course[]).map(c => ({ ...c })),
    assign: ((assignments || []) as unknown as Assign[]).map(a => ({ ...a })),
    plans: ((plans || []) as unknown as Plan[]).map(p => ({ ...p })),
    enrol: (enrolments || []).map(x => ({ emp: x.emp as number, plan: x.plan as number })),
    docs: ((documents || []) as unknown as (Doc & { cand: string | null })[]).map(x => ({
      ...x,
      cand: x.cand ?? undefined,
    })),
    cases: ((cases || []) as unknown as Case[]).map(c => ({ ...c })),
    off: ((offboarding || []) as unknown as Off[]).map(o => ({ ...o })),
    notes: ((notes || []) as unknown as Note[]).map(n => ({ ...n })),
    set: {
      company: (settings?.[0]?.company as string) || "Northwind Group",
      workStart: (settings?.[0]?.work_start as string) || "09:00",
      grace: (settings?.[0]?.grace as number) ?? 15,
      annualDays: (settings?.[0]?.annual_days as number) ?? 18,
      deduction: (settings?.[0]?.deduction as number) ?? 14,
      theme: (settings?.[0]?.theme as string) || "light",
    },
  };
}

/** Write the given top-level keys back to their tables (wipe + reinsert). */
export async function persistKeys(d: Data, keys: (keyof Data)[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;
  let ok = true;
  for (const k of keys) {
    const table = TABLE[k];
    const rows = rowsFor(k, d);
    try {
      await supabase.from(table).delete().neq(DELETE_COL[k], -1);
      if (rows.length) {
        await supabase.from(table).insert(rows as never);
      }
    } catch (e) {
      // Network/RLS failures must never break the UI; localStorage keeps a mirror.
      ok = false;
      console.warn(`[supabase] failed to sync "${table}"`, e);
    }
  }
  return ok;
}

/** Lightweight connectivity check against the database. */
export async function pingDatabase(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from("settings").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}