"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

let preloaderPlayed = false;
let lenisStarted = false;

export default function MotionLayer() {
  const pathname = usePathname();

  // ---- one-time: cursor, preloader, smooth scroll ----
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // cursor
    const dot = document.querySelector<HTMLElement>(".cursor");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    let raf = 0;
    if (dot && ring) {
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, last = 0;
      const TRAIL = ["#e79bb8", "#e8c87a", "#caa14b", "#d98ca0", "#f3c39a"];
      const move = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px";
        if (!reduce) {
          const now = performance.now();
          if (now - last > 65) {
            last = now;
            const s = document.createElement("span");
            s.className = "cursor-petal";
            const sz = 6 + Math.random() * 7;
            s.style.left = mx + "px"; s.style.top = my + "px";
            s.style.width = sz + "px"; s.style.height = sz * 0.7 + "px";
            s.style.background = TRAIL[Math.floor(Math.random() * TRAIL.length)];
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1100);
          }
        }
      };
      addEventListener("mousemove", move);
      const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; raf = requestAnimationFrame(loop); };
      loop();
    }

    // smooth scroll (once)
    if (!reduce && !lenisStarted) {
      lenisStarted = true;
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    }

    // preloader (once per full load)
    const loader = document.getElementById("loader");
    if (loader && !preloaderPlayed) {
      preloaderPlayed = true;
      const word = loader.querySelector(".loader-word");
      if (word) word.innerHTML =
        '<span class="lw-main">' + "VIBGYOR".split("").map((c) => `<b>${c}</b>`).join("") + '</span><span class="lw-sub">EVENTS</span>';
      const tl = gsap.timeline();
      tl.to(".lw-main b", { y: 0, duration: 0.75, stagger: 0.07, ease: "power4.out" })
        .to(".lw-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=.25")
        .to(".loader-sub", { opacity: 1, duration: 0.5 }, "-=.3")
        .to(".loader-bar", { width: "100%", duration: 1.1, ease: "power2.inOut" }, "-=.35")
        .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.2 })
        .set(loader, { display: "none" });
    } else if (loader) {
      loader.style.display = "none";
    }

    return () => { if (raf) cancelAnimationFrame(raf); };
  }, []);

  // ---- per route: reveals, hero intro, counters, parallax, hScroll, magnetic ----
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // nav in
      gsap.to("nav", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

      // hero lines / fades
      if (document.querySelector(".js-hero-line"))
        gsap.to(".js-hero-line span", { y: 0, duration: 1, stagger: 0.12, ease: "power4.out", delay: 0.1 });
      gsap.utils.toArray<HTMLElement>(".js-hero-fade").forEach((el, i) =>
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, delay: 0.5 + i * 0.12, ease: "power3.out" })
      );

      // reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
      );

      // counters
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = +(el.dataset.count || "0");
        const suf = el.dataset.suffix || "";
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: () => gsap.to({ v: 0 }, { v: end, duration: 2, ease: "power2.out", onUpdate: function () { el.textContent = Math.round((this.targets()[0] as { v: number }).v) + suf; } }),
        });
      });

      // parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
        const host = img.closest("section,header,.page-hero,.hero-full") || img;
        gsap.to(img, { yPercent: 18, scale: 1.22, ease: "none", scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: true } });
      });

      // process line fill
      const fill = document.querySelector(".proc-line .fill");
      if (fill) gsap.to(fill, { height: "100%", ease: "none", scrollTrigger: { trigger: ".proc-line", start: "top 70%", end: "bottom 80%", scrub: true } });
    });

    // magnetic buttons
    const cleaners: (() => void)[] = [];
    if (!reduce) {
      document.querySelectorAll<HTMLElement>(".btn-pill,.nav-cta").forEach((btn) => {
        const mm = (e: MouseEvent) => { const r = btn.getBoundingClientRect(); gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" }); };
        const ml = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
        btn.addEventListener("mousemove", mm); btn.addEventListener("mouseleave", ml);
        cleaners.push(() => { btn.removeEventListener("mousemove", mm); btn.removeEventListener("mouseleave", ml); });
      });
    }

    // 3D tilt + gold frame on cards
    if (!reduce) {
      document.querySelectorAll<HTMLElement>(".album, .media-card").forEach((card) => {
        const mm = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
        };
        const ml = () => { card.style.transform = ""; };
        card.addEventListener("mousemove", mm);
        card.addEventListener("mouseleave", ml);
        cleaners.push(() => { card.removeEventListener("mousemove", mm); card.removeEventListener("mouseleave", ml); });
      });
    }

    // horizontal services row — native scroll: drag + vertical-wheel → horizontal
    const hrow = document.getElementById("hScroll");
    if (hrow) {
      let down = false, startX = 0, startScroll = 0, moved = false;
      const pd = (e: PointerEvent) => { down = true; moved = false; startX = e.clientX; startScroll = hrow.scrollLeft; hrow.classList.add("dragging"); };
      const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true; hrow.scrollLeft = startScroll - dx; };
      const pu = () => { down = false; hrow.classList.remove("dragging"); };
      const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
      const wheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const max = hrow.scrollWidth - hrow.clientWidth;
        if (max <= 0) return;
        const atStart = hrow.scrollLeft <= 0, atEnd = hrow.scrollLeft >= max - 1;
        if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return; // let the page scroll past
        e.preventDefault();
        hrow.scrollLeft += e.deltaY;
      };
      hrow.addEventListener("pointerdown", pd);
      window.addEventListener("pointermove", pm);
      window.addEventListener("pointerup", pu);
      hrow.addEventListener("click", onClick, true);
      hrow.addEventListener("wheel", wheel, { passive: false });
      cleaners.push(() => {
        hrow.removeEventListener("pointerdown", pd);
        window.removeEventListener("pointermove", pm);
        window.removeEventListener("pointerup", pu);
        hrow.removeEventListener("click", onClick, true);
        hrow.removeEventListener("wheel", wheel);
      });
    }

    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { clearTimeout(t); ctx.revert(); cleaners.forEach((c) => c()); };
  }, [pathname]);

  return null;
}
