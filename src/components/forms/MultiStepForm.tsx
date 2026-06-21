"use client";

import { useMemo, useState } from "react";

export type FormField = {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "file";
  required: boolean;
  step: number;
  options?: string;        // for select: comma separated
  showIfField?: string;    // conditional: show only if another field…
  showIfEquals?: string;   // …equals this value
};

export function MultiStepForm({ title, fields, button }: { title: string; fields: FormField[]; button: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState("");

  const steps = useMemo(() => {
    const max = Math.max(0, ...fields.map((f) => f.step || 0));
    return Array.from({ length: max + 1 }, (_, i) => fields.filter((f) => (f.step || 0) === i));
  }, [fields]);

  const visible = (f: FormField) => !f.showIfField || values[f.showIfField] === f.showIfEquals;
  const stepFields = (steps[step] || []).filter(visible);
  const stepValid = stepFields.every((f) => !f.required || (values[f.key] && values[f.key] !== ""));

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const upload = async (k: string, file: File) => {
    setUploading(k);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd }).then((x) => x.json()).catch(() => null);
    if (r?.url) set(k, r.url);
    setUploading("");
  };

  const submit = async () => {
    const name = values.name || values.fullname || "Form lead";
    const phone = values.phone || values.tel || values.mobile || "";
    const message = fields.filter(visible).map((f) => `${f.label}: ${values[f.key] ?? ""}`).join("\n");
    await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, message }) }).catch(() => {});
    setDone(true);
  };

  if (done) return (
    <div className="glass mx-auto max-w-xl rounded-[2rem] p-10 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-400 text-2xl text-ink">✓</div>
      <h3 className="font-display text-2xl font-bold">Thank you!</h3>
      <p className="mt-2 text-fog-dim">We&apos;ve received your details and will be in touch.</p>
    </div>
  );

  return (
    <div className="glass mx-auto max-w-xl rounded-[2rem] p-7">
      {title && <h3 className="mb-1 font-display text-xl font-semibold">{title}</h3>}
      {steps.length > 1 && <p className="mb-5 text-xs text-fog-dim">Step {step + 1} of {steps.length}</p>}
      <div className="grid gap-3">
        {stepFields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm text-fog-dim">{f.label}{f.required && " *"}</label>
            {f.type === "textarea" ? (
              <textarea value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
            ) : f.type === "select" ? (
              <select value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60">
                <option value="">Choose…</option>
                {(f.options || "").split(",").map((o) => <option key={o} value={o.trim()} className="bg-ink-2">{o.trim()}</option>)}
              </select>
            ) : f.type === "checkbox" ? (
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values[f.key] === "yes"} onChange={(e) => set(f.key, e.target.checked ? "yes" : "")} /> {f.label}</label>
            ) : f.type === "file" ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm">
                <input type="file" onChange={(e) => e.target.files?.[0] && upload(f.key, e.target.files[0])} />
                {uploading === f.key && <span className="ml-2 text-xs text-fog-dim">uploading…</span>}
                {values[f.key] && <span className="ml-2 text-xs text-emerald-300">✓ uploaded</span>}
              </div>
            ) : (
              <input type={f.type} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold">Back</button>}
        {step < steps.length - 1 ? (
          <button onClick={() => stepValid && setStep((s) => s + 1)} disabled={!stepValid} className={`flex-1 rounded-full py-3.5 text-sm font-bold ${stepValid ? "bg-gradient-to-r from-iris to-cyan text-ink" : "cursor-not-allowed bg-white/10 text-fog-dim"}`}>Next</button>
        ) : (
          <button onClick={() => stepValid && submit()} disabled={!stepValid} className={`flex-1 rounded-full py-3.5 text-sm font-bold ${stepValid ? "bg-gradient-to-r from-iris via-cyan to-amber text-ink" : "cursor-not-allowed bg-white/10 text-fog-dim"}`}>{button || "Submit"}</button>
        )}
      </div>
    </div>
  );
}
