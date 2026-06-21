import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { getTheme, themeToCssVars, designAssets } from "@/lib/theme";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

function ThemeStyles() {
  const theme = getTheme();
  const design = designAssets(theme.design);
  return (
    <>
      <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeToCssVars(theme) }} />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      {design.fontHref ? <link rel="stylesheet" href={design.fontHref} /> : null}
      <style id="design-vars" dangerouslySetInnerHTML={{ __html: design.css }} />
      {theme.customCss ? <style id="custom-css" dangerouslySetInnerHTML={{ __html: theme.customCss }} /> : null}
    </>
  );
}

const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://vibgyorevents.example.com"),
  title: {
    default: "Vibgyor Events — Luxury Indian Wedding Designers",
    template: "%s · Vibgyor Events",
  },
  description:
    "Vibgyor Events — India's luxury wedding & celebration designers. 20+ years crafting unforgettable Indian weddings across the country and beyond.",
  keywords: ["luxury wedding planner", "Indian wedding", "destination wedding", "Vibgyor Events", "wedding designer"],
  openGraph: {
    title: "Vibgyor Events",
    description: "Luxury Indian wedding & celebration designers. We craft forever.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <ThemeStyles />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
      </body>
    </html>
  );
}
