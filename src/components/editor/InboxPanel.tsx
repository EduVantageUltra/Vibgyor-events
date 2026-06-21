"use client";

import { useEffect, useState } from "react";
import type { Submission, Order } from "@/lib/inbox";

export function InboxPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"enquiries" | "orders">("orders");
  const [subs, setSubs] = useState<Submission[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/submissions").then((r) => r.json()).then((d) => Array.isArray(d) && setSubs(d)).catch(() => {});
    fetch("/api/orders").then((r) => r.json()).then((d) => Array.isArray(d) && setOrders(d)).catch(() => {});
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleString("en-IN");

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setTab("orders")} style={tab === "orders" ? tabOn : tabOff}>🧾 Orders ({orders.length})</button>
            <button onClick={() => setTab("enquiries")} style={tab === "enquiries" ? tabOn : tabOff}>✉️ Enquiries ({subs.length})</button>
          </div>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>

        {tab === "orders" ? (
          orders.length === 0 ? <Empty text="No orders yet. They appear here when customers check out." /> : (
            <div style={{ display: "grid", gap: 8 }}>
              {orders.map((o) => (
                <div key={o.id} style={row}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>₹{o.total.toLocaleString("en-IN")} · {o.name || "—"} <span style={{ fontWeight: 400, color: "#888" }}>({o.method})</span></div>
                    <div style={{ fontSize: 12, color: "#555" }}>{o.items}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>📞 {o.phone} · 📍 {o.address} · {fmt(o.date)}</div>
                  </div>
                  <a href={`https://wa.me/${o.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={waBtn}>WhatsApp</a>
                </div>
              ))}
            </div>
          )
        ) : subs.length === 0 ? <Empty text="No enquiries yet. Contact-form messages land here." /> : (
          <div style={{ display: "grid", gap: 8 }}>
            {subs.map((s) => (
              <div key={s.id} style={row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{s.name} · {s.phone}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{s.message}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{fmt(s.date)}</div>
                </div>
                <a href={`https://wa.me/${s.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={waBtn}>Reply</a>
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 11, color: "#999", marginTop: 14 }}>Tip: set RESEND_API_KEY + NOTIFY_EMAIL to also get these by email at go-live.</p>
      </div>
    </div>
  );
}

const Empty = ({ text }: { text: string }) => <p style={{ color: "#999", fontSize: 13, padding: "20px 0" }}>{text}</p>;
const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 660, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, border: "1px solid #eee", borderRadius: 10, padding: 10 };
const tabOn: React.CSSProperties = { padding: "7px 14px", borderRadius: 8, border: "none", background: "#7c5cff", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const tabOff: React.CSSProperties = { ...tabOn, background: "#eef0f4", color: "#333" };
const waBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, background: "#25D366", color: "#062b14", fontSize: 12, fontWeight: 700, textDecoration: "none" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
