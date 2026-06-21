"use client";

import { useState } from "react";

export function AccountForms() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setErr("");
    const res = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: mode, ...f }) });
    const d = await res.json();
    setBusy(false);
    if (d.ok) location.reload();
    else setErr(d.error || "Something went wrong");
  };

  return (
    <div className="glass mx-auto max-w-md rounded-[2rem] p-8">
      <div className="mb-5 flex gap-2">
        <button onClick={() => setMode("login")} className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === "login" ? "bg-gradient-to-r from-iris to-cyan text-ink" : "bg-white/5 text-fog-dim"}`}>Log in</button>
        <button onClick={() => setMode("register")} className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === "register" ? "bg-gradient-to-r from-iris to-cyan text-ink" : "bg-white/5 text-fog-dim"}`}>Create account</button>
      </div>
      <div className="grid gap-3">
        {mode === "register" && (
          <>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
            <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
          </>
        )}
        <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email" type="email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
        <input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="Password" type="password" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
      </div>
      {err && <p className="mt-3 text-xs text-amber">{err}</p>}
      <button onClick={submit} disabled={busy} className="mt-4 w-full rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-3.5 text-sm font-bold text-ink">
        {busy ? "…" : mode === "login" ? "Log in" : "Create account"}
      </button>
    </div>
  );
}

export function LogoutButton() {
  return (
    <button onClick={async () => { await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); location.reload(); }}
      className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10">Log out</button>
  );
}
