import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="relative overflow-hidden pb-12 pt-36">
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-iris/20 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {eyebrow && (
          <Reveal>
            <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fog-dim">
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fog-dim sm:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
