const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

export const metadata = { title: "Privacy Policy — Vibgyor Events" };

export default function Privacy() {
  return (
    <>
      <header className="page-hero" style={{ ...ac("var(--green)"), minHeight: "42vh" }}>
        <div><div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>Legal · Updated June 2026</div><h1><span className="js-hero-line line"><span>Privacy <span className="grad-text">Policy</span></span></span></h1></div>
      </header>

      <main className="page">
        <section className="legal" style={{ ...ac("var(--green)"), paddingTop: "2rem" }}>
          <p className="reveal lead-p">Vibgyor Events respects your privacy. This Policy explains what information we collect, how we use it, and the choices you have. It applies to this website and to our planning services.</p>

          <h2 className="reveal"><span className="n">01</span>Information We Collect</h2>
          <ul className="reveal">
            <li><b>Information you give us:</b> name, phone, email, wedding date, city, budget range and any details you submit through our enquiry forms.</li>
            <li><b>Automatically:</b> basic analytics such as pages visited and device type, used only to improve the site.</li>
            <li><b>Event information:</b> details necessary to plan and execute your celebration, shared only with vendors essential to your event.</li>
          </ul>

          <h2 className="reveal"><span className="n">02</span>How We Use It</h2>
          <ul className="reveal">
            <li>To respond to your enquiry and prepare proposals.</li>
            <li>To plan, coordinate and deliver your event.</li>
            <li>To send relevant updates (you may opt out anytime).</li>
            <li>To improve our website and services.</li>
          </ul>

          <h2 className="reveal"><span className="n">03</span>Sharing</h2>
          <p className="reveal">We share information only with vendors and partners strictly required to deliver your event, and only the minimum necessary. We never sell your personal data. We may disclose information where required by law.</p>

          <h2 className="reveal"><span className="n">04</span>Media Consent</h2>
          <p className="reveal">Photographs and films of your event are used for our portfolio only with your consent, which you may withdraw or limit in writing at any time.</p>

          <h2 className="reveal"><span className="n">05</span>Data Security &amp; Retention</h2>
          <p className="reveal">We apply reasonable safeguards to protect your information and retain it only as long as needed for the purposes above or as required by law.</p>

          <h2 className="reveal"><span className="n">06</span>Your Rights</h2>
          <p className="reveal">You may request access to, correction of, or deletion of your personal data, and may opt out of marketing communications, by writing to <a href="mailto:hello@vibgyorevents.com" className="grad-text" data-hover>hello@vibgyorevents.com</a>.</p>

          <h2 className="reveal"><span className="n">07</span>Cookies</h2>
          <p className="reveal">This site may use minimal cookies for analytics and to remember preferences. You can disable cookies in your browser settings.</p>

          <h2 className="reveal"><span className="n">08</span>Updates</h2>
          <p className="reveal">We may update this Policy from time to time. The latest version will always appear on this page with its revision date.</p>

          <p className="reveal legal-note">This page is a template for demonstration. Please have it reviewed by a qualified legal professional before going live.</p>
        </section>
      </main>
    </>
  );
}
