import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENTS } from "@/lib/gallery";
import EventGallery from "@/components/vibgyor/EventGallery";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);
const img = (id: string, w = 1920) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.keys(EVENTS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = EVENTS[id];
  return { title: ev ? `${ev.title} — Vibgyor Events` : "Wedding Gallery — Vibgyor Events" };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = EVENTS[id];
  if (!ev) notFound();

  return (
    <>
      <header className="page-hero" style={ac("var(--violet)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={ev.cover} alt={ev.title} />
          <div className="ov" />
        </div>
        <div>
          <Link href="/gallery" className="js-hero-fade" style={{ opacity: 0, display: "inline-block", fontSize: ".72rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: "1.2rem" }}>← All Weddings</Link>
          <h1><span className="js-hero-line line"><span>{ev.title}</span></span></h1>
          <p className="js-hero-fade sec-tag" style={{ opacity: 0, marginTop: "1rem" }}>{ev.meta}</p>
        </div>
      </header>

      <main className="page">
        <section style={ac("var(--blue)")}>
          <p className="lead-p reveal" style={{ maxWidth: 640, fontSize: "1.2rem" }}>{ev.intro}</p>
          <div style={{ marginTop: "1.6rem" }} className="reveal">
            <span style={{ fontSize: ".7rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--cream-dim)" }}>Tap any tile to open · ◀ ▶ to browse · films play in full</span>
          </div>
          <EventGallery media={ev.media} title={ev.title} />
        </section>
      </main>

      <div className="cta-band" style={ac("var(--orange)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("photo-1722952934708-749c22eb2e58")} alt="" />
        </div>
        <div className="inner"><div className="sec-tag center reveal">Let&apos;s Begin</div><h2 className="sec-title reveal">Dreaming of <em>a day like this?</em></h2><Link href="/contact" className="btn-pill reveal" data-hover>Plan Your Wedding <span className="dot">→</span></Link></div>
      </div>
    </>
  );
}
