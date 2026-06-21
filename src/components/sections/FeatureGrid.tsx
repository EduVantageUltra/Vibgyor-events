import { ShieldCheck, Truck, BadgeIndianRupee, Headphones } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    Icon: ShieldCheck,
    title: "100% genuine",
    body: "Every device is brand-authorised with full manufacturer warranty. No grey-market, ever.",
  },
  {
    Icon: Truck,
    title: "Fast delivery",
    body: "Same-day in the city, 24–48h nationwide. Tracked from our counter to your door.",
  },
  {
    Icon: BadgeIndianRupee,
    title: "Best price + EMI",
    body: "Sharp pricing, easy EMI and exchange offers that actually save you money.",
  },
  {
    Icon: Headphones,
    title: "Real human support",
    body: "Talk to people who know phones. Setup help, repairs and advice — before and after you buy.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <Reveal key={f.title} delay={i * 0.06} className="bezel group h-full">
          <div className="flex h-full flex-col rounded-[calc(2rem-0.4rem)] bg-gradient-to-b from-white/[0.06] to-transparent p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-iris/20 to-cyan/10 text-iris ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-1">
              <f.Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fog-dim">{f.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
