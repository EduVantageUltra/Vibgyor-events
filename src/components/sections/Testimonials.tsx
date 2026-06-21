import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const reviews = [
  {
    name: "Priya Sharma",
    role: "Bought Aurora 15 Pro",
    text: "Honestly the smoothest buying experience. They set up everything, transferred my data and the price beat every online store.",
  },
  {
    name: "Arjun Mehta",
    role: "Bought Sonic Buds Pro",
    text: "Walked in unsure, walked out with the perfect earbuds. The team actually knows their stuff — no pushy upselling.",
  },
  {
    name: "Neha Verma",
    role: "Bought Pulse Watch Active",
    text: "Ordered online, delivered same day. The watch was genuine, sealed and they even helped me pair it over a call.",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map((r, i) => (
        <Reveal key={r.name} delay={i * 0.08} className="glass h-full rounded-[2rem] p-7">
          <Quote className="h-8 w-8 text-iris/50" />
          <div className="mt-3 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="h-4 w-4 fill-amber text-amber" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-fog">{r.text}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-iris to-cyan font-display font-semibold text-ink">
              {r.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-fog-dim">{r.role}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
