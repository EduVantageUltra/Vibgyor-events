import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export type LegalSection = { heading: string; body: string[] };

export function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: React.ReactNode;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={intro} />
      <article className="mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-10 text-xs uppercase tracking-wider text-fog-dim">Last updated · {updated}</p>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <Reveal key={i} delay={Math.min(i * 0.03, 0.2)}>
              <section>
                <h2 className="font-display text-xl font-semibold">
                  <span className="mr-2 text-iris">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-fog-dim">{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </article>
    </>
  );
}
