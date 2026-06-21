"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Menu, X, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { useCart, cartCount } from "@/store/cart";
import { useCurrency, CURRENCIES } from "@/store/currency";
import { useLang } from "@/store/lang";

export type NavLink = { href: string; label: string };

const fallbackLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ navLinks }: { navLinks?: NavLink[] }) {
  const links = navLinks && navLinks.length ? navLinks : fallbackLinks;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.set);
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.set);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? cartCount(items) : 0;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mt-4 flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all duration-500",
            scrolled
              ? "glass shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)]"
              : "border border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 pl-2 pr-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-iris via-violet to-cyan text-ink font-display text-lg font-bold">
              R
            </span>
            <span className="hidden font-display text-base font-semibold tracking-tight sm:block">
              Rajrishi<span className="text-fog-dim"> Communication</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "text-ink" : "text-fog-dim hover:text-fog"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-iris to-cyan"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            {mounted && (
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                aria-label="Language"
                className="rounded-full bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-fog-dim hover:text-fog"
              >
                {lang === "en" ? "हिं" : "EN"}
              </button>
            )}
            {mounted && (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Currency"
                className="rounded-full bg-white/5 px-2 py-1.5 text-xs font-semibold text-fog-dim outline-none hover:text-fog"
              >
                {Object.keys(CURRENCIES).map((c) => <option key={c} value={c} className="bg-ink-2 text-fog">{c}</option>)}
              </select>
            )}
            <Link href="/account" aria-label="Account" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <button
              onClick={openCart}
              data-cursor
              aria-label="Open cart"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-rose to-amber px-1 text-[11px] font-bold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    className="font-display text-4xl font-semibold tracking-tight text-fog"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 rounded-full border border-white/15 px-6 py-3 text-sm text-fog-dim"
              >
                WhatsApp · {site.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
