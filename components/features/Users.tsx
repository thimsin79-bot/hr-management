"use client";

import { useState } from "react";
import { useApp, type FieldDef } from "@/components/providers/AppProvider";
import { Empty, Pill } from "@/components/ui/ui";
import { TODAY } from "@/lib/constants";
import type { User } from "@/lib/types";
import { colorFor, fdate, initials, nid, stKind } from "@/lib/utils";

const ROLES = ["Admin", "HR Manager", "Manager", "Employee"];
const STATUSES = ["Active", "Inactive"];
const dash = (s?: string) => (s && s.trim() ? s : "\u2013");

const userFields = (u?: User): FieldDef[] => [
  { k: "name", label: "Full name", req: true, v: u?.name },
  { k: "email", label: "Email", type: "email", req: true, v: u?.email },
  { k: "password", label: "Password", type: "password", req: true, v: u?.password },
  { k: "role", label: "Role", type: "select", o: ROLES, v: u?.role },
  { k: "status", label: "Status", type: "select", o: STATUSES, v: u?.status },
];

export default function Users() {
  const { S, update, modal, close, form, notify } = useApp();
  const [q, setQ] = useState("");

  if (!S) return null;

  const rows = S.users.filter(
    (u) => !q || [u.name, u.email, u.role].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const openUser = (id: number) => {
    const u = S.users.find((x) => x.id === id);
    if (!u) return;
    modal(
      <h3>{u.name}</h3>,
      <dl className="kv">
        <dt>Email</dt>
        <dd>{u.email}</dd>
        <dt>Role</dt>
        <dd>{u.role}</dd>
        <dt>Status</dt>
        <dd>{u.status}</dd>
        <dt>Created</dt>
        <dd>{fdate(u.created)}</dd>
      </dl>,
      <>
        <button
          className="btn"
          onClick={() => {
            close();
            editUser(u);
          }}
        >
          Edit
        </button>
        <button
          className="btn bad"
          onClick={() => {
            if (confirm(`Delete ${u.name}?`)) {
              close();
              update((d) => {
                d.users = d.users.filter((x) => x.id !== u.id);
              }, `${u.name} deleted`);
            }
          }}
        >
          Delete
        </button>
        <button className="btn ghost" onClick={close}>
          Close
        </button>
      </>
    );
  };

  const createUser = () =>
    form(
      "Create user",
      userFields(),
      (v) => {
        update((d) => {
          d.users.push({
            id: nid(d.users),
            name: v.name,
            email: v.email,
            role: v.role,
            status: v.status,
            created: TODAY,
            password: v.password,
          });
          notify(v.name + " was added as a " + v.role + ".", "users");
        }, v.name + " created");
      },
      "Create"
    );

  const editUser = (u: User) =>
    form(
      "Edit user",
      userFields(u),
      (v) => {
        update((d) => {
          const t = d.users.find((x) => x.id === u.id);
          if (!t) return;
          t.name = v.name;
          t.email = v.email;
          t.role = v.role;
          t.status = v.status;
          t.password = v.password;
        }, u.name + " updated");
      },
      "Save changes"
    );

  return (
    <>
      <div className="bar-tools">
        <input
          type="search"
          placeholder="Search by name, email or role"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search users"
          style={{ minWidth: 260 }}
        />
        <span className="grow" />
        <button className="btn" onClick={createUser}>
          Create user
        </button>
      </div>
      <div className="panel">
        {rows.length ? (
          <div className="tw">
            <table style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr className="click" key={u.id} onClick={() => openUser(u.id)}>
                    <td>
                      <div className="who">
                        <span className="av" style={{ background: colorFor(u.id) }}>
                          {initials(u.name)}
                        </span>
                        <div>
                          <b>{u.name}</b>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{dash(u.role)}</td>
                    <td>
                      <Pill t={u.status} k={stKind(u.status)} />
                    </td>
                    <td>{fdate(u.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No users yet. Create the first user account." />
        )}
      </div>
    </>
  );
}
