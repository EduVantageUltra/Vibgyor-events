"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const valid = f.name && f.phone.length >= 10 && f.message;

  const text = encodeURIComponent(
    `Hi Rajrishi Communication!\n\nName: ${f.name}\nPhone: ${f.phone}\n\n${f.message}`
  );

  const saveLead = () => {
    if (!valid) return;
    fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }).catch(() => {});
  };

  return (
    <div className="glass rounded-[2rem] p-7">
      <h2 className="mb-5 font-display text-xl font-semibold">Send us a message</h2>
      <div className="grid gap-4">
        <input
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          placeholder="Your name"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60"
        />
        <input
          value={f.phone}
          onChange={(e) => setF({ ...f, phone: e.target.value })}
          placeholder="Phone number"
          type="tel"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60"
        />
        <textarea
          value={f.message}
          onChange={(e) => setF({ ...f, message: e.target.value })}
          placeholder="How can we help?"
          rows={4}
          className="resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60"
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={valid ? `https://wa.me/${site.whatsapp}?text=${text}` : undefined}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => { if (!valid) { e.preventDefault(); return; } saveLead(); }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-transform active:scale-[0.98]",
            valid ? "bg-[#25D366] text-[#062b14]" : "cursor-not-allowed bg-white/10 text-fog-dim"
          )}
        >
          <MessageCircle className="h-4 w-4" /> Send on WhatsApp
        </a>
        <a
          href={valid ? `mailto:${site.email}?subject=${encodeURIComponent("Enquiry from " + f.name)}&body=${text}` : undefined}
          onClick={(e) => !valid && e.preventDefault()}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-bold transition-colors",
            valid ? "border-white/15 bg-white/5 hover:bg-white/10" : "cursor-not-allowed border-white/10 text-fog-dim"
          )}
        >
          <Send className="h-4 w-4" /> Email us
        </a>
      </div>
      {!valid && <p className="mt-3 text-xs text-fog-dim">Fill name, phone and message to send.</p>}
    </div>
  );
}
