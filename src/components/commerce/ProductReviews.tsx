"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/inbox";

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [done, setDone] = useState(false);

  const load = () => fetch(`/api/reviews?productId=${productId}`).then((r) => r.json()).then((d) => Array.isArray(d) && setReviews(d));
  useEffect(() => { load(); }, [productId]);

  const submit = async () => {
    if (!form.name.trim()) return;
    await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, ...form }) });
    setForm({ name: "", rating: 5, text: "" });
    setDone(true);
    setTimeout(() => setDone(false), 2500);
    load();
  };

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-semibold">Reviews {reviews.length > 0 && <span className="text-fog-dim">· {reviews.length}</span>}</h2>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-sm text-fog-dim">No reviews yet — be the first.</p>}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.name}</span>
                <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber text-amber" : "text-fog-dim/40"}`} />)}</span>
              </div>
              {r.text && <p className="mt-2 text-sm text-fog-dim">{r.text}</p>}
              <p className="mt-1 text-xs text-fog-dim">{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          ))}
        </div>
        <div className="glass h-max rounded-[2rem] p-6">
          <h3 className="font-display text-lg font-semibold">Write a review</h3>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} stars`}>
                <Star className={`h-7 w-7 ${n <= form.rating ? "fill-amber text-amber" : "text-fog-dim/40"}`} />
              </button>
            ))}
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Share your experience…" rows={3} className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
          <button onClick={submit} disabled={!form.name.trim()} className={`mt-3 w-full rounded-full py-3 text-sm font-bold ${form.name.trim() ? "bg-gradient-to-r from-iris to-cyan text-ink" : "cursor-not-allowed bg-white/10 text-fog-dim"}`}>
            {done ? "Thank you ✓" : "Submit review"}
          </button>
        </div>
      </div>
    </section>
  );
}
