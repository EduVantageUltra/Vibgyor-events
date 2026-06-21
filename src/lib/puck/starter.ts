import type { Data } from "@measured/puck";

/**
 * Ready-made starter content the owner sees when they first open a page in the
 * editor — reflects THIS website (Vibgyor Events), so they tweak real content
 * instead of a blank page. Published only when the owner hits Publish.
 */
const U = (id: string, w = 1400) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const HOME: Data = {
  root: { props: {} },
  content: [
    {
      type: "Hero",
      props: {
        id: "hero",
        eyebrow: "India · Destination · 20+ Years",
        title: "We Don't Plan Weddings. We Craft Forever.",
        subtitle: "From the first phera to the last dance — Vibgyor Events designs Indian celebrations that feel like a memory before they even begin.",
        ctaLabel: "Begin Your Story",
        ctaHref: "/contact",
        media: U("photo-1727430256509-0f897d6f4765", 1920),
        mediaType: "image",
        heightVh: 92,
        align: "center",
      },
    },
    { type: "MarqueeBlock", props: { id: "mq", text: "Mehendi · Haldi · Sangeet · The Wedding · Reception · Destination" } },
    {
      type: "Section",
      props: {
        id: "stats-sec", maxWidth: "wide", padY: 72,
        content: [
          { type: "StatsCounter", props: { id: "stats", items: [
            { value: 20, suffix: "+", label: "Years of Magic" },
            { value: 850, suffix: "+", label: "Weddings Crafted" },
            { value: 18, suffix: "", label: "Cities & Beyond" },
            { value: 100, suffix: "%", label: "Smiles Delivered" },
          ] } },
        ],
      },
    },
    {
      type: "Section",
      props: {
        id: "exp-sec", maxWidth: "wide", padY: 72,
        content: [
          { type: "Eyebrow", props: { id: "exp-eb", text: "The Experiences", align: "center" } },
          { type: "Heading", props: { id: "exp-h", text: "Every ritual, reimagined.", size: "lg", align: "center", gradient: true } },
          { type: "Spacer", props: { id: "exp-sp", height: 28 } },
          { type: "FeatureCards", props: { id: "exp-fc", items: [
            { title: "Pre-Wedding", body: "Cinematic shoots & intimate gatherings that set the tone." },
            { title: "Haldi & Mehendi", body: "Marigold canopies and afternoons drenched in joy." },
            { title: "Sangeet", body: "Choreography, live acts and an unforgettable evening." },
            { title: "The Wedding", body: "A mandap that takes the breath away." },
            { title: "Reception", body: "Black-tie glamour and a send-off worthy of royalty." },
            { title: "Destination", body: "From Udaipur palaces to Kerala backwaters." },
          ] } },
        ],
      },
    },
    {
      type: "Section",
      props: {
        id: "gal-sec", maxWidth: "wide", padY: 64,
        content: [
          { type: "Eyebrow", props: { id: "gal-eb", text: "Selected Weddings", align: "left" } },
          { type: "Heading", props: { id: "gal-h", text: "Stories we've brought to life.", size: "lg", align: "left", gradient: false } },
          { type: "Spacer", props: { id: "gal-sp", height: 24 } },
          { type: "Gallery", props: { id: "gal", columns: 3, images: [
            { src: U("photo-1727430256509-0f897d6f4765") }, { src: U("photo-1599462616558-2b75fd26a283") },
            { src: U("photo-1744891471118-f74c0453cd21") }, { src: U("photo-1611106211090-8f3c79eb8552") },
            { src: U("photo-1587271407850-8d438ca9fdf2") }, { src: U("photo-1745573674206-1d4805fcc427") },
          ] } },
        ],
      },
    },
    {
      type: "Section",
      props: {
        id: "cta-sec", maxWidth: "wide", padY: 56,
        content: [
          { type: "CTASection", props: { id: "cta", title: "Your forever starts here.", subtitle: "Tell us your date. We'll bring the magic.", ctaLabel: "Plan Your Wedding", ctaHref: "/contact" } },
        ],
      },
    },
  ],
  zones: {},
};

const ABOUT: Data = {
  root: { props: {} },
  content: [
    { type: "Hero", props: { id: "a-hero", eyebrow: "Est. 2005 · 20+ Years", title: "The studio behind a thousand stories.", subtitle: "Two decades designing India's most cherished weddings.", ctaLabel: "Plan Your Day", ctaHref: "/contact", media: U("photo-1611106211090-8f3c79eb8552", 1920), mediaType: "image", heightVh: 70, align: "left" } },
    { type: "Section", props: { id: "a-sec", maxWidth: "wide", padY: 72, content: [
      { type: "Eyebrow", props: { id: "a-eb", text: "Our Story", align: "left" } },
      { type: "Heading", props: { id: "a-h", text: "Luxury is a feeling, not a price tag.", size: "lg", align: "left", gradient: true } },
      { type: "Text", props: { id: "a-t", text: "It began in 2005 with one borrowed marigold garland and an impossible promise: to make a wedding feel like a dream. Twenty years and 850+ weddings later, that promise hasn't changed — only the scale has.", align: "left", muted: true, size: "md" } },
      { type: "Spacer", props: { id: "a-sp", height: 24 } },
      { type: "FeatureCards", props: { id: "a-fc", items: [
        { title: "Presence over Stress", body: "You should be a guest at your own wedding. We carry the weight." },
        { title: "Detail is Devotion", body: "The fold of a napkin. The timing of a song. We obsess so the day feels effortless." },
        { title: "Your Culture, Elevated", body: "Every ritual honoured, every tradition respected — then designed to dazzle." },
      ] } },
    ] } },
  ],
  zones: {},
};

const SERVICES: Data = {
  root: { props: {} },
  content: [
    { type: "Hero", props: { id: "s-hero", eyebrow: "The Experiences", title: "Every ritual, reimagined.", subtitle: "From the courtship shoot to the final send-off — every chapter we design.", ctaLabel: "Start Planning", ctaHref: "/contact", media: U("photo-1681717166573-f71589207785", 1920), mediaType: "image", heightVh: 70, align: "left" } },
    { type: "Section", props: { id: "s-sec", maxWidth: "wide", padY: 72, content: [
      { type: "Heading", props: { id: "s-h", text: "Everything, handled.", size: "lg", align: "center", gradient: true } },
      { type: "Spacer", props: { id: "s-sp", height: 28 } },
      { type: "FeatureCards", props: { id: "s-fc", items: [
        { title: "Design & Décor", body: "3D-rendered stages, florals, lighting design and bespoke installations." },
        { title: "Hospitality & Logistics", body: "Guest travel, room blocks, welcome hampers and on-ground concierge." },
        { title: "Entertainment", body: "Celebrity artists, live bands, choreographers and surprise acts." },
        { title: "Film & Photography", body: "Cinematic teams capturing every tear, laugh and firework." },
      ] } },
    ] } },
  ],
  zones: {},
};

const GALLERY: Data = {
  root: { props: {} },
  content: [
    { type: "Hero", props: { id: "g-hero", eyebrow: "Real Weddings", title: "Tap a story to step inside.", subtitle: "Photographs and films from the day itself.", ctaLabel: "Plan Your Wedding", ctaHref: "/contact", media: U("photo-1665960213508-48f07086d49c", 1920), mediaType: "image", heightVh: 70, align: "left" } },
    { type: "Section", props: { id: "g-sec", maxWidth: "wide", padY: 64, content: [
      { type: "Gallery", props: { id: "g-gal", columns: 3, images: [
        { src: U("photo-1727430256509-0f897d6f4765") }, { src: U("photo-1599462616558-2b75fd26a283") }, { src: U("photo-1744891471118-f74c0453cd21") },
        { src: U("photo-1611106211090-8f3c79eb8552") }, { src: U("photo-1587271407850-8d438ca9fdf2") }, { src: U("photo-1665960213508-48f07086d49c") },
      ] } },
    ] } },
  ],
  zones: {},
};

const CONTACT: Data = {
  root: { props: {} },
  content: [
    { type: "Hero", props: { id: "c-hero", eyebrow: "Let's Begin", title: "Your forever starts here.", subtitle: "Tell us your date. We'll bring the magic.", ctaLabel: "Send Enquiry", ctaHref: "#enquiry", media: U("photo-1722952934708-749c22eb2e58", 1920), mediaType: "image", heightVh: 64, align: "left" } },
    { type: "Section", props: { id: "c-sec", maxWidth: "narrow", padY: 64, content: [
      { type: "Heading", props: { id: "c-h", text: "Begin your story", size: "md", align: "left", gradient: false } },
      { type: "FormBlock", props: { id: "c-form", heading: "Plan your wedding", button: "Send Enquiry" } },
    ] } },
  ],
  zones: {},
};

export const STARTERS: Record<string, Data> = {
  home: HOME,
  about: ABOUT,
  services: SERVICES,
  gallery: GALLERY,
  contact: CONTACT,
};

/** Starter content for a page — Vibgyor content, or empty for pages without one. */
export function starterFor(slug: string): Data {
  return STARTERS[slug] ?? ({ content: [], root: {} } as Data);
}

// Back-compat default (home).
export const STARTER_DATA: Data = HOME;
