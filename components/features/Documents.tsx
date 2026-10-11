"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Empty, Pill } from "@/components/ui/ui";
import { TODAY } from "@/lib/constants";
import { empAt, fdate, nid } from "@/lib/utils";

export default function Documents() {
  const { S, update, form } = useApp();
  const [dq, setDq] = useState("");
  const [dt, setDt] = useState("All");
  if (!S) return null;

  const rows = S.docs.filter(
    (d) =>
      (dt === "All" || d.type === dt) && (!dq || (d.name + " " + (d.cand || empAt(S, d.emp).name)).toLowerCase().includes(dq.toLowerCase()))
  );
  const kind: Record<string, string> = { Signed: "ok", Active: "ok", Pending: "warn", Expired: "bad" };

  const add = () =>
    form(
      "Add document",
      [
        { k: "name", label: "Document name", req: true },
        { k: "type", label: "Type", type: "select", o: ["Contract", "Policy", "Tax", "Offer", "Certificate", "Template"] },
        { k: "emp", label: "Belongs to", type: "select", o: [["0", "Everyone"], ...S.emps.map((e) => [String(e.id), e.name] as [string, string])] },
        { k: "status", label: "Status", type: "select", o: ["Pending", "Signed", "Active"] },
      ],
      (v) => {
        update((d) => {
          d.docs.push({ id: nid(d.docs), name: v.name, type: v.type, emp: +v.emp, updated: TODAY, status: v.status });
        }, "Document added");
      }
    );

  const sign = (id: number) =>
    update((d) => {
      const doc = d.docs.find((x) => x.id === id);
      if (doc) {
        doc.status = "Signed";
        doc.updated = TODAY;
      }
    }, "Marked as signed");

  return (
    <>
      <div className="bar-tools">
        <input
          type="search"
          placeholder="Search documents"
          value={dq}
          onChange={(e) => setDq(e.target.value)}
          aria-label="Search documents"
          style={{ minWidth: 240 }}
        />
        <select value={dt} onChange={(e) => setDt(e.target.value)} aria-label="Type">
          {["All", "Contract", "Policy", "Tax", "Offer", "Certificate", "Template"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="grow" />
        <button className="btn" onClick={add}>
          Add document
        </button>
      </div>
      <div className="panel">
        {rows.length ? (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Belongs to</th>
                  <th>Updated</th>
                  <th>Status</th>
                  <th className="r">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <b>{d.name}</b>
                    </td>
                    <td>{d.type}</td>
                    <td>{d.cand || (d.emp ? empAt(S, d.emp).name : "Everyone")}</td>
                    <td>{fdate(d.updated)}</td>
                    <td>
                      <Pill t={d.status} k={kind[d.status]} />
                    </td>
                    <td className="r">
                      {d.status === "Pending" ? (
                        <button className="btn sm" onClick={() => sign(d.id)}>
                          Mark signed
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No documents match. Clear the filters or add a document." />
        )}
      </div>
    </>
  );
}