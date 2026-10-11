import type { ComponentType } from "react";
import Attendance from "./Attendance";
import Benefits from "./Benefits";
import Dashboard from "./Dashboard";
import Documents from "./Documents";
import Employees from "./Employees";
import Leave from "./Leave";
import Notifications from "./Notifications";
import Offboarding from "./Offboarding";
import Onboarding from "./Onboarding";
import Organization from "./Organization";
import Payroll from "./Payroll";
import Performance from "./Performance";
import Recruitment from "./Recruitment";
import Relations from "./Relations";
import Reports from "./Reports";
import Settings from "./Settings";
import Training from "./Training";
import Users from "./Users";

export const VIEWS: Record<string, ComponentType> = {
  dashboard: Dashboard,
  employees: Employees,
  users: Users,
  organization: Organization,
  recruitment: Recruitment,
  onboarding: Onboarding,
  attendance: Attendance,
  leave: Leave,
  payroll: Payroll,
  performance: Performance,
  training: Training,
  benefits: Benefits,
  documents: Documents,
  relations: Relations,
  offboarding: Offboarding,
  reports: Reports,
  notifications: Notifications,
  settings: Settings,
};