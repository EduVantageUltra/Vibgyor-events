import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { Marquee } from "@/components/ui/Marquee";

const Instagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M14 8.5h2.2V5.6h-2.6c-2.2 0-3.6 1.4-3.6 3.7v1.8H7.7v2.9H10V21h3v-7h2.3l.4-2.9H13V9.6c0-.7.3-1.1 1-1.1Z" />
  </svg>
);
const Youtube = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/shop?cat=Smartphones", label: "Smartphones" },
      { href: "/shop?cat=Audio", label: "Audio" },
      { href: "/shop?cat=Charging", label: "Charging" },
      { href: "/shop?cat=Wearables", label: "Wearables" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/shop", label: "All products" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10">
      <Marquee className="border-b border-white/10 py-6">
        {["Smartphones", "Audio", "Charging", "Wearables", "Cases", "Accessories"].map((w) => (
          <span
            key={w}
            className="mx-8 font-display text-3xl font-semibold tracking-tight text-fog-dim/40 sm:text-5xl"
          >
            {w} ✦
          </span>
        ))}
      </Marquee>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-iris via-violet to-cyan text-ink font-display text-lg font-bold">
              R
            </span>
            <span className="font-display text-lg font-semibold">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog-dim">{site.description}</p>
          <div className="mt-6 space-y-2 text-sm text-fog-dim">
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 hover:text-fog">
              <Phone className="h-4 w-4 text-iris" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-fog">
              <Mail className="h-4 w-4 text-iris" /> {site.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-iris" /> {site.address}
            </p>
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-fog-dim">
              {c.title}
            </h4>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fog-dim transition-colors hover:text-fog">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-xs text-fog-dim sm:flex-row">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {[
            { Icon: Instagram, href: site.social.instagram },
            { Icon: Facebook, href: site.social.facebook },
            { Icon: Youtube, href: site.social.youtube },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10 hover:text-fog"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
