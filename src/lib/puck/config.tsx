"use client";

import { Suspense } from "react";
import type { Config, Slot } from "@measured/puck";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaField } from "./MediaField";
import { ColorField } from "./ColorField";
import { PuckSlider } from "./PuckSlider";
import { TabsWidget, Countdown, Gallery, Pricing, FormBlock, MapEmbed, FaqWidget, StatsCounter, BentoGrid, LogoMarquee, ImageCompare } from "./widgets";
import { ThreeShape, Model3D, WebGLBackground } from "@/components/three/ThreeBlocks";
import { LottieBlock, ParallaxImage } from "@/components/scroll/blocks";
import { PuckBlogList } from "./PuckBlogList";
import { PuckCollectionList } from "./PuckCollectionList";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { ABTest } from "@/components/ab/ABTest";
import { PuckAnim } from "./PuckAnim";
import { ANIM_GROUPS } from "@/components/freecanvas/animations";
import { Marquee } from "@/components/ui/Marquee";
import { ErrorBoundary } from "@/components/util/ErrorBoundary";

// Renders a component's output inside a child so ErrorBoundary can catch throws.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SafeRender({ render, props }: { render: (p: any) => React.ReactNode; props: any }) {
  return <>{render(props)}</>;
}

const colorField = (label: string) => ({
  type: "custom" as const,
  label,
  render: ({ value, onChange }: { value: unknown; onChange: (v: string) => void }) => (
    <ColorField value={value as string} onChange={onChange} />
  ),
});

/* ---------- shared field helpers ---------- */
const alignField = {
  type: "radio" as const,
  options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ],
};
const alignClass = (a: string) =>
  a === "center" ? "text-center mx-auto" : a === "right" ? "text-right ml-auto" : "text-left";

type Props = {
  Heading: { text: string; size: "sm" | "md" | "lg" | "xl"; align: string; gradient: boolean; color: string };
  Eyebrow: { text: string; align: string };
  Text: { text: string; align: string; muted: boolean; size: "sm" | "md" | "lg"; color: string };
  ButtonBlock: { label: string; href: string; variant: "primary" | "outline"; align: string };
  Spacer: { height: number };
  Hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    media: string;
    mediaType: "image" | "video";
    heightVh: number;
    align: string;
  };
  FeatureCards: { items: { title: string; body: string }[] };
  MarqueeBlock: { text: string };
  CTASection: { title: string; subtitle: string; ctaLabel: string; ctaHref: string };
  Columns: { distribution: "1-1" | "1-2" | "2-1"; gap: number; left: Slot; right: Slot };
  Section: { maxWidth: "narrow" | "wide" | "full"; padY: number; minHeightVh: number; maxWidthPx: number; bg: string; textColor: string; content: Slot };
  ImageBlock: { src: string; alt: string; radius: number; aspect: string; widthPct: number };
  VideoBlock: { src: string; poster: string; radius: number; widthPct: number };
  SliderBlock: {
    slides: { mediaType: "image" | "video"; src: string; caption: string; link: string }[];
    autoplay: boolean;
    interval: number;
    heightVh: number;
    radius: number;
    design: string;
  };
  FaqWidget: { items: { q: string; a: string }[] };
  TabsWidget: { tabs: { label: string; body: string }[] };
  Countdown: { target: string; label: string };
  Gallery: { images: { src: string }[]; columns: number };
  Pricing: { plans: { name: string; price: string; period: string; features: string; featured: boolean; ctaLabel: string; ctaHref: string }[] };
  FormBlock: { heading: string; button: string };
  MapEmbed: { query: string; height: number };
  ThreeShape: { shape: string; color: string; metalness: number; autoRotate: boolean; height: number };
  Model3D: { url: string; autoRotate: boolean; height: number };
  WebGLBackground: { color: string; count: number; height: number; heading: string; subheading: string };
  LottieBlock: { url: string; loop: boolean; height: number };
  ParallaxImage: { src: string; height: number; strength: number; caption: string };
  StatsCounter: { items: { value: number; suffix: string; label: string }[] };
  BentoGrid: { items: { title: string; body: string; big: boolean; image: string }[] };
  LogoMarquee: { text: string };
  ImageCompare: { before: string; after: string; height: number };
  BlogList: { title: string; count: number };
  CollectionList: { collectionSlug: string; title: string; columns: number };
  ABTest: { expId: string; headingA: string; headingB: string; subA: string; subB: string; ctaLabel: string; ctaHref: string };
  MultiStepForm: { title: string; button: string; fields: { key: string; label: string; type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "file"; required: boolean; step: number; options: string; showIfField: string; showIfEquals: string }[] };
};

export const puckConfig: Config<Props> = {
  root: {
    render: ({ children }) => <div className="text-fog">{children}</div>,
  },
  categories: {
    layout: { title: "Layout", components: ["Section", "Columns", "Spacer"] },
    content: {
      title: "Content",
      components: ["Hero", "Heading", "Eyebrow", "Text", "ButtonBlock", "MarqueeBlock", "FeatureCards", "CTASection"],
    },
    media: { title: "Media", components: ["ImageBlock", "VideoBlock", "SliderBlock", "Gallery"] },
    widgets: { title: "Wedding & Widgets", components: ["Countdown", "Pricing", "FaqWidget", "TabsWidget", "FormBlock", "MultiStepForm", "MapEmbed", "StatsCounter", "BentoGrid", "LogoMarquee", "ImageCompare", "ABTest"] },
    threeD: { title: "3D & WebGL", components: ["ThreeShape", "Model3D", "WebGLBackground"] },
    motion: { title: "Scroll & Lottie", components: ["ParallaxImage", "LottieBlock"] },
    cms: { title: "Blog & CMS", components: ["BlogList", "CollectionList"] },
  },
  components: {
    /* ---------------- Hero ---------------- */
    Hero: {
      label: "Hero (video / image)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaLabel: { type: "text" },
        ctaHref: { type: "text" },
        mediaType: {
          type: "radio",
          options: [
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ],
        },
        media: {
          type: "custom",
          label: "Background media",
          render: ({ value, onChange, field }) => (
            <MediaField
              value={value as string}
              onChange={onChange}
              accept={(field as { mediaAccept?: string }).mediaAccept || "image/*,video/*"}
              label="Drop hero media"
            />
          ),
        },
        heightVh: { type: "number", min: 30, max: 100, label: "Height (% of screen)" },
        align: alignField,
      },
      defaultProps: {
        eyebrow: "New arrival",
        title: "Your headline here",
        subtitle: "A short, punchy line about this offer or product.",
        ctaLabel: "Enquire now",
        ctaHref: "/contact",
        media: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop",
        mediaType: "image",
        heightVh: 90,
        align: "left",
      },
      render: ({ eyebrow, title, subtitle, ctaLabel, ctaHref, media, mediaType, heightVh, align }) => {
        return (
          <section
            className="relative w-full overflow-hidden"
            style={{ minHeight: `${heightVh ?? 90}svh` }}
          >
            {mediaType === "video" && media ? (
              <video className="absolute inset-0 h-full w-full object-cover" src={media} autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="absolute inset-0 h-full w-full object-cover" src={media} alt={title} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 py-24">
              <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
                {eyebrow && (
                  <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    {eyebrow}
                  </span>
                )}
                <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
                  {title}
                </h1>
                {subtitle && <p className="mt-5 max-w-xl text-lg text-fog-dim">{subtitle}</p>}
                {ctaLabel && (
                  <Link
                    href={ctaHref || "#"}
                    className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-2.5 pl-6 pr-2.5 text-sm font-bold text-ink"
                  >
                    {ctaLabel}
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      },
    },

    /* ---------------- Heading ---------------- */
    Heading: {
      fields: {
        text: { type: "text" },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "XL", value: "xl" },
          ],
        },
        align: alignField,
        gradient: {
          type: "radio",
          options: [
            { label: "Solid", value: false },
            { label: "Aurora", value: true },
          ],
        },
        color: colorField("Text colour (optional)"),
      },
      defaultProps: { text: "A bold heading", size: "lg", align: "left", gradient: false, color: "none" },
      render: ({ text, size, align, gradient, color }) => {
        const sizes = { sm: "text-2xl", md: "text-3xl sm:text-4xl", lg: "text-4xl sm:text-5xl", xl: "text-5xl sm:text-7xl" };
        const custom = color && color !== "none";
        return (
          <h2
            className={cn("font-display font-bold leading-tight tracking-tight", sizes[size], alignClass(align), gradient && !custom && "text-aurora")}
            style={custom ? { color } : undefined}
          >
            {text}
          </h2>
        );
      },
    },

    /* ---------------- Eyebrow ---------------- */
    Eyebrow: {
      fields: { text: { type: "text" }, align: alignField },
      defaultProps: { text: "Eyebrow label", align: "left" },
      render: ({ text, align }) => (
        <div className={alignClass(align)}>
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fog-dim">
            {text}
          </span>
        </div>
      ),
    },

    /* ---------------- Text ---------------- */
    Text: {
      fields: {
        text: { type: "textarea" },
        align: alignField,
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
        muted: { type: "radio", options: [{ label: "Normal", value: false }, { label: "Muted", value: true }] },
        color: colorField("Text colour (optional)"),
      },
      defaultProps: { text: "Write your paragraph here. Click to edit.", align: "left", size: "md", muted: true, color: "none" },
      render: ({ text, align, size, muted, color }) => {
        const sizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };
        const custom = color && color !== "none";
        return (
          <p
            className={cn("max-w-2xl leading-relaxed", sizes[size], alignClass(align), !custom && (muted ? "text-fog-dim" : "text-fog"))}
            style={custom ? { color } : undefined}
          >
            {text}
          </p>
        );
      },
    },

    /* ---------------- Button ---------------- */
    ButtonBlock: {
      label: "Button",
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: { type: "radio", options: [{ label: "Primary", value: "primary" }, { label: "Outline", value: "outline" }] },
        align: alignField,
      },
      defaultProps: { label: "Click me", href: "/contact", variant: "primary", align: "left" },
      render: ({ label, href, variant, align }) => (
        <div className={alignClass(align)}>
          <Link
            href={href || "#"}
            className={cn(
              "group inline-flex items-center gap-3 rounded-full py-2.5 pl-6 pr-2.5 text-sm font-bold transition-transform active:scale-95",
              variant === "primary" ? "bg-gradient-to-r from-iris via-cyan to-amber text-ink" : "border border-white/15 bg-white/5 text-fog"
            )}
          >
            {label}
            <span className={cn("grid h-9 w-9 place-items-center rounded-full", variant === "primary" ? "bg-black/15" : "bg-white/10")}>
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      ),
    },

    /* ---------------- Image ---------------- */
    ImageBlock: {
      label: "Image",
      fields: {
        src: {
          type: "custom",
          label: "Image",
          render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop image" />,
        },
        alt: { type: "text" },
        widthPct: {
          type: "custom",
          label: "Width — drag to resize",
          render: ({ value, onChange }) => (
            <div>
              <input type="range" min={10} max={100} value={(value as number) ?? 100} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
              <div style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>{(value as number) ?? 100}% wide</div>
            </div>
          ),
        },
        radius: { type: "number", min: 0, max: 48 },
        aspect: {
          type: "select",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Square", value: "1/1" },
            { label: "Landscape 16:9", value: "16/9" },
            { label: "Wide 21:9", value: "21/9" },
            { label: "Portrait 3:4", value: "3/4" },
          ],
        },
      },
      defaultProps: { src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", alt: "Image", radius: 24, aspect: "16/9", widthPct: 100 },
      render: ({ src, alt, radius, aspect, widthPct }) => (
        <div style={{ width: `${widthPct ?? 100}%`, marginInline: "auto" }}>
          <div className="relative w-full overflow-hidden" style={{ borderRadius: radius, aspectRatio: aspect === "auto" ? undefined : aspect }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          </div>
        </div>
      ),
    },

    /* ---------------- Video ---------------- */
    VideoBlock: {
      label: "Video",
      fields: {
        src: {
          type: "custom",
          label: "Video file",
          render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="video/*" label="Drop video" />,
        },
        poster: {
          type: "custom",
          label: "Poster image",
          render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop poster" />,
        },
        widthPct: { type: "number", min: 10, max: 100, label: "Width (%)" },
        radius: { type: "number", min: 0, max: 48 },
      },
      defaultProps: { src: "", poster: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", radius: 24, widthPct: 100 },
      render: ({ src, poster, radius, widthPct }) => (
        <div style={{ width: `${widthPct ?? 100}%`, marginInline: "auto" }}>
          <div className="relative w-full overflow-hidden" style={{ borderRadius: radius }}>
            {src ? (
              <video src={src} poster={poster} controls autoPlay muted loop playsInline className="w-full" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="video poster" className="w-full" />
            )}
          </div>
        </div>
      ),
    },

    /* ---------------- Slider ---------------- */
    SliderBlock: {
      label: "Slider (images / videos)",
      fields: {
        slides: {
          type: "array",
          label: "Slides",
          arrayFields: {
            mediaType: {
              type: "radio",
              options: [
                { label: "Image", value: "image" },
                { label: "Video", value: "video" },
              ],
            },
            src: {
              type: "custom",
              label: "Image / video",
              render: ({ value, onChange }) => (
                <MediaField value={value as string} onChange={onChange} accept="image/*,video/*" label="Drop image or video" />
              ),
            },
            caption: { type: "text" },
            link: { type: "text" },
          },
          defaultItemProps: { mediaType: "image", src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", caption: "", link: "" },
          getItemSummary: (it, i) => it.caption || `Slide ${(i ?? 0) + 1}`,
        },
        design: {
          type: "select",
          label: "Slider style",
          options: [
            { label: "Fade", value: "fade" },
            { label: "Slide", value: "slide" },
            { label: "Zoom", value: "zoom" },
            { label: "3D Flip", value: "flip" },
            { label: "Ken Burns (cinematic)", value: "kenburns" },
            { label: "Parallax (parallel world)", value: "parallax" },
            { label: "Vertical", value: "vertical" },
            { label: "Card stack", value: "stack" },
            { label: "Reveal wipe", value: "reveal" },
            { label: "Blur", value: "blur" },
            { label: "Rotate", value: "rotate" },
          ],
        },
        autoplay: {
          type: "radio",
          options: [
            { label: "Autoplay", value: true },
            { label: "Manual", value: false },
          ],
        },
        interval: { type: "number", label: "Seconds per slide", min: 2, max: 15 },
        heightVh: { type: "number", label: "Height (% of screen)", min: 20, max: 100 },
        radius: { type: "number", min: 0, max: 48 },
      },
      defaultProps: {
        slides: [
          { mediaType: "image", src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", caption: "Slide one", link: "" },
          { mediaType: "image", src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", caption: "Slide two", link: "" },
          { mediaType: "image", src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", caption: "Slide three", link: "" },
        ],
        autoplay: true,
        interval: 5,
        heightVh: 70,
        radius: 24,
        design: "fade",
      },
      render: ({ slides, autoplay, interval, heightVh, radius, design }) => (
        <PuckSlider slides={slides} autoplay={autoplay} interval={interval} heightVh={heightVh} radius={radius} design={design} />
      ),
    },

    /* ---------------- Widgets ---------------- */
    FaqWidget: {
      label: "FAQ / Accordion",
      fields: {
        items: {
          type: "array",
          arrayFields: { q: { type: "text" }, a: { type: "textarea" } },
          defaultItemProps: { q: "Question?", a: "Answer goes here." },
          getItemSummary: (it) => it.q || "Question",
        },
      },
      defaultProps: { items: [{ q: "Are products genuine?", a: "Yes, all brand-authorised with warranty." }, { q: "How fast is delivery?", a: "Same-day in the city." }] },
      render: ({ items }) => <FaqWidget items={items} />,
    },
    TabsWidget: {
      label: "Tabs",
      fields: {
        tabs: {
          type: "array",
          arrayFields: { label: { type: "text" }, body: { type: "textarea" } },
          defaultItemProps: { label: "Tab", body: "Tab content." },
          getItemSummary: (it) => it.label || "Tab",
        },
      },
      defaultProps: { tabs: [{ label: "Overview", body: "Overview content." }, { label: "Specs", body: "Specs content." }] },
      render: ({ tabs }) => <TabsWidget tabs={tabs} />,
    },
    Countdown: {
      label: "Countdown timer",
      fields: { label: { type: "text" }, target: { type: "text", label: "End date (YYYY-MM-DD HH:MM)" } },
      defaultProps: { label: "Sale ends in", target: "2026-12-31 23:59" },
      render: ({ label, target }) => <Countdown label={label} target={target} />,
    },
    Pricing: {
      label: "Pricing table",
      fields: {
        plans: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            price: { type: "text" },
            period: { type: "text" },
            features: { type: "textarea", label: "Features (one per line)" },
            featured: { type: "radio", options: [{ label: "No", value: false }, { label: "Popular", value: true }] },
            ctaLabel: { type: "text" },
            ctaHref: { type: "text" },
          },
          defaultItemProps: { name: "Plan", price: "₹999", period: "/mo", features: "Feature one\nFeature two", featured: false, ctaLabel: "Choose", ctaHref: "/contact" },
          getItemSummary: (it) => it.name || "Plan",
        },
      },
      defaultProps: {
        plans: [
          { name: "Basic", price: "₹0", period: "", features: "In-store pickup\n7-day returns", featured: false, ctaLabel: "Start", ctaHref: "/contact" },
          { name: "Plus", price: "₹499", period: "/yr", features: "Free delivery\nPriority support\nExtended warranty", featured: true, ctaLabel: "Go Plus", ctaHref: "/contact" },
          { name: "Pro", price: "₹999", period: "/yr", features: "Everything in Plus\nFree screen guard\nAnnual service", featured: false, ctaLabel: "Go Pro", ctaHref: "/contact" },
        ],
      },
      render: ({ plans }) => <Pricing plans={plans} />,
    },
    Gallery: {
      label: "Image gallery",
      fields: {
        columns: { type: "number", min: 2, max: 5, label: "Columns" },
        images: {
          type: "array",
          arrayFields: {
            src: { type: "custom", label: "Image", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop image" /> },
          },
          defaultItemProps: { src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" },
          getItemSummary: (_it, i) => `Image ${(i ?? 0) + 1}`,
        },
      },
      defaultProps: { columns: 3, images: [{ src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }] },
      render: ({ images, columns }) => <Gallery images={images} columns={columns} />,
    },
    FormBlock: {
      label: "Contact form",
      fields: { heading: { type: "text" }, button: { type: "text" } },
      defaultProps: { heading: "Get in touch", button: "Send on WhatsApp" },
      render: ({ heading, button }) => <FormBlock heading={heading} button={button} />,
    },
    MapEmbed: {
      label: "Map",
      fields: { query: { type: "text", label: "Address / place" }, height: { type: "number", min: 200, max: 700 } },
      defaultProps: { query: "Connaught Place, Delhi", height: 360 },
      render: ({ query, height }) => <MapEmbed query={query} height={height} />,
    },

    /* ---------------- 3D & WebGL ---------------- */
    ThreeShape: {
      label: "3D shape (spinning)",
      fields: {
        shape: { type: "select", options: [
          { label: "Torus knot", value: "torusKnot" },
          { label: "Sphere", value: "sphere" },
          { label: "Cube", value: "box" },
          { label: "Dodecahedron", value: "dodecahedron" },
          { label: "Torus", value: "torus" },
        ] },
        color: colorField("Colour"),
        metalness: { type: "number", min: 0, max: 1, label: "Metalness" },
        autoRotate: { type: "radio", options: [{ label: "Spin", value: true }, { label: "Still", value: false }] },
        height: { type: "number", min: 200, max: 800 },
      },
      defaultProps: { shape: "torusKnot", color: "#7c5cff", metalness: 0.6, autoRotate: true, height: 360 },
      render: ({ shape, color, metalness, autoRotate, height }) => (
        <ThreeShape shape={shape} color={color === "none" ? "#7c5cff" : color} metalness={metalness} autoRotate={autoRotate} height={height} />
      ),
    },
    Model3D: {
      label: "3D model viewer (.glb)",
      fields: {
        url: { type: "custom", label: "3D model (.glb/.gltf)", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept=".glb,.gltf,model/gltf-binary" label="Drop .glb model" /> },
        autoRotate: { type: "radio", options: [{ label: "Auto-rotate", value: true }, { label: "Manual", value: false }] },
        height: { type: "number", min: 200, max: 800 },
      },
      defaultProps: { url: "", autoRotate: true, height: 420 },
      render: ({ url, autoRotate, height }) => <Model3D url={url} autoRotate={autoRotate} height={height} />,
    },
    WebGLBackground: {
      label: "WebGL particle background",
      fields: {
        heading: { type: "text" },
        subheading: { type: "text" },
        color: colorField("Particle colour"),
        count: { type: "number", min: 100, max: 3000, label: "Particle count" },
        height: { type: "number", min: 200, max: 900 },
      },
      defaultProps: { heading: "Immersive", subheading: "Built with WebGL", color: "#7c5cff", count: 800, height: 460 },
      render: ({ heading, subheading, color, count, height }) => (
        <WebGLBackground heading={heading} subheading={subheading} color={color === "none" ? "#7c5cff" : color} count={count} height={height} />
      ),
    },

    /* ---------------- Multi-step form ---------------- */
    MultiStepForm: {
      label: "Form builder (multi-step)",
      fields: {
        title: { type: "text" },
        button: { type: "text" },
        fields: {
          type: "array",
          label: "Fields",
          arrayFields: {
            label: { type: "text" },
            key: { type: "text", label: "Key (unique, e.g. phone)" },
            type: { type: "select", options: [
              { label: "Text", value: "text" }, { label: "Email", value: "email" }, { label: "Phone", value: "tel" },
              { label: "Long text", value: "textarea" }, { label: "Dropdown", value: "select" }, { label: "Checkbox", value: "checkbox" }, { label: "File upload", value: "file" },
            ] },
            required: { type: "radio", options: [{ label: "Optional", value: false }, { label: "Required", value: true }] },
            step: { type: "number", label: "Step (0,1,2…)", min: 0, max: 9 },
            options: { type: "text", label: "Dropdown options (comma)" },
            showIfField: { type: "text", label: "Show if field… (key)" },
            showIfEquals: { type: "text", label: "…equals" },
          },
          defaultItemProps: { label: "Field", key: "field", type: "text", required: false, step: 0, options: "", showIfField: "", showIfEquals: "" },
          getItemSummary: (it) => `${it.label} (step ${it.step})`,
        },
      },
      defaultProps: {
        title: "Get a quote",
        button: "Submit",
        fields: [
          { label: "Your name", key: "name", type: "text", required: true, step: 0, options: "", showIfField: "", showIfEquals: "" },
          { label: "Phone", key: "phone", type: "tel", required: true, step: 0, options: "", showIfField: "", showIfEquals: "" },
          { label: "What are you after?", key: "interest", type: "select", required: true, step: 1, options: "Phone, Audio, Repair, Other", showIfField: "", showIfEquals: "" },
          { label: "Tell us more", key: "details", type: "textarea", required: false, step: 1, options: "", showIfField: "interest", showIfEquals: "Other" },
        ],
      },
      render: ({ title, button, fields }) => <MultiStepForm title={title} button={button} fields={fields} />,
    },

    /* ---------------- A/B test ---------------- */
    ABTest: {
      label: "A/B test (headline + CTA)",
      fields: {
        expId: { type: "text", label: "Experiment id (unique)" },
        headingA: { type: "text", label: "Variant A heading" },
        subA: { type: "text", label: "Variant A subtext" },
        headingB: { type: "text", label: "Variant B heading" },
        subB: { type: "text", label: "Variant B subtext" },
        ctaLabel: { type: "text" },
        ctaHref: { type: "text" },
      },
      defaultProps: { expId: "hero-test", headingA: "Your dream wedding, designed", subA: "Cinematic, stress-free, unforgettable.", headingB: "The wedding you deserve", subB: "20+ years. 850+ weddings crafted.", ctaLabel: "Enquire now", ctaHref: "/contact" },
      render: ({ expId, headingA, headingB, subA, subB, ctaLabel, ctaHref }) => (
        <ABTest expId={expId} headingA={headingA} headingB={headingB} subA={subA} subB={subB} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      ),
    },

    /* ---------------- Blog list ---------------- */
    BlogList: {
      label: "Blog — latest posts",
      fields: { title: { type: "text" }, count: { type: "number", min: 1, max: 9 } },
      defaultProps: { title: "From the blog", count: 3 },
      render: ({ title, count }) => <PuckBlogList title={title} count={count} />,
    },

    /* ---------------- Collection list ---------------- */
    CollectionList: {
      label: "Collection list (CMS)",
      fields: {
        collectionSlug: { type: "text", label: "Collection slug (e.g. stores)" },
        title: { type: "text" },
        columns: { type: "number", min: 1, max: 4 },
      },
      defaultProps: { collectionSlug: "stores", title: "Our stores", columns: 3 },
      render: ({ collectionSlug, title, columns }) => <PuckCollectionList collectionSlug={collectionSlug} title={title} columns={columns} />,
    },

    /* ---------------- Modern blocks ---------------- */
    StatsCounter: {
      label: "Stats (animated counters)",
      fields: {
        items: {
          type: "array",
          arrayFields: { value: { type: "number" }, suffix: { type: "text" }, label: { type: "text" } },
          defaultItemProps: { value: 100, suffix: "+", label: "Metric" },
          getItemSummary: (it) => it.label || "Stat",
        },
      },
      defaultProps: { items: [{ value: 12, suffix: "+", label: "Years" }, { value: 48000, suffix: "+", label: "Customers" }, { value: 300, suffix: "+", label: "Products" }, { value: 24, suffix: "h", label: "Delivery" }] },
      render: ({ items }) => <StatsCounter items={items} />,
    },
    BentoGrid: {
      label: "Bento grid",
      fields: {
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "text" },
            big: { type: "radio", options: [{ label: "Normal", value: false }, { label: "Big", value: true }] },
            image: { type: "custom", label: "Image", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop image" /> },
          },
          defaultItemProps: { title: "Card", body: "", big: false, image: "" },
          getItemSummary: (it) => it.title || "Card",
        },
      },
      defaultProps: { items: [{ title: "The Wedding", body: "The big day", big: true, image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { title: "Sangeet", body: "", big: false, image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { title: "Haldi", body: "", big: false, image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { title: "Mehendi", body: "", big: false, image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }, { title: "Reception", body: "", big: false, image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop" }] },
      render: ({ items }) => <BentoGrid items={items} />,
    },
    LogoMarquee: {
      label: "Logo / brand marquee",
      fields: { text: { type: "text", label: "Brands (comma separated)" } },
      defaultProps: { text: "Aurora, Noir, Mint, Ultra, Sonic, Volt, Pulse, Boom, Shield" },
      render: ({ text }) => <LogoMarquee text={text} />,
    },
    ImageCompare: {
      label: "Before / after slider",
      fields: {
        before: { type: "custom", label: "Before image", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop 'before'" /> },
        after: { type: "custom", label: "After image", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop 'after'" /> },
        height: { type: "number", min: 200, max: 700 },
      },
      defaultProps: { before: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", after: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", height: 420 },
      render: ({ before, after, height }) => <ImageCompare before={before} after={after} height={height} />,
    },

    /* ---------------- Scroll & Lottie ---------------- */
    ParallaxImage: {
      label: "Parallax image (scroll)",
      fields: {
        src: { type: "custom", label: "Image", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept="image/*" label="Drop image" /> },
        caption: { type: "text" },
        strength: { type: "number", min: 20, max: 250, label: "Parallax strength" },
        height: { type: "number", min: 200, max: 800 },
      },
      defaultProps: { src: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=1200&auto=format&fit=crop", caption: "", strength: 90, height: 440 },
      render: ({ src, caption, strength, height }) => <ParallaxImage src={src} caption={caption} strength={strength} height={height} />,
    },
    LottieBlock: {
      label: "Lottie animation",
      fields: {
        url: { type: "custom", label: "Lottie JSON", render: ({ value, onChange }) => <MediaField value={value as string} onChange={onChange} accept=".json,application/json" label="Drop .json or paste URL" /> },
        loop: { type: "radio", options: [{ label: "Loop", value: true }, { label: "Once", value: false }] },
        height: { type: "number", min: 120, max: 700 },
      },
      defaultProps: { url: "", loop: true, height: 320 },
      render: ({ url, loop, height }) => <LottieBlock url={url} loop={loop} height={height} />,
    },

    /* ---------------- Spacer ---------------- */
    Spacer: {
      fields: { height: { type: "number", min: 8, max: 240 } },
      defaultProps: { height: 48 },
      render: ({ height }) => <div style={{ height }} />,
    },

    /* ---------------- Feature cards ---------------- */
    FeatureCards: {
      label: "Feature cards",
      fields: {
        items: {
          type: "array",
          arrayFields: { title: { type: "text" }, body: { type: "textarea" } },
          defaultItemProps: { title: "Feature", body: "Describe it briefly." },
          getItemSummary: (i) => i.title || "Feature",
        },
      },
      defaultProps: {
        items: [
          { title: "End-to-end planning", body: "From save-the-date to send-off, we handle every thread." },
          { title: "Cinematic design", body: "Mandaps & stages that take the breath away." },
          { title: "Stress-free celebration", body: "You enjoy your day. We stay invisible." },
        ],
      },
      render: ({ items }) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="bezel">
              <div className="h-full rounded-[calc(2rem-0.4rem)] bg-gradient-to-b from-white/[0.06] to-transparent p-6">
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-dim">{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },

    /* ---------------- Marquee ---------------- */
    MarqueeBlock: {
      label: "Marquee text",
      fields: { text: { type: "text" } },
      defaultProps: { text: "Mehendi · Haldi · Sangeet · The Wedding · Reception · Destination" },
      render: ({ text }) => (
        <Marquee className="border-y border-white/10 py-6">
          {text.split("·").map((w, i) => (
            <span key={i} className="mx-8 font-display text-3xl font-semibold tracking-tight text-fog-dim/50 sm:text-4xl">
              {w.trim()} ✦
            </span>
          ))}
        </Marquee>
      ),
    },

    /* ---------------- CTA ---------------- */
    CTASection: {
      label: "CTA banner",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaLabel: { type: "text" },
        ctaHref: { type: "text" },
      },
      defaultProps: {
        title: "Ready to upgrade?",
        subtitle: "Browse online or order on WhatsApp — whatever's easiest.",
        ctaLabel: "Plan your wedding",
        ctaHref: "/contact",
      },
      render: ({ title, subtitle, ctaLabel, ctaHref }) => (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet/30 via-ink to-cyan/20" />
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-iris/30 blur-[100px]" />
          <div className="relative flex flex-col items-center gap-6 px-8 py-20 text-center">
            <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{title}</h2>
            <p className="max-w-lg text-fog-dim">{subtitle}</p>
            <Link href={ctaHref || "#"} className="rounded-full bg-gradient-to-r from-iris via-cyan to-amber px-7 py-3 text-sm font-bold text-ink">
              {ctaLabel}
            </Link>
          </div>
        </div>
      ),
    },

    /* ---------------- Columns (slots) ---------------- */
    Columns: {
      label: "Columns",
      fields: {
        distribution: {
          type: "radio",
          options: [
            { label: "1 : 1", value: "1-1" },
            { label: "1 : 2", value: "1-2" },
            { label: "2 : 1", value: "2-1" },
          ],
        },
        gap: { type: "number", min: 0, max: 64 },
        left: { type: "slot" },
        right: { type: "slot" },
      },
      defaultProps: { distribution: "1-1", gap: 24, left: [], right: [] },
      render: ({ distribution, gap, left: Left, right: Right }) => {
        const cols = distribution === "1-2" ? "md:grid-cols-[1fr_2fr]" : distribution === "2-1" ? "md:grid-cols-[2fr_1fr]" : "md:grid-cols-2";
        return (
          <div className={cn("grid grid-cols-1", cols)} style={{ gap }}>
            <div><Left /></div>
            <div><Right /></div>
          </div>
        );
      },
    },

    /* ---------------- Section wrapper ---------------- */
    Section: {
      label: "Section (container)",
      fields: {
        maxWidth: {
          type: "radio",
          options: [
            { label: "Narrow", value: "narrow" },
            { label: "Wide", value: "wide" },
            { label: "Full", value: "full" },
          ],
        },
        maxWidthPx: { type: "number", min: 0, max: 2000, label: "Custom max width (px, 0 = use preset)" },
        padY: { type: "number", min: 0, max: 200, label: "Top/bottom padding" },
        minHeightVh: { type: "number", min: 0, max: 100, label: "Min height (% of screen, 0 = auto)" },
        bg: colorField("Background colour"),
        textColor: colorField("Text colour"),
        content: { type: "slot" },
      },
      defaultProps: { maxWidth: "wide", maxWidthPx: 0, padY: 64, minHeightVh: 0, bg: "none", textColor: "none", content: [] },
      render: ({ maxWidth, maxWidthPx, padY, minHeightVh, bg, textColor, content: Content }) => {
        const mw = maxWidth === "narrow" ? "max-w-3xl" : maxWidth === "full" ? "max-w-none" : "max-w-6xl";
        const useCustom = (maxWidthPx ?? 0) > 0;
        const hasBg = bg && bg !== "none";
        const hasText = textColor && textColor !== "none";
        return (
          <div
            style={{
              background: hasBg ? bg : undefined,
              color: hasText ? textColor : undefined,
            }}
          >
            <div
              className={cn("mx-auto w-full px-6", !useCustom && mw)}
              style={{
                paddingTop: padY,
                paddingBottom: padY,
                maxWidth: useCustom ? maxWidthPx : undefined,
                minHeight: (minHeightVh ?? 0) > 0 ? `${minHeightVh}svh` : undefined,
              }}
            >
              <Content />
            </div>
          </div>
        );
      },
    },
  },
};

/* ------------------------------------------------------------------
   Animation augmentation — gives EVERY block an animation control
   (entrance / scroll / loop / hover) and wraps its render so the
   effect plays on the live site (and stays static while editing).
   ------------------------------------------------------------------ */
const animOptions = [
  { label: "None", value: "none" },
  ...ANIM_GROUPS.filter((g) => !g.group.startsWith("Text")).flatMap((g) => {
    const tag = g.group.startsWith("Entrance") ? "Enter" : g.group.startsWith("Loop") ? "Loop" : "Hover";
    return g.items.map((it) => ({ label: `${tag} · ${it.label}`, value: it.value }));
  }),
];

const ANIM_FIELDS = {
  animPreset: { type: "select", label: "✦ Animation", options: animOptions },
  animTrigger: {
    type: "radio",
    label: "Plays",
    options: [
      { label: "On scroll", value: "scroll" },
      { label: "On load", value: "load" },
    ],
  },
  animDuration: { type: "number", label: "Anim speed (s)", min: 0.2, max: 3 },
  animDelay: { type: "number", label: "Anim delay (s)", min: 0, max: 3 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
for (const comp of Object.values(puckConfig.components) as any[]) {
  comp.fields = { ...comp.fields, ...ANIM_FIELDS };
  comp.defaultProps = { ...(comp.defaultProps ?? {}), animPreset: "none", animTrigger: "scroll", animDuration: 0.8, animDelay: 0 };
  const orig = comp.render;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comp.render = (props: any) => (
    <Suspense fallback={null}>
      <ErrorBoundary>
        <PuckAnim
          preset={props.animPreset}
          trigger={props.animTrigger}
          duration={props.animDuration}
          delay={props.animDelay}
          editing={props.puck?.isEditing}
        >
          <SafeRender render={orig} props={props} />
        </PuckAnim>
      </ErrorBoundary>
    </Suspense>
  );
}
