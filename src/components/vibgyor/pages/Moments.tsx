import Link from "next/link";
import MomentsGallery from "@/components/vibgyor/MomentsGallery";
import { momentPoster } from "@/lib/moments";

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

export default function Moments() {
  return (
    <>
      <header className="page-hero" style={ac("var(--orange)")}>
        <div className="ph-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax src={momentPoster("m03")} alt="" />
          <div className="ov" />
        </div>
        <div>
          <div className="sec-tag js-hero-fade" style={{ opacity: 0 }}>The Gallery</div>
          <h1>
            <span className="js-hero-line line"><span>A collection of</span></span>
            <span className="js-hero-line line"><span className="grad-text">moments.</span></span>
          </h1>
        </div>
      </header>

      <main className="page">
        <section style={ac("var(--violet)")}>
          <p className="lead-p reveal" style={{ maxWidth: 620 }}>
            Real celebrations, filmed as they happened — mandaps going up, fireworks going off, a sangeet stage the
            second before the lights drop. Filter by what you&apos;re planning, then tap any frame to play it.
          </p>

          <MomentsGallery />
        </section>
      </main>

      <div className="cta-band" style={ac("var(--violet)")}>
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={momentPoster("m01")} alt="" />
        </div>
        <div className="inner">
          <div className="sec-tag center reveal">Your Turn</div>
          <h2 className="sec-title reveal">Let&apos;s make a few <em>of your own.</em></h2>
          <p className="lead-p reveal" style={{ maxWidth: 520, margin: "0 auto 2.4rem" }}>
            Tell us your date. We&apos;ll bring the magic — and the memories that outlive it.
          </p>
          <Link href="/contact" className="btn-pill reveal" data-hover>Plan Your Wedding <span className="dot">→</span></Link>
        </div>
      </div>
    </>
  );
}
