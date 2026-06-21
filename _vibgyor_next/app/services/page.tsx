import Link from "next/link";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);
const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const metadata = { title: "The Experiences — Vibgyor Events | Every Ritual, Reimagined" };

const SERVICES = [
  ["01 / Pre-Wedding", "The Courtship", "Cinematic shoots, save-the-dates & intimate gatherings.", "photo-1583939003579-730e3918a45a"],
  ["02 / Haldi & Mehendi", "The Colours", "Marigold canopies, henna lounges and afternoons of joy.", "photo-1595407753234-0882f1e77954"],
  ["03 / Sangeet", "The Night", "Choreography, live acts and a stage built to dazzle.", "photo-1604017011826-d3b4c23f8914"],
  ["04 / The Wedding", "The Vows", "A mandap engineered to feel eternal.", "photo-1606800052052-a08af7148866"],
  ["05 / Reception", "The Celebration", "Black-tie glamour, curated cuisine, a royal send-off.", "photo-1599458448510-59aecaea4752"],
  ["06 / Destination", "The Escape", "Palaces, beaches, backwaters — anywhere your heart points.", "photo-1519225421980-715cb0215aed"],
];

const CAPS = [
  ["Design & Décor", "3D-rendered stages, florals, lighting design and bespoke installations."],
  ["Hospitality & Logistics", "Guest travel, room blocks, welcome hampers and on-ground concierge."],
  ["Entertainment", "Celebrity artists, live bands, choreographers and surprise acts."],
  ["Film & Photography", "Cinematic teams capturing every tear, laugh and firework."],
];

export default function Services() {
  return (
    <>
      <header className="page-hero" style={ac("var(--green)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={img("photo-1583939003579-730e3918a45a", 1920)} alt="" />
          <div className="ov" />
        </div>
        <div><div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>The Experiences</div><h1><span className="js-hero-line line"><span>Every ritual,</span></span><span className="js-hero-line line"><span className="grad-text">reimagined.</span></span></h1></div>
      </header>

      <div className="services-wrap" style={ac("var(--blue)")}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem 3rem" }}>
          <p className="lead-p reveal" style={{ maxWidth: 560 }}>From the first laughter of the courtship shoot to the last spark of the send-off — scroll through every chapter we design.</p>
        </div>
        <div className="h-scroll" id="hScroll">
          {SERVICES.map((sv, i) => (
            <article className="svc" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(sv[3])} alt={sv[1]} />
              <div className="svc-body"><div className="svc-no grad-text">{sv[0]}</div><h3>{sv[1]}</h3><p>{sv[2]}</p></div>
            </article>
          ))}
        </div>
      </div>

      <main className="page">
        <section style={ac("var(--yellow)")}>
          <div className="sec-tag reveal">Beyond the Big Day</div>
          <h2 className="sec-title reveal">Everything, <em>handled.</em></h2>
          <div className="grid-2">
            {CAPS.map((c) => (
              <div className="reveal" key={c[0]} style={{ padding: "1.8rem", border: "1px solid var(--line)", borderRadius: "1.4rem" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: ".5rem" }}>{c[0]}</h3>
                <p className="lead-p" style={{ fontSize: ".96rem" }}>{c[1]}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={ac("var(--orange)")}>
          <div className="proc">
            <div><div className="sec-tag reveal">How We Work</div><h2 className="sec-title reveal">Four steps to <em>forever.</em></h2></div>
            <div className="proc-line">
              <div className="fill" />
              {[["01", "Consult", "We listen to your story and turn it into a vision."],
                ["02", "Design", "Approved through 3D renders before a flower is ordered."],
                ["03", "Execute", "Specialists handle every vendor with precision."],
                ["04", "Celebrate", "You enjoy. We stay invisible."]].map((st) => (
                  <div className="step reveal" key={st[0]}><h4><small className="grad-text">{st[0]}</small>{st[1]}</h4><p>{st[2]}</p></div>
                ))}
            </div>
          </div>
        </section>
      </main>

      <div className="cta-band" style={ac("var(--red)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("photo-1519225421980-715cb0215aed", 1920)} alt="" />
        </div>
        <div className="inner"><div className="sec-tag center reveal">Let&apos;s Begin</div><h2 className="sec-title reveal">Which chapter <em>first?</em></h2><Link href="/contact" className="btn-pill reveal" data-hover>Start Planning <span className="dot">→</span></Link></div>
      </div>
    </>
  );
}
