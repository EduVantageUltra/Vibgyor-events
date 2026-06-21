import Link from "next/link";
import { EVENT_LIST } from "@/lib/gallery";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);
const img = (id: string, w = 1000) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const metadata = { title: "Weddings — Vibgyor Events | Real Celebrations, Real Stories" };

const CLS = ["a", "b", "c", "c", "w1", "w1"];

export default function Gallery() {
  return (
    <>
      <header className="page-hero" style={ac("var(--yellow)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={img("photo-1511285560929-80b456fea0bc", 1920)} alt="" />
          <div className="ov" />
        </div>
        <div><div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Real Weddings</div><h1><span className="js-hero-line line"><span>Tap a story to</span></span><span className="js-hero-line line"><span className="grad-text">step inside.</span></span></h1></div>
      </header>

      <main className="page">
        <section style={ac("var(--green)")}>
          <p className="lead-p reveal" style={{ maxWidth: 560 }}>Each celebration opens its own gallery — photographs and films from the day itself. Choose a story.</p>
          <div className="album-grid">
            {EVENT_LIST.map((ev, i) => (
              <Link key={ev.id} className={`album ${CLS[i] || "w1"} reveal`} href={`/event/${ev.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.cover} alt={ev.title} />
                <div className="badge"><span className="pulse" />View Gallery</div>
                <div className="cap"><div className="t">{ev.title}</div><div className="s">{ev.meta.replace(/ · \d{4}$/, "")}</div></div>
                <div className="arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="cta-band" style={ac("var(--violet)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("photo-1606800052052-a08af7148866", 1920)} alt="" />
        </div>
        <div className="inner"><div className="sec-tag center reveal">Let&apos;s Begin</div><h2 className="sec-title reveal">Your story <em>next?</em></h2><Link href="/contact" className="btn-pill reveal" data-hover>Plan Your Wedding <span className="dot">→</span></Link></div>
      </div>
    </>
  );
}
