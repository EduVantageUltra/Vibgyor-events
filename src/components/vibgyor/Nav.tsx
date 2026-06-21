"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Experiences" },
  { href: "/gallery", label: "Weddings" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <nav>
        <Link href="/" className="brand">
          Vibgyor <span className="dotrow"><i /><i /><i /><i /><i /><i /></span>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""}>{l.label}</Link>
          ))}
        </div>
        <Link href="/contact" className="nav-cta" data-hover>Plan Your Day</Link>
        <div className="burger" onClick={() => setOpen((o) => !o)}><span /><span /></div>
      </nav>
      <div className={"mobile-menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>{l.label}</Link>
        ))}
      </div>
    </>
  );
}
