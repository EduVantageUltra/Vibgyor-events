import Link from "next/link";
import CityPlanner from "@/components/vibgyor/CityPlanner";
import { MEDIA as M } from "@/lib/media";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

const HELP = [
  ["01", "We shortlist, you choose", "Tell us the city, the headcount and the number you're comfortable with. Within a week you get 3–5 real options with actual availability on your dates — not a brochure."],
  ["02", "We negotiate the contract", "Room blocks, F&B minimums, décor restrictions, corkage, overtime charges. Twenty years of doing this means we know exactly which clauses cost you later."],
  ["03", "We run the recce", "We travel out, walk the property, photograph every corner and send you a full report — light at 4pm, the ugly generator wall, how far the mandap is from the loos."],
  ["04", "We move your guests", "Flights, visas, transfers, welcome hampers, a helpline number that a human answers. Your family lands, and everything is simply handled."],
];

export default function Destinations() {
  return (
    <>
      <header className="page-hero" style={ac("var(--green)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={M.mandapEntrance} alt="" />
          <div className="ov" />
        </div>
        <div>
          <div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Destination Weddings</div>
          <h1>
            <span className="js-hero-line line"><span>Tell us the city.</span></span>
            <span className="js-hero-line line"><span className="grad-text">We&apos;ll find the place.</span></span>
          </h1>
        </div>
      </header>

      <main className="page">
        {/* HOW WE HELP */}
        <section style={ac("var(--orange)")}>
          <div className="proc">
            <div>
              <div className="sec-tag reveal">How We Help</div>
              <h2 className="sec-title reveal">The part nobody <em>warns you about.</em></h2>
              <p className="reveal lead-p" style={{ marginTop: "1rem" }}>
                Picking a city is the easy half. Locking the venue — on your dates, at your number, without a nasty
                clause buried on page nine — is the half that ruins people. That half is ours.
              </p>
            </div>
            <div className="proc-line">
              <div className="fill" />
              {HELP.map((h) => (
                <div className="step reveal" key={h[0]}>
                  <h4><small className="grad-text">{h[0]}</small>{h[1]}</h4>
                  <p>{h[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section style={ac("var(--yellow)")}>
          <div className="sec-tag reveal">Included, Always</div>
          <h2 className="sec-title reveal">One team. <em>Every moving part.</em></h2>
          <div className="grid-3">
            {[
              ["Venue & Contracts", "Shortlisting, site recce, rate negotiation, contract review and the booking itself — held in your name, not ours."],
              ["Guest Logistics", "Group travel, paperwork, airport transfers, room allocation and a 24×7 helpline for every guest."],
              ["Design & Production", "Décor, mandap, lighting, sound, entertainment and catering — designed in 3D and approved before anything ships."],
            ].map(([t, d]) => (
              <div className="value-card reveal" key={t}>
                <h3>{t}</h3>
                <p className="lead-p" style={{ fontSize: ".95rem" }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/moments" className="btn-ghost reveal" data-hover>See these places in real weddings →</Link>
          </div>
        </section>

        {/* CITY PICKER + ENQUIRY */}
        <section style={ac("var(--blue)")}>
          <div className="sec-tag reveal">Start the Search</div>
          <h2 className="sec-title reveal">Pick your city. <em>We&apos;ll do the rest.</em></h2>
          <p className="lead-p reveal" style={{ maxWidth: 620 }}>
            Palaces in Udaipur, beaches in Goa, backwaters in Kerala, farmhouses in Delhi NCR — choose where you want
            to celebrate and we&apos;ll come back with real venues that are actually free on your dates.
          </p>

          <CityPlanner />
        </section>
      </main>

      <div className="cta-band" style={ac("var(--violet)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={M.coupleCanopy} alt="" />
        </div>
        <div className="inner">
          <div className="sec-tag center reveal">Anywhere You Point</div>
          <h2 className="sec-title reveal">Your city isn&apos;t listed? <em>Ask anyway.</em></h2>
          <p className="lead-p reveal" style={{ maxWidth: 520, margin: "0 auto 2.4rem" }}>
            We have almost certainly been there — and if we haven&apos;t, we will go and see it for you.
          </p>
          <Link href="/contact" className="btn-pill reveal" data-hover>Talk To Us <span className="dot">→</span></Link>
        </div>
      </div>
    </>
  );
}
