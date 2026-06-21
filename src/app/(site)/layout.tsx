import Nav from "@/components/vibgyor/Nav";
import Footer from "@/components/vibgyor/Footer";
import MotionLayer from "@/components/vibgyor/MotionLayer";
import Petals from "@/components/vibgyor/Petals";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="vib-site">
      <div className="aura"><span /><span /><span /><span /></div>
      <Petals />
      <div className="cursor" />
      <div className="cursor-ring" />

      <div className="loader" id="loader">
        <div className="loader-word" />
        <div className="loader-sub">Crafting Forever Moments</div>
        <div className="loader-bar" />
      </div>

      <Nav />
      <MotionLayer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
