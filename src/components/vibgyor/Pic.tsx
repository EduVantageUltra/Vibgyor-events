/* eslint-disable @next/next/no-img-element */

/**
 * Plain <img> with a responsive srcset for Unsplash URLs.
 *
 * Desktop keeps loading the same large file it always did — the browser simply
 * gets the option to pick a smaller one on a narrow screen, which is where the
 * whole 5 MB homepage payload was coming from.
 */

const WIDTHS = [400, 640, 828, 1080, 1400, 1920];

/**
 * `sizes` for full-bleed decorative backdrops (page heroes, CTA bands).
 * They sit behind a brightness(~0.4) overlay, so a 3x phone does not need the
 * 1400px file its DPR would otherwise demand — 70vw deliberately under-declares
 * and halves the download with no visible difference. Desktop still gets 100vw.
 */
export const BACKDROP_SIZES = "(max-width: 700px) 70vw, 100vw";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  /** CSS `sizes` — how wide this image renders at a given breakpoint. */
  sizes?: string;
  /** Above the fold: load eagerly at high priority instead of lazily. */
  priority?: boolean;
};

export default function Pic({ src, alt = "", sizes = "100vw", priority, ...rest }: Props) {
  const responsive = src.includes("images.unsplash.com") && /[?&]w=\d+/.test(src);
  const srcSet = responsive
    ? WIDTHS.map((w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(", ")
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "auto" : "async"}
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
