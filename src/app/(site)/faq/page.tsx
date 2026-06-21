import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/sections/PageHeader";
import { Accordion } from "@/components/ui/Accordion";
import { site } from "@/lib/site";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return seoFor("faq", { title: "FAQ", description: "Answers to common questions about orders, warranty, delivery and payments." });
}

export const dynamic = "force-dynamic";

const faqs = [
  { q: "Are your products genuine and warrantied?", a: "Absolutely. Every device is brand-authorised, sealed and comes with full manufacturer warranty. We never sell refurbished units as new." },
  { q: "How fast is delivery?", a: "Same-day delivery within the city for orders placed before 6 PM, and 24–48 hours for the rest of the country. You'll get a tracking link as soon as we dispatch." },
  { q: "What payment methods do you accept?", a: "Online you can pay via UPI, credit/debit cards, netbanking and wallets through our secure checkout. You can also reserve an item and pay in store, or order over WhatsApp." },
  { q: "Do you offer EMI?", a: "Yes — no-cost and standard EMI options are available on most smartphones through major banks and cards. Choose EMI at the payment step or ask us in store." },
  { q: "Can I return or exchange a product?", a: "Sealed, unused items can be returned within 7 days for a refund or exchange. Defective units are covered under warranty and we'll help you with the claim." },
  { q: "Do you buy old phones / offer exchange?", a: "We do. Bring your old device in store or message us its details on WhatsApp for an instant exchange quote against your new purchase." },
  { q: "Is in-store pickup available?", a: "Yes. Order online, choose 'reserve in store' and we'll keep it ready at the counter for you to collect and pay." },
  { q: "How do I track my order?", a: "Once dispatched you'll receive an SMS/WhatsApp with a live tracking link. You can also call us anytime for an update." },
];

export default function FaqPage() {
  return renderEditable("faq", () => (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHeader
        eyebrow="Help centre"
        title={<>Questions, <span className="text-aurora">answered</span></>}
        subtitle="Everything you need to know about buying from Rajrishi Communication. Still stuck? We're a message away."
      />
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Accordion items={faqs} />
        <div className="mt-10 rounded-[2rem] glass p-8 text-center">
          <p className="font-display text-xl font-semibold">Didn&apos;t find your answer?</p>
          <p className="mt-2 text-sm text-fog-dim">Our team replies fast on WhatsApp and over the phone.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-[#062b14]">
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold">
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </>
  ));
}
