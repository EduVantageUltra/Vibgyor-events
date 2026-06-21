import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionLayer from "@/components/MotionLayer";

export const metadata: Metadata = {
  title: "Vibgyor Events — We Craft Forever | Luxury Indian Wedding Designers",
  description:
    "Vibgyor Events — India's luxury wedding & celebration designers. 20+ years crafting unforgettable Indian weddings across the country and beyond.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="aura"><span /><span /><span /><span /></div>
        <div className="cursor" />
        <div className="cursor-ring" />

        <div className="loader" id="loader">
          <div className="loader-word" />
          <div className="loader-sub">Crafting Forever Moments</div>
          <div className="loader-bar" />
        </div>

        <Nav />
        <MotionLayer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
