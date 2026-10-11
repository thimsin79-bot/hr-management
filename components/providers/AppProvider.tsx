"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MouseEvent, ReactNode } from "react";
import { DEPTS, STORE_KEY } from "../../lib/constants";
import { databaseLoad, persistKeys, pingDatabase } from "../../lib/db";
import { buildSeed } from "../../lib/seed";
import { isSupabaseConfigured } from "../../lib/supabase";
import type { Data } from "../../lib/types";
import { nid } from "../../lib/utils";

const KEYS: (keyof Data)[] = [
  "emps", "heads", "leaves", "jobs", "stages", "cands", "onb", "att", "payroll",
  "perf", "courses", "assign", "plans", "enrol", "docs", "cases", "off", "notes", "set",
];

function ensureDepts(d: Data) {
  for (const k of Object.keys(d.heads)) {
    if (!DEPTS.includes(k)) DEPTS.push(k);
  }
}

function mirrorLocal(d: Data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(d));
  } catch {
    /* ignore quota errors */
  }
}

export type FieldOpt = string | [string, string];
export type FieldDef = {
  k: string;
  label: string;
  req?: boolean;
  type?: string;
  v?: string | number;
  o?: FieldOpt[];
  full?: boolean;
};
export type FormDef = {
  title: string;
  fields: FieldDef[];
  okLabel: string;
  onOk: (v: Record<string, string>) => boolean | void;
};
export type ModalDef = { head: ReactNode; body: ReactNode; foot?: ReactNode };

export type DbStatus = "connecting" | "connected" | "local" | "error";

type AppCtx = {
  S: Data | null;
  linked: boolean;
  dbStatus: DbStatus;
  checkDb: () => void;
  update: (fn: (d: Data) => void, msg?: string) => void;
  toast: (m: string) => void;
  notify: (text: string, go: string) => void;
  modal: (head: ReactNode, body: ReactNode, foot?: ReactNode) => void;
  form: (title: string, fields: FieldDef[], onOk: (v: Record<string, string>) => boolean | void, okLabel?: string) => void;
  close: () => void;
  reset: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [S, setS] = useState<Data | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormDef | null>(null);
  const [m, setM] = useState<ModalDef | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>(isSupabaseConfigured ? "connecting" : "local");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevRef = useRef<Data | null>(null);
  const sourcedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let d: Data | null = null;
      if (isSupabaseConfigured) {
        try {
          d = await databaseLoad();
          sourcedRef.current = true;
          if (!cancelled) setDbStatus("connected");
        } catch (e) {
          console.warn("[supabase] load failed, using local cache", e);
          if (!cancelled) setDbStatus("error");
        }
      } else {
        if (!cancelled) setDbStatus("local");
      }
      if (!d) {
        try {
          const raw = localStorage.getItem(STORE_KEY);
          if (raw) d = JSON.parse(raw) as Data;
        } catch {
          d = null;
        }
        if (!d || !d.emps) d = buildSeed();
      }
      ensureDepts(d);
      if (cancelled) return;
      mirrorLocal(d);
      setS(d);
    })();
    return () => {
      cancelled = true;
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!S) return;
    mirrorLocal(S);
    const prev = prevRef.current;
    let changed: (keyof Data)[] = [];
    if (!prev) {
      if (!sourcedRef.current) changed = KEYS;
    } else {
      changed = KEYS.filter((k) => JSON.stringify(prev[k]) !== JSON.stringify(S[k]));
    }
    prevRef.current = S;
    if (changed.length && isSupabaseConfigured) {
      void persistKeys(S, changed).then((ok) => setDbStatus(ok ? "connected" : "error"));
    }
  }, [S]);

  const checkDb = () => {
    if (!isSupabaseConfigured) {
      setDbStatus("local");
      return;
    }
    setDbStatus("connecting");
    void pingDatabase().then((ok) => setDbStatus(ok ? "connected" : "error"));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  };

  const update = (fn: (d: Data) => void, msg?: string) => {
    setS((prev) => {
      if (!prev) return prev;
      const d: Data = { ...prev };
      fn(d);
      return d;
    });
    if (msg) showToast(msg);
  };

  const notify = (text: string, go: string) =>
    update((d) => {
      d.notes.unshift({ id: nid(d.notes), text, time: "Just now", read: false, go });
    });

  const modal = (head: ReactNode, body: ReactNode, foot?: ReactNode) => setM({ head, body, foot });
  const form = (title: string, fields: FieldDef[], onOk: (v: Record<string, string>) => boolean | void, okLabel = "Save") =>
    setFormState({ title, fields, okLabel, onOk });

  const close = () => {
    setM(null);
    setFormState(null);
  };

  const reset = () => setS(buildSeed());

  const theme = S ? S.set.theme : null;
  useEffect(() => {
    if (!theme) return;
    const el = document.documentElement;
    if (theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
  }, [theme]);

  const value: AppCtx = { S, linked: isSupabaseConfigured, dbStatus, checkDb, update, toast: showToast, notify, modal, form, close, reset };

  return (
    <Ctx.Provider value={value}>
      {children}
      {m && (
        <Overlay
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="dlg">
            <div className="mh">
              {m.head}
              <button className="x" onClick={close} aria-label="Close">
                {"\u2715"}
              </button>
            </div>
            <div className="mb">{m.body}</div>
            {m.foot ? <div className="mf">{m.foot}</div> : null}
          </div>
        </Overlay>
      )}
      {formState && (
        <Overlay
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <FormDialog key={formState.title + formState.fields.length} form={formState} onCancel={close} toast={showToast} />
        </Overlay>
      )}
      {toastMsg && (
        <div id="toast" className="show" role="status">
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  );
}

function Overlay({ onClick, children }: { onClick: (e: MouseEvent<HTMLDivElement>) => void; children: ReactNode }) {
  return (
    <div className="overlay" onClick={onClick}>
      {children}
    </div>
  );
}

function FormDialog({ form, onCancel, toast }: { form: FormDef; onCancel: () => void; toast: (m: string) => void }) {
  const [vals, setVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of form.fields) {
      init[f.k] = String(f.v ?? (Array.isArray(f.o?.[0]) ? (f.o![0] as [string, string])[0] : f.o?.[0] ?? ""));
    }
    return init;
  });

  const submit = () => {
    const miss = form.fields.find((f) => f.req && !vals[f.k]);
    if (miss) {
      toast(miss.label + " is required");
      return;
    }
    if (form.onOk(vals) === false) return;
    onCancel();
  };

  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));

  const wide = form.fields.length > 6;

  return (
    <div className={"dlg" + (wide ? " wide" : "")}>
      <div className="mh">
        <h3>{form.title}</h3>
        <button className="x" onClick={onCancel} aria-label="Close">
          {"\u2715"}
        </button>
      </div>
      <div className={"mb" + (wide ? " cols2" : "")}>
        {form.fields.map((f) => (
          <label key={f.k} className={f.full ? "full" : undefined}>
            {f.label}
            {f.req ? " *" : ""}
            {f.type === "select" ? (
              <select value={vals[f.k]} onChange={(e) => set(f.k, e.target.value)}>
                {(f.o! || []).map((o) =>
                  Array.isArray(o) ? (
                    <option key={o[0]} value={o[0]}>
                      {o[1]}
                    </option>
                  ) : (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  )
                )}
              </select>
            ) : (
              <input type={f.type || "text"} value={vals[f.k]} onChange={(e) => set(f.k, e.target.value)} />
            )}
          </label>
        ))}
      </div>
      <div className="mf">
        <button className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn" onClick={submit}>
          {form.okLabel}
        </button>
      </div>
    </div>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}