import Link from "next/link";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);
const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const metadata = { title: "The Studio — Vibgyor Events | 20+ Years of Indian Weddings" };

export default function About() {
  return (
    <>
      <header className="page-hero" style={ac("var(--violet)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={img("photo-1610047569524-29104abe2e2c", 1920)} alt="" />
          <div className="ov" />
        </div>
        <div>
          <div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Est. 2005 · 20+ Years</div>
          <h1><span className="js-hero-line line"><span>The studio behind</span></span><span className="js-hero-line line"><span className="grad-text">a thousand stories.</span></span></h1>
        </div>
      </header>

      <main className="page">
        <section className="split" style={ac("var(--indigo)")}>
          <div>
            <div className="sec-tag reveal">Our Story</div>
            <p className="lead reveal" style={{ fontFamily: "var(--serif)", fontSize: "1.7rem", fontStyle: "italic", color: "var(--cream)", lineHeight: 1.4, marginBottom: "1.3rem" }}>It began in 2005 with one borrowed marigold garland and an impossible promise: to make a wedding feel like a dream.</p>
            <p className="reveal lead-p" style={{ marginBottom: "1.3rem" }}>Twenty years and 850+ weddings later, that promise hasn&apos;t changed — only the scale has. From intimate 50-guest ceremonies to 2,000-guest royal affairs across palaces, beaches and backwaters, Vibgyor Events has become a name families trust with the most important day of their lives.</p>
            <p className="reveal lead-p">The name says it all. <b className="grad-text">Vibgyor</b> — the seven colours of the rainbow — because no two love stories share the same palette, and every celebration deserves its own.</p>
          </div>
          <div className="media-card reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("photo-1595407753234-0882f1e77954")} alt="Indian wedding celebration" />
          </div>
        </section>

        <section style={ac("var(--blue)")}>
          <div className="stats">
            <div className="stat reveal"><div className="num" data-count="20" data-suffix="+">0</div><div className="lbl">Years</div></div>
            <div className="stat reveal"><div className="num" data-count="850" data-suffix="+">0</div><div className="lbl">Weddings</div></div>
            <div className="stat reveal"><div className="num" data-count="60" data-suffix="+">0</div><div className="lbl">Specialists</div></div>
            <div className="stat reveal"><div className="num" data-count="18">0</div><div className="lbl">Cities</div></div>
          </div>
        </section>

        <section style={ac("var(--green)")}>
          <div className="sec-tag reveal">What We Believe</div>
          <h2 className="sec-title reveal">Luxury is <em>a feeling,</em> not a price tag.</h2>
          <div className="grid-3">
            {[["01", "Presence over Stress", "You should be a guest at your own wedding. We carry the weight so you carry only the joy."],
              ["02", "Detail is Devotion", "The fold of a napkin. The timing of a song. We obsess so the day feels effortless."],
              ["03", "Your Culture, Elevated", "Every ritual honoured, every tradition respected — then designed to take everyone's breath away."]]
              .map((v) => (
                <div className="value-card reveal" key={v[0]}><div className="vn grad-text">{v[0]}</div><h3>{v[1]}</h3><p className="lead-p" style={{ fontSize: ".98rem" }}>{v[2]}</p></div>
              ))}
          </div>
        </section>
      </main>

      <div className="cta-band" style={ac("var(--orange)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("photo-1606800052052-a08af7148866", 1920)} alt="" />
        </div>
        <div className="inner"><div className="sec-tag center reveal">Let&apos;s Begin</div><h2 className="sec-title reveal">Let&apos;s craft <em>yours.</em></h2><Link href="/contact" className="btn-pill reveal" data-hover>Plan Your Wedding <span className="dot">→</span></Link></div>
      </div>
    </>
  );
}
