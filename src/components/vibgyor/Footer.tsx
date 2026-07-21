import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ "--accent": "var(--blue)" } as React.CSSProperties}>
      <div className="foot-rainbow" />
      <div className="foot-top">
        <div className="foot-brand">
          <div className="fb">Vibgyor <span className="grad-text">Events</span></div>
          <p>Luxury wedding &amp; celebration designers, crafting forever moments across India and beyond since 2005.</p>
        </div>
        <div className="foot-col">
          <h5>Explore</h5>
          <Link href="/about">The Studio</Link>
          <Link href="/services">Experiences</Link>
          <Link href="/gallery">Weddings</Link>
          <Link href="/moments">Moments</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="foot-col">
          <h5>Legal</h5>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <div className="foot-col">
          <h5>Connect</h5>
          <a href="#" data-hover>Instagram</a>
          <a href="#" data-hover>Pinterest</a>
          <a href="mailto:hello@vibgyorevents.com" data-hover>hello@vibgyorevents.com</a>
          <a href="tel:+910000000000" data-hover>+91 98XXX XXXXX</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Vibgyor Events. All moments reserved.</span>
        <span>Crafted with devotion in India</span>
      </div>
    </footer>
  );
}
