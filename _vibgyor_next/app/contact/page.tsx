import ContactForm from "@/components/ContactForm";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);
const img = (id: string, w = 1920) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const metadata = { title: "Contact — Vibgyor Events | Begin Your Story" };

export default function Contact() {
  return (
    <>
      <header className="page-hero" style={ac("var(--red)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={img("photo-1465495976277-4387d4b0b4c6")} alt="" />
          <div className="ov" />
        </div>
        <div><div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Let&apos;s Begin</div><h1><span className="js-hero-line line"><span>Your forever</span></span><span className="js-hero-line line"><span className="grad-text">starts here.</span></span></h1></div>
      </header>

      <main className="page">
        <section style={ac("var(--violet)")}>
          <div className="split" style={{ gridTemplateColumns: "1fr 1.1fr", alignItems: "start" }}>
            <div>
              <div className="sec-tag reveal">Reach Us</div>
              <p className="lead reveal" style={{ fontFamily: "var(--serif)", fontSize: "1.7rem", fontStyle: "italic", color: "var(--cream)", lineHeight: 1.4, marginBottom: "2rem" }}>Tell us your date. We&apos;ll bring the magic.</p>
              <div className="reveal info-block"><div className="k">Studio</div><p className="lead-p" style={{ fontSize: "1rem" }}>3rd Floor, Celebration House,<br />MG Road, Bengaluru 560001, India</p></div>
              <div className="reveal info-block"><div className="k">Email</div><a href="mailto:hello@vibgyorevents.com" className="lead-p" style={{ fontSize: "1rem" }} data-hover>hello@vibgyorevents.com</a></div>
              <div className="reveal info-block"><div className="k">Phone</div><a href="tel:+910000000000" className="lead-p" style={{ fontSize: "1rem" }} data-hover>+91 98XXX XXXXX</a></div>
              <div className="reveal"><div className="k">Follow</div><div style={{ display: "flex", gap: ".8rem" }}><a href="#" className="btn-ghost" data-hover>Instagram</a><a href="#" className="btn-ghost" data-hover>Pinterest</a></div></div>
            </div>
            <div className="reveal contact-card">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
