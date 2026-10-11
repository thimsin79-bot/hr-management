export type Task = { t: string; done: boolean };

export type Emp = {
  id: number;
  name: string;
  role: string;
  dept: string;
  type: string;
  status: string;
  start: string;
  salary: number;
  email: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  idNo?: string;
  contact?: string;
  placeOfBirth?: string;
  address?: string;
};

export type Leave = {
  id: number;
  emp: number;
  type: string;
  from: string;
  to: string;
  status: string;
};

export type Job = { id: number; title: string; dept: string; openings: number };

export type Cand = {
  id: number;
  name: string;
  role: string;
  stage: string;
  source: string;
};

export type Onb = { id: number; emp: number; tasks: Task[] };

export type Perf = { emp: number; goal: string; progress: number; rating: number };

export type Course = { id: number; title: string; hours: number; mandatory: boolean };

export type Assign = { id: number; emp: number; course: number; progress: number };

export type Plan = { id: number; name: string; type: string; provider: string; cost: number };

export type Doc = {
  id: number;
  name: string;
  emp: number;
  type: string;
  updated: string;
  status: string;
  cand?: string;
};

export type Case = {
  id: number;
  type: string;
  emp: number;
  opened: string;
  status: string;
  sev: string;
};

export type Off = { id: number; emp: number; last: string; reason: string; tasks: Task[] };

export type Note = { id: number; text: string; time: string; read: boolean; go: string };

export type AppSettings = {
  company: string;
  workStart: string;
  grace: number;
  annualDays: number;
  deduction: number;
  theme: string;
};

export type Data = {
  emps: Emp[];
  heads: Record<string, number>;
  leaves: Leave[];
  jobs: Job[];
  stages: string[];
  cands: Cand[];
  onb: Onb[];
  att: Record<number, [string, string]>;
  payroll: { period: string; status: string };
  perf: Perf[];
  courses: Course[];
  assign: Assign[];
  plans: Plan[];
  enrol: { emp: number; plan: number }[];
  docs: Doc[];
  cases: Case[];
  off: Off[];
  notes: Note[];
  set: AppSettings;
};