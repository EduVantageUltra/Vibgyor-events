import Link from "next/link";
import Marquee from "@/components/Marquee";
import Testimonials from "@/components/Testimonials";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

const ALBUMS = [
  { id: "udaipur", cls: "a", img: "photo-1604017011826-d3b4c23f8914", w: 1200, t: "Meera & Aarav", s: "City Palace · Udaipur", big: true },
  { id: "jaipur", cls: "b", img: "photo-1583939411023-14783179e581", w: 1000, t: "Diya & Rohan", s: "Rambagh · Jaipur", big: true },
  { id: "goa", cls: "c", img: "photo-1519225421980-715cb0215aed", w: 800, t: "Anaya & Kabir", s: "Beachfront · Goa", big: false },
  { id: "kerala", cls: "c", img: "photo-1610047569524-29104abe2e2c", w: 800, t: "Sara & Vikram", s: "Backwaters · Kerala", big: false },
  { id: "mumbai", cls: "d", img: "photo-1599458448510-59aecaea4752", w: 1200, t: "Nisha & Ishaan", s: "Grand Reception · Mumbai", big: true },
];

const SERVICES = [
  ["01 / Pre-Wedding", "The Courtship", "Cinematic shoots & intimate gatherings that set the tone.", "photo-1583939003579-730e3918a45a"],
  ["02 / Haldi & Mehendi", "The Colours", "Marigold canopies and afternoons drenched in joy.", "photo-1595407753234-0882f1e77954"],
  ["03 / Sangeet", "The Night", "Choreography, live acts and an unforgettable evening.", "photo-1604017011826-d3b4c23f8914"],
  ["04 / The Wedding", "The Vows", "A mandap that takes the breath away.", "photo-1606800052052-a08af7148866"],
  ["05 / Reception", "The Celebration", "Black-tie glamour and a send-off worthy of royalty.", "photo-1599458448510-59aecaea4752"],
  ["06 / Destination", "The Escape", "From Udaipur palaces to Kerala backwaters.", "photo-1519225421980-715cb0215aed"],
];

const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export default function Home() {
  return (
    <>
      <header className="hero-full" style={ac("var(--violet)")}>
        <div className="hero-bgwrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={img("photo-1604017011826-d3b4c23f8914", 1920)} alt="Indian luxury wedding" />
          <div className="ov" />
        </div>
        <div className="hero-inner">
          <span className="js-hero-fade hero-eyebrow" style={{ opacity: 0 }}>India · Destination · 20+ Years</span>
          <h1 className="hero-h1">
            <span className="js-hero-line" style={{ overflow: "hidden", display: "block" }}><span style={{ display: "inline-block", transform: "translateY(110%)" }}>We Don&apos;t Plan</span></span>
            <span className="js-hero-line" style={{ overflow: "hidden", display: "block" }}><span style={{ display: "inline-block", transform: "translateY(110%)" }}>Weddings. We Craft</span></span>
            <span className="js-hero-line" style={{ overflow: "hidden", display: "block" }}><span className="grad-text" style={{ display: "inline-block", transform: "translateY(110%)" }}><em>Forever.</em></span></span>
          </h1>
          <p className="js-hero-fade lead-p" style={{ opacity: 0, maxWidth: 560, margin: "2rem auto 2.6rem" }}>
            From the first phera to the last dance — Vibgyor Events designs Indian celebrations that feel like a memory before they even begin.
          </p>
          <Link href="/contact" className="btn-pill js-hero-fade" style={{ opacity: 0 }} data-hover>
            Begin Your Story <span className="dot">→</span>
          </Link>
        </div>
        <div className="js-hero-fade hero-scroll" style={{ opacity: 0 }}>Scroll<span className="ln" /></div>
      </header>

      <Marquee />

      <main className="page">
        {/* STATS */}
        <section style={ac("var(--indigo)")}>
          <div className="stats">
            <div className="stat reveal"><div className="num" data-count="20" data-suffix="+">0</div><div className="lbl">Years of Magic</div></div>
            <div className="stat reveal"><div className="num" data-count="850" data-suffix="+">0</div><div className="lbl">Weddings Crafted</div></div>
            <div className="stat reveal"><div className="num" data-count="18">0</div><div className="lbl">Cities &amp; Beyond</div></div>
            <div className="stat reveal"><div className="num" data-count="100" data-suffix="%">0</div><div className="lbl">Smiles Delivered</div></div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="split" style={ac("var(--blue)")}>
          <div className="media-card reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("photo-1606800052052-a08af7148866", 1200)} alt="Indian wedding mandap" />
          </div>
          <div>
            <div className="sec-tag reveal">The Studio</div>
            <p className="lead reveal">A wedding is not an event. It is the opening chapter of a story you&apos;ll tell forever.</p>
            <p className="reveal">For over two decades, Vibgyor Events has designed India&apos;s most cherished celebrations. We believe luxury isn&apos;t loud — it&apos;s felt. In the hush before the bride walks in. In a grandmother&apos;s tears.</p>
            <p className="reveal">Designers, logisticians, florists and dreamers — we handle every thread so you stay fully present in your own celebration.</p>
            <Link href="/about" className="btn-ghost reveal" data-hover style={{ marginTop: "1rem" }}>Meet the Studio →</Link>
          </div>
        </section>

        {/* SERVICES HORIZONTAL */}
        <div className="services-wrap" style={ac("var(--green)")}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "7rem 1.5rem 3rem" }}>
            <div className="sec-tag reveal">The Experiences</div>
            <h2 className="sec-title reveal">Every ritual, <em>reimagined.</em></h2>
          </div>
          <div className="h-scroll" id="hScroll">
            {SERVICES.map((sv, i) => (
              <article className="svc" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(sv[3])} alt={sv[1]} />
                <div className="svc-body">
                  <div className="svc-no grad-text">{sv[0]}</div>
                  <h3>{sv[1]}</h3>
                  <p>{sv[2]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ALBUMS */}
        <section style={ac("var(--yellow)")}>
          <div className="sec-tag reveal">Selected Weddings</div>
          <h2 className="sec-title reveal">Tap any story to <em>step inside.</em></h2>
          <p className="lead-p reveal" style={{ maxWidth: 560 }}>Each celebration opens its own gallery — photographs and films from the day itself.</p>
          <div className="album-grid">
            {ALBUMS.map((al) => (
              <Link key={al.id} className={`album ${al.cls} reveal`} href={`/event/${al.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(al.img, al.w)} alt={al.t} />
                <div className="badge"><span className="pulse" />{al.big ? "View Gallery" : "Gallery"}</div>
                <div className="cap"><div className="t">{al.t}</div><div className="s">{al.s}</div></div>
                <div className="arrow">→</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/gallery" className="btn-ghost reveal" data-hover>See All Weddings →</Link>
          </div>
        </section>

        {/* PROCESS */}
        <section style={ac("var(--orange)")}>
          <div className="proc">
            <div>
              <div className="sec-tag reveal">How We Work</div>
              <h2 className="sec-title reveal">Four steps to <em>forever.</em></h2>
              <p className="reveal lead-p" style={{ marginTop: "1rem" }}>No spreadsheets thrown at you. No chaos. A calm, guided journey from the first hello to the final farewell.</p>
            </div>
            <div className="proc-line">
              <div className="fill" />
              {[["01", "Consult", "We listen — to your story, your families, your wildest hopes — and turn them into a vision."],
                ["02", "Design", "Mood, palette, décor, flow — approved through 3D renders before a single flower is ordered."],
                ["03", "Execute", "An army of specialists handles vendors and logistics with precision and zero stress for you."],
                ["04", "Celebrate", "You walk in as a guest at your own wedding. We stay invisible — everything just works."]]
                .map((st) => (
                  <div className="step reveal" key={st[0]}><h4><small className="grad-text">{st[0]}</small>{st[1]}</h4><p>{st[2]}</p></div>
                ))}
            </div>
          </div>
        </section>

        <Testimonials />
      </main>

      {/* CTA */}
      <div className="cta-band" style={ac("var(--violet)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("photo-1465495976277-4387d4b0b4c6", 1920)} alt="" />
        </div>
        <div className="inner">
          <div className="sec-tag center reveal">Let&apos;s Begin</div>
          <h2 className="sec-title reveal">Your forever <em>starts here.</em></h2>
          <p className="lead-p reveal" style={{ maxWidth: 520, margin: "0 auto 2.4rem" }}>Tell us your date. We&apos;ll bring the magic.</p>
          <Link href="/contact" className="btn-pill reveal" data-hover>Plan Your Wedding <span className="dot">→</span></Link>
        </div>
      </div>
    </>
  );
}
