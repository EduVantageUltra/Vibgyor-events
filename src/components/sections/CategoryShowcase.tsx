import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const cats = [
  { name: "Smartphones", img: "/products/phone-ultra.jpg", span: "md:col-span-2 md:row-span-2", blurb: "Flagships to budget heroes" },
  { name: "Audio", img: "/products/headphones-1.jpg", span: "", blurb: "ANC buds & headphones" },
  { name: "Wearables", img: "/products/watch-1.jpg", span: "", blurb: "Smartwatches & bands" },
  { name: "Charging", img: "/products/charger-1.jpg", span: "", blurb: "GaN, power banks, cables" },
  { name: "Cases & Protection", img: "/products/case-1.jpg", span: "", blurb: "Armour for your device" },
];

export function CategoryShowcase() {
  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[200px]">
      {cats.map((c, i) => (
        <Reveal
          key={c.name}
          delay={i * 0.05}
          className={cn("group relative", c.span)}
        >
          <Link
            href={`/shop?cat=${encodeURIComponent(c.name)}`}
            className="relative block h-full overflow-hidden rounded-[1.6rem] border border-white/10"
          >
            <Image
              src={c.img}
              alt={c.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{c.name}</h3>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-1 text-xs text-fog-dim">{c.blurb}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
