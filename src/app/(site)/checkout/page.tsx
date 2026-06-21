"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, MessageCircle, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatINR, cn } from "@/lib/utils";
import { site } from "@/lib/site";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

type Form = { name: string; phone: string; email: string; address: string; city: string; pincode: string };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const subtotal = cartTotal(items);
  const shipping = subtotal >= site.freeShippingOver || subtotal === 0 ? 0 : 49;

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; type: string; value: number; minOrder: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const discount = coupon ? (coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value) : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const list = await (await fetch("/api/coupons")).json();
    const c = (list as { code: string; type: string; value: number; minOrder: number; active: boolean }[]).find((x) => x.code === code && x.active);
    if (!c) { setCoupon(null); setCouponMsg("Invalid code"); return; }
    if (subtotal < c.minOrder) { setCoupon(null); setCouponMsg(`Min order ${formatINR(c.minOrder)}`); return; }
    setCoupon(c); setCouponMsg(`Applied — ${c.type === "percent" ? c.value + "% off" : formatINR(c.value) + " off"}`);
  };

  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", address: "", city: "", pincode: "" });
  const [status, setStatus] = useState<"idle" | "paying" | "done">("idle");
  const [error, setError] = useState("");

  const valid = form.name && form.phone.length >= 10 && form.address && form.city && form.pincode.length >= 5;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const saveOrder = (method: string) => {
    const itemsText = items.map((i) => `${i.name}${i.color ? ` (${i.color})` : ""} x${i.qty}`).join(", ");
    fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, phone: form.phone, address: `${form.address}, ${form.city} - ${form.pincode}`, items: itemsText, total, method }) }).catch(() => {});
  };

  // Abandoned-cart capture: if a phone was entered but checkout wasn't completed.
  const leaveRef = useRef({ phone: "", items: "", total: 0, done: false });
  leaveRef.current = { phone: form.phone, items: items.map((i) => `${i.name} x${i.qty}`).join(", "), total, done: status === "done" };
  useEffect(() => {
    const onLeave = () => {
      const s = leaveRef.current;
      if (s.phone && s.items && !s.done && navigator.sendBeacon) {
        navigator.sendBeacon("/api/abandoned", new Blob([JSON.stringify(s)], { type: "application/json" }));
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  const orderSummaryText = () => {
    const lines = items.map((i) => `• ${i.name}${i.color ? ` (${i.color})` : ""} × ${i.qty} — ${formatINR(i.price * i.qty)}`);
    return encodeURIComponent(
      `🛒 *New order — Rajrishi Communication*\n\n${lines.join("\n")}\n\n*Total: ${formatINR(total)}*\n\n` +
        `👤 ${form.name || "(name)"}\n📞 ${form.phone || "(phone)"}\n📍 ${form.address}, ${form.city} - ${form.pincode}`
    );
  };

  const payOnline = async () => {
    setError("");
    setStatus("paying");
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (res.status === 503) {
        setStatus("idle");
        setError("Online payment isn't switched on yet. Please use the WhatsApp order button — we'll confirm instantly.");
        return;
      }
      if (!res.ok) throw new Error("order failed");

      const { orderId, amount, keyId } = await res.json();

      const rzp = new window.Razorpay!({
        key: keyId,
        amount,
        currency: "INR",
        name: site.name,
        description: "Order payment",
        order_id: orderId,
        prefill: { name: form.name, contact: form.phone, email: form.email },
        theme: { color: "#7c5cff" },
        handler: async (resp: Record<string, string>) => {
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            }),
          });
          saveOrder("razorpay");
          clear();
          setStatus("done");
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      rzp.open();
    } catch {
      setStatus("idle");
      setError("Something went wrong starting payment. Please try the WhatsApp order option.");
    }
  };

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-40 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-emerald-400 text-ink"
        >
          <Check className="h-12 w-12" strokeWidth={3} />
        </motion.div>
        <h1 className="font-display text-4xl font-bold">Order confirmed!</h1>
        <p className="text-fog-dim">
          Thank you, {form.name || "friend"}. We&apos;ve received your payment and will reach out on {form.phone || "your number"} shortly.
        </p>
        <Link href="/shop" className="rounded-full bg-gradient-to-r from-iris to-cyan px-7 py-3 text-sm font-bold text-ink">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-40 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out</h1>
        <p className="mt-3 text-fog-dim">Your bag is empty.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-gradient-to-r from-iris to-cyan px-7 py-3 text-sm font-bold text-ink">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Check<span className="text-aurora">out</span>
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Form */}
        <div className="glass rounded-[2rem] p-7">
          <h2 className="mb-5 font-display text-xl font-semibold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Your name" full />
            <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" type="tel" />
            <Field label="Email (optional)" value={form.email} onChange={set("email")} placeholder="you@email.com" type="email" />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-fog-dim">Address</label>
              <textarea
                value={form.address}
                onChange={set("address")}
                rows={2}
                placeholder="House / street / area"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-iris/60"
              />
            </div>
            <Field label="City" value={form.city} onChange={set("city")} placeholder="City" />
            <Field label="Pincode" value={form.pincode} onChange={set("pincode")} placeholder="6-digit" />
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-amber/10 px-4 py-3 text-sm text-amber">{error}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={payOnline}
              disabled={!valid || status === "paying"}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-transform active:scale-[0.98]",
                valid
                  ? "bg-gradient-to-r from-iris via-cyan to-amber text-ink"
                  : "cursor-not-allowed bg-white/10 text-fog-dim"
              )}
            >
              {status === "paying" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Starting payment…</>
              ) : (
                <><CreditCard className="h-4 w-4" /> Pay online · {formatINR(total)}</>
              )}
            </button>

            <a
              href={valid ? `https://wa.me/${site.whatsapp}?text=${orderSummaryText()}` : undefined}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (!valid) {
                  e.preventDefault();
                  setError("Please fill your name, phone and address first.");
                  return;
                }
                saveOrder("whatsapp");
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-bold transition-colors",
                valid
                  ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#4ee48a] hover:bg-[#25D366]/20"
                  : "cursor-not-allowed border-white/10 text-fog-dim"
              )}
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
            <p className="flex items-center justify-center gap-1.5 text-xs text-fog-dim">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · UPI, cards, netbanking & wallets
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="bezel">
            <div className="rounded-[calc(2rem-0.4rem)] bg-white/[0.02] p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Your order</h2>
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={`${it.id}-${it.color}`} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                      <Image src={it.image} alt={it.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-iris text-[11px] font-bold text-ink">
                        {it.qty}
                      </span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium leading-tight">{it.name}</p>
                      {it.color && <p className="text-xs text-fog-dim">{it.color}</p>}
                    </div>
                    <span className="text-sm font-medium">{formatINR(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase outline-none focus:border-iris/60" />
                <button onClick={applyCoupon} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">Apply</button>
              </div>
              {couponMsg && <p className={`mt-1.5 text-xs ${coupon ? "text-emerald-300" : "text-amber"}`}>{couponMsg}</p>}

              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-fog-dim"><span>Subtotal</span><span className="text-fog">{formatINR(subtotal)}</span></div>
                <div className="flex justify-between text-fog-dim">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-300" : "text-fog"}>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                </div>
                {discount > 0 && <div className="flex justify-between text-emerald-300"><span>Discount ({coupon?.code})</span><span>− {formatINR(discount)}</span></div>}
                <div className="flex justify-between pt-2 text-base">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-xl font-bold">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", full,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm text-fog-dim">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-iris/60"
      />
    </div>
  );
}
