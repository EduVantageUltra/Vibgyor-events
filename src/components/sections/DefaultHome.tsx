import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSlider, { type HeroSlide } from "@/components/sections/HeroSlider";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { AuroraButton } from "@/components/ui/AuroraButton";
import { Marquee } from "@/components/ui/Marquee";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";

export function DefaultHome({
  slides,
  featured,
}: {
  slides: HeroSlide[];
  featured: Product[];
}) {
  const brands = ["Aurora", "Noir", "Mint", "Ultra", "Sonic", "Volt", "Pulse", "Boom", "Shield"];

  return (
    <>
      <HeroSlider slides={slides} />

      <section className="border-y border-white/10 bg-white/[0.02] py-6">
        <Marquee>
          {brands.map((b) => (
            <span key={b} className="mx-10 font-display text-xl font-semibold tracking-tight text-fog-dim/60">
              {b}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Handpicked"
            title={<>Trending right <span className="text-aurora">now</span></>}
            description="The devices our customers can't stop talking about — curated, in stock and ready to ship today."
          />
          <Reveal delay={0.1}>
            <AuroraButton href="/shop" variant="outline">View all products</AuroraButton>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <SectionHeading
          eyebrow="Explore"
          title={<>Shop by <span className="text-aurora">category</span></>}
          className="mb-12"
        />
        <CategoryShowcase />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading
          align="center"
          eyebrow="Why Rajrishi"
          title={<>A shop that has your <span className="text-aurora">back</span></>}
          description="Twelve years on the same street, thousands of devices set up by hand. We treat every sale like it's our own phone."
          className="mb-14"
        />
        <FeatureGrid />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Stats />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="Loved locally"
          title={<>What the city <span className="text-aurora">says</span></>}
          className="mb-12"
        />
        <Testimonials />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet/30 via-ink to-cyan/20" />
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-iris/30 blur-[100px]" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-cyan/20 blur-[100px]" />
          <div className="relative flex flex-col items-center gap-6 px-8 py-20 text-center">
            <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Ready to upgrade your everyday?
            </h2>
            <p className="max-w-lg text-fog-dim">
              Browse online, reserve in store, or order on WhatsApp — whatever's easiest for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AuroraButton href="/shop">Start shopping</AuroraButton>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/10"
              >
                Order on WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
