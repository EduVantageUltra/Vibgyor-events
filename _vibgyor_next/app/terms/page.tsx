const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

export const metadata = { title: "Terms & Conditions — Vibgyor Events" };

export default function Terms() {
  return (
    <>
      <header className="page-hero" style={{ ...ac("var(--indigo)"), minHeight: "42vh" }}>
        <div><div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Legal · Updated June 2026</div><h1><span className="js-hero-line line"><span>Terms &amp; <span className="grad-text">Conditions</span></span></span></h1></div>
      </header>

      <main className="page">
        <section className="legal" style={{ ...ac("var(--indigo)"), paddingTop: "2rem" }}>
          <p className="reveal lead-p">These Terms &amp; Conditions (&quot;Terms&quot;) govern the engagement of Vibgyor Events (&quot;we&quot;, &quot;us&quot;, &quot;the Company&quot;) for wedding planning, design, coordination and allied services. By booking our services you (&quot;the Client&quot;) agree to the following. Please read them carefully.</p>

          <h2 className="reveal"><span className="n">01</span>Scope of Services</h2>
          <p className="reveal">The exact deliverables, functions, dates and venues will be set out in a separate written Proposal &amp; Service Agreement signed by both parties. These Terms apply alongside that Agreement; in case of conflict, the signed Agreement prevails.</p>

          <h2 className="reveal"><span className="n">02</span>Booking &amp; Payment</h2>
          <ul className="reveal">
            <li>A non-refundable retainer of 25% of the estimated budget confirms your booking and reserves your date.</li>
            <li>Subsequent payments follow the milestone schedule in your Agreement. Final balance is due no later than 7 days before the first function.</li>
            <li>All third-party vendor costs (venue, catering, décor, artists, travel) are billed at actuals and may vary with final guest counts.</li>
          </ul>

          <h2 className="reveal"><span className="n">03</span>Cancellation &amp; Postponement</h2>
          <ul className="reveal">
            <li>The retainer is non-refundable in all cases of cancellation by the Client.</li>
            <li>Cancellations within 60 days of the event may incur charges up to 75% of the contracted fee, reflecting committed vendor costs.</li>
            <li>One date postponement is accommodated subject to vendor availability; rate differences and re-booking fees may apply.</li>
          </ul>

          <h2 className="reveal"><span className="n">04</span>Client Responsibilities</h2>
          <p className="reveal">The Client agrees to provide timely approvals, accurate guest counts, required permissions and access to venues, and to make payments on schedule. Delays in approvals may affect deliverables and timelines.</p>

          <h2 className="reveal"><span className="n">05</span>Third-Party Vendors</h2>
          <p className="reveal">We engage trusted partners on the Client&apos;s behalf. While we manage and coordinate vendors with utmost diligence, the Company is not liable for the independent acts, omissions, delays or quality of third-party vendors, force majeure events, or guest conduct.</p>

          <h2 className="reveal"><span className="n">06</span>Media &amp; Portfolio Rights</h2>
          <p className="reveal">Unless the Client opts out in writing, the Company may use photographs and films of the event for its portfolio, website and social media. Personal guest data is never shared. Clients may request specific images be withheld.</p>

          <h2 className="reveal"><span className="n">07</span>Liability</h2>
          <p className="reveal">Our total liability under any engagement shall not exceed the total professional fee paid to the Company for that engagement. We are not liable for indirect, incidental or consequential losses.</p>

          <h2 className="reveal"><span className="n">08</span>Force Majeure</h2>
          <p className="reveal">Neither party is liable for failure to perform due to events beyond reasonable control, including natural disasters, government restrictions, pandemics, or venue closures. We will work in good faith to reschedule.</p>

          <h2 className="reveal"><span className="n">09</span>Governing Law</h2>
          <p className="reveal">These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, and will first be referred to good-faith mediation.</p>

          <h2 className="reveal"><span className="n">10</span>Contact</h2>
          <p className="reveal">Questions about these Terms? Write to <a href="mailto:hello@vibgyorevents.com" className="grad-text" data-hover>hello@vibgyorevents.com</a>.</p>

          <p className="reveal legal-note">This page is a template for demonstration. Please have it reviewed by a qualified legal professional before going live.</p>
        </section>
      </main>
    </>
  );
}
