import type { Metadata } from "next";
import { cookies } from "next/headers";
import { readSession, getCustomer } from "@/lib/accounts";
import { getOrders } from "@/lib/inbox";
import { PageHeader } from "@/components/sections/PageHeader";
import { AccountForms, LogoutButton } from "@/components/account/AccountForms";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  const token = (await cookies()).get("rr-session")?.value;
  const id = readSession(token);
  const customer = id ? getCustomer(id) : null;

  if (!customer) {
    return (
      <>
        <PageHeader eyebrow="Account" title={<>Welcome <span className="text-aurora">back</span></>} subtitle="Log in to see your orders, or create an account." />
        <div className="px-6 pb-16"><AccountForms /></div>
      </>
    );
  }

  const myOrders = getOrders().filter((o) => o.phone && customer.phone && o.phone.replace(/\D/g, "") === customer.phone.replace(/\D/g, ""));

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-28">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Hi, {customer.name || "there"}</h1>
          <p className="mt-1 text-fog-dim">{customer.email}{customer.phone && ` · ${customer.phone}`}</p>
        </div>
        <LogoutButton />
      </div>
      <h2 className="mt-12 mb-4 font-display text-2xl font-semibold">Order history</h2>
      {myOrders.length === 0 ? (
        <p className="text-fog-dim">No orders yet — your orders will appear here.</p>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">{formatINR(o.total)}</span>
                <span className="text-xs text-fog-dim">{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.method}</span>
              </div>
              <p className="mt-1 text-sm text-fog-dim">{o.items}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
