/**
 * Ready-made page templates (Puck block compositions). Applying one publishes
 * its blocks to the current page. Built only from existing, tested blocks.
 */
export type PageTemplate = { id: string; name: string; desc: string; data: { root: { props: object }; content: unknown[]; zones: object } };

const sec = (id: string, content: unknown[], extra: Record<string, unknown> = {}) => ({
  type: "Section",
  props: { id, maxWidth: "wide", maxWidthPx: 0, padY: 72, minHeightVh: 0, bg: "none", textColor: "none", content, ...extra },
});
const heading = (id: string, text: string, opts: Record<string, unknown> = {}) => ({ type: "Heading", props: { id, text, size: "lg", align: "left", gradient: true, color: "none", ...opts } });
const text = (id: string, t: string, opts: Record<string, unknown> = {}) => ({ type: "Text", props: { id, text: t, align: "left", size: "lg", muted: true, color: "none", ...opts } });
const spacer = (id: string, h = 28) => ({ type: "Spacer", props: { id, height: h } });
const productGrid = (id: string, title = "", count = 8, onlyFeatured = true, category = "All") => ({ type: "ProductGrid", props: { id, title, category, onlyFeatured, count } });
const cta = (id: string, title = "Ready to upgrade?", subtitle = "Browse online or order on WhatsApp.", ctaLabel = "Start shopping", ctaHref = "/shop") => ({ type: "CTASection", props: { id, title, subtitle, ctaLabel, ctaHref } });
const marquee = (id: string, t = "Smartphones · Audio · Charging · Wearables · Cases · Accessories") => ({ type: "MarqueeBlock", props: { id, text: t } });
const features = (id: string) => ({ type: "FeatureCards", props: { id, items: [{ title: "Genuine warranty", body: "Brand-authorised, sealed & warrantied." }, { title: "Fast delivery", body: "Same-day in the city, 24–48h nationwide." }, { title: "Easy EMI", body: "No-cost EMI on most smartphones." }] } });
const heroImg = (id: string, title: string, subtitle: string, media: string, heightVh = 90) => ({ type: "Hero", props: { id, eyebrow: "New", title, subtitle, ctaLabel: "Shop now", ctaHref: "/shop", media, mediaType: "image", heightVh, align: "left" } });
const slider = (id: string) => ({ type: "SliderBlock", props: { id, slides: [{ mediaType: "image", src: "/products/phone-aurora.jpg", caption: "The Aurora 15 Pro", link: "/product/aurora-15-pro" }, { mediaType: "image", src: "/products/earbuds-1.jpg", caption: "Hear every detail", link: "/shop?cat=Audio" }, { mediaType: "image", src: "/products/watch-1.jpg", caption: "Smartwatches that keep up", link: "/shop?cat=Wearables" }], autoplay: true, interval: 5, heightVh: 88, radius: 0 } });

const doc = (content: unknown[]) => ({ root: { props: {} }, content, zones: {} });

// extra block helpers
let _i = 0;
const uid = (p: string) => `${p}-${_i++}`;
const stats = () => ({ type: "StatsCounter", props: { id: uid("st"), items: [{ value: 12, suffix: "+", label: "Years" }, { value: 48000, suffix: "+", label: "Customers" }, { value: 300, suffix: "+", label: "Products" }, { value: 24, suffix: "h", label: "Delivery" }] } });
const bento = () => ({ type: "BentoGrid", props: { id: uid("bn"), items: [{ title: "Flagship phones", body: "Latest & greatest", big: true, image: "/products/phone-ultra.jpg" }, { title: "Audio", body: "", big: false, image: "/products/headphones-1.jpg" }, { title: "Wearables", body: "", big: false, image: "/products/watch-1.jpg" }, { title: "Charging", body: "", big: false, image: "/products/charger-1.jpg" }, { title: "Cases", body: "", big: false, image: "/products/case-1.jpg" }] } });
const logos = () => ({ type: "LogoMarquee", props: { id: uid("lg"), text: "Aurora, Noir, Mint, Ultra, Sonic, Volt, Pulse, Boom, Shield" } });
const blogList = () => ({ type: "BlogList", props: { id: uid("bl"), title: "From the blog", count: 3 } });
const three = (shape = "torusKnot") => ({ type: "ThreeShape", props: { id: uid("3d"), shape, color: "#7c5cff", metalness: 0.6, autoRotate: true, height: 360 } });
const webgl = (h = "Immersive") => ({ type: "WebGLBackground", props: { id: uid("wg"), heading: h, subheading: "Built for you", color: "#7c5cff", count: 900, height: 460 } });
const compare = () => ({ type: "ImageCompare", props: { id: uid("cmp"), before: "/products/phone-noir.jpg", after: "/products/phone-ultra.jpg", height: 420 } });
const pricing = () => ({ type: "Pricing", props: { id: uid("pr"), plans: [{ name: "Basic", price: "₹0", period: "", features: "In-store pickup\n7-day returns", featured: false, ctaLabel: "Start", ctaHref: "/shop" }, { name: "Plus", price: "₹499", period: "/yr", features: "Free delivery\nPriority support\nExtended warranty", featured: true, ctaLabel: "Go Plus", ctaHref: "/shop" }, { name: "Pro", price: "₹999", period: "/yr", features: "Everything in Plus\nFree screen guard\nAnnual service", featured: false, ctaLabel: "Go Pro", ctaHref: "/shop" }] } });
const faq = () => ({ type: "FaqWidget", props: { id: uid("fq"), items: [{ q: "Are products genuine?", a: "Yes, all brand-authorised with warranty." }, { q: "How fast is delivery?", a: "Same-day in the city." }, { q: "Do you offer EMI?", a: "Yes, no-cost EMI on most phones." }] } });
const gallery = () => ({ type: "Gallery", props: { id: uid("gl"), columns: 3, images: [{ src: "/products/phone-aurora.jpg" }, { src: "/products/phone-ultra.jpg" }, { src: "/products/earbuds-1.jpg" }, { src: "/products/watch-1.jpg" }, { src: "/products/headphones-1.jpg" }, { src: "/products/speaker-1.jpg" }] } });

export const TEMPLATES: PageTemplate[] = [
  {
    id: "shop-home",
    name: "Shop Home",
    desc: "Slider hero + featured products + features + CTA",
    data: doc([
      slider("t1-hero"),
      marquee("t1-mq"),
      sec("t1-s1", [heading("t1-h1", "Trending right now"), spacer("t1-sp1"), productGrid("t1-pg", "", 8)]),
      sec("t1-s2", [heading("t1-h2", "Why shop with us", { align: "center" }), spacer("t1-sp2"), features("t1-f")]),
      sec("t1-s3", [cta("t1-cta")], { padY: 48 }),
    ]),
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean single-image hero, lots of whitespace",
    data: doc([
      heroImg("t2-hero", "Beautifully simple", "Premium phones & accessories, curated.", "/products/phone-noir.jpg", 80),
      sec("t2-s1", [heading("t2-h", "Handpicked for you", { gradient: false }), spacer("t2-sp"), productGrid("t2-pg", "", 4)]),
      sec("t2-s2", [cta("t2-cta", "See the full range", "Everything in store, ready to ship.", "Browse shop", "/shop")], { padY: 56 }),
    ]),
  },
  {
    id: "bold-agency",
    name: "Bold Agency",
    desc: "Big hero, marquee, features & pricing",
    data: doc([
      heroImg("t3-hero", "Upgrade everything", "Flagship tech with a flawless experience.", "/products/phone-pro.jpg", 95),
      marquee("t3-mq"),
      sec("t3-s1", [heading("t3-h", "Built for you", { align: "center" }), spacer("t3-sp"), features("t3-f")]),
      sec("t3-s2", [heading("t3-h2", "Membership", { align: "center" }), spacer("t3-sp2"), { type: "Pricing", props: { id: "t3-pr", plans: [{ name: "Basic", price: "₹0", period: "", features: "In-store pickup\n7-day returns", featured: false, ctaLabel: "Start", ctaHref: "/shop" }, { name: "Plus", price: "₹499", period: "/yr", features: "Free delivery\nPriority support\nExtended warranty", featured: true, ctaLabel: "Go Plus", ctaHref: "/shop" }, { name: "Pro", price: "₹999", period: "/yr", features: "Everything in Plus\nFree screen guard\nAnnual service", featured: false, ctaLabel: "Go Pro", ctaHref: "/shop" }] } }]),
      sec("t3-s3", [cta("t3-cta")], { padY: 48 }),
    ]),
  },
  {
    id: "launch",
    name: "Product Launch",
    desc: "Hero + countdown + gallery + CTA",
    data: doc([
      heroImg("t4-hero", "Launching soon", "Be the first to grab it.", "/products/phone-ultra.jpg", 85),
      sec("t4-s1", [{ type: "Countdown", props: { id: "t4-cd", label: "Sale ends in", target: "2026-12-31 23:59" } }], { padY: 56 }),
      sec("t4-s2", [heading("t4-h", "Gallery", { align: "center" }), spacer("t4-sp"), { type: "Gallery", props: { id: "t4-g", columns: 3, images: [{ src: "/products/phone-aurora.jpg" }, { src: "/products/phone-ultra.jpg" }, { src: "/products/earbuds-1.jpg" }, { src: "/products/watch-1.jpg" }, { src: "/products/headphones-1.jpg" }, { src: "/products/speaker-1.jpg" }] } }]),
      sec("t4-s3", [cta("t4-cta", "Pre-book now", "Limited units. Reserve yours.", "Reserve", "/shop")], { padY: 48 }),
    ]),
  },
  {
    id: "contact",
    name: "Contact / Lead",
    desc: "Hero + form + map",
    data: doc([
      heroImg("t5-hero", "Let's talk", "Questions about a product or order? Reach us.", "/products/headphones-1.jpg", 60),
      sec("t5-s1", [{ type: "FormBlock", props: { id: "t5-form", heading: "Send us a message", button: "Send on WhatsApp" } }]),
      sec("t5-s2", [{ type: "MapEmbed", props: { id: "t5-map", query: "Connaught Place, Delhi", height: 360 } }], { padY: 0 }),
    ]),
  },
  { id: "bento-home", name: "Bento Home", desc: "Bento grid + stats + products", data: doc([heroImg(uid("h"), "Everything in one place", "Phones, audio, wearables & more.", "/products/phone-aurora.jpg", 80), sec(uid("s"), [bento()]), sec(uid("s"), [stats()]), sec(uid("s"), [heading(uid("h"), "Trending"), spacer(uid("sp")), productGrid(uid("pg"), "", 8)]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "3d-showcase", name: "3D Showcase", desc: "WebGL hero + 3D shape + products", data: doc([sec(uid("s"), [webgl("The future of tech")], { padY: 0 }), sec(uid("s"), [three("torusKnot")]), sec(uid("s"), [heading(uid("h"), "Featured", { align: "center" }), spacer(uid("sp")), productGrid(uid("pg"), "", 4)]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "blog-home", name: "Blog Home", desc: "Hero + latest posts + newsletter", data: doc([heroImg(uid("h"), "Stories & guides", "Helpful reads from the store.", "/products/headphones-1.jpg", 70), sec(uid("s"), [blogList()]), sec(uid("s"), [cta(uid("c"), "Visit the shop", "Find your next device.", "Shop now", "/shop")], { padY: 48 })]) },
  { id: "luxury", name: "Dark Luxury", desc: "Editorial hero + gallery + pricing", data: doc([heroImg(uid("h"), "Crafted to impress", "Premium devices, premium service.", "/products/phone-pro.jpg", 92), logos(), sec(uid("s"), [heading(uid("h"), "The collection", { align: "center", gradient: false }), spacer(uid("sp")), gallery()]), sec(uid("s"), [heading(uid("h"), "Care plans", { align: "center" }), spacer(uid("sp")), pricing()]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "fashion", name: "Fashion / Lookbook", desc: "Big visuals + bento + compare", data: doc([slider(uid("sl")), sec(uid("s"), [bento()]), sec(uid("s"), [heading(uid("h"), "See the difference", { align: "center" }), spacer(uid("sp")), compare()]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "saas", name: "Gradient SaaS", desc: "WebGL hero + features + pricing + FAQ", data: doc([sec(uid("s"), [webgl("Tech that just works")], { padY: 0 }), sec(uid("s"), [heading(uid("h"), "Why us", { align: "center" }), spacer(uid("sp")), features(uid("f"))]), sec(uid("s"), [heading(uid("h"), "Plans", { align: "center" }), spacer(uid("sp")), pricing()]), sec(uid("s"), [heading(uid("h"), "FAQ", { align: "center" }), spacer(uid("sp")), faq()]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "services", name: "Services / Repairs", desc: "Hero + features + stats + form", data: doc([heroImg(uid("h"), "Repairs & support", "Fast, genuine, guaranteed.", "/products/charger-1.jpg", 70), sec(uid("s"), [features(uid("f"))]), sec(uid("s"), [stats()]), sec(uid("s"), [{ type: "FormBlock", props: { id: uid("fm"), heading: "Book a repair", button: "Send on WhatsApp" } }])]) },
  { id: "event", name: "Event / Launch", desc: "Hero + countdown + gallery + CTA", data: doc([heroImg(uid("h"), "Grand opening sale", "Three days only.", "/products/phone-ultra.jpg", 88), sec(uid("s"), [{ type: "Countdown", props: { id: uid("cd"), label: "Starts in", target: "2026-12-31 23:59" } }], { padY: 56 }), sec(uid("s"), [gallery()]), sec(uid("s"), [cta(uid("c"), "Get notified", "Be first in line.", "Notify me", "/contact")], { padY: 48 })]) },
  { id: "app-landing", name: "App Landing", desc: "Hero + 3D + features + stats", data: doc([heroImg(uid("h"), "Your store, in your pocket", "Download & shop on the go.", "/products/phone-noir.jpg", 86), sec(uid("s"), [three("dodecahedron")]), sec(uid("s"), [features(uid("f"))]), sec(uid("s"), [stats()]), sec(uid("s"), [cta(uid("c"), "Download now", "Available everywhere.", "Get the app", "/shop")], { padY: 48 })]) },
  { id: "testimonial", name: "Trust & Reviews", desc: "Hero + stats + tabs + CTA", data: doc([heroImg(uid("h"), "Loved by the city", "Thousands of happy customers.", "/products/watch-1.jpg", 70), sec(uid("s"), [stats()]), sec(uid("s"), [heading(uid("h"), "What people ask", { align: "center" }), spacer(uid("sp")), faq()]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "category", name: "Category Showcase", desc: "Hero + bento + product rows", data: doc([heroImg(uid("h"), "Shop by category", "Find exactly what you need.", "/products/headphones-1.jpg", 70), sec(uid("s"), [bento()]), sec(uid("s"), [heading(uid("h"), "Smartphones"), spacer(uid("sp")), productGrid(uid("pg"), "", 4, false, "Smartphones")]), sec(uid("s"), [heading(uid("h"), "Audio"), spacer(uid("sp")), productGrid(uid("pg"), "", 4, false, "Audio")])]) },
  { id: "gradient-bold", name: "Bold Gradient", desc: "Marquee + huge type + products", data: doc([heroImg(uid("h"), "BIG SAVINGS", "Up to 40% off this week.", "/products/phone-pro.jpg", 95), logos(), sec(uid("s"), [heading(uid("h"), "Deals of the day", { align: "center" }), spacer(uid("sp")), productGrid(uid("pg"), "", 8)]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "compare-page", name: "Compare & Buy", desc: "Before/after + products + FAQ", data: doc([heroImg(uid("h"), "See it to believe it", "Compare before you buy.", "/products/phone-ultra.jpg", 70), sec(uid("s"), [compare()]), sec(uid("s"), [heading(uid("h"), "Top picks", { align: "center" }), spacer(uid("sp")), productGrid(uid("pg"), "", 4)]), sec(uid("s"), [faq()])]) },
  { id: "story", name: "Brand Story", desc: "Hero + text + stats + gallery", data: doc([heroImg(uid("h"), "Twelve years strong", "The story behind the store.", "/products/phone-pro.jpg", 80), sec(uid("s"), [heading(uid("h"), "Our journey"), spacer(uid("sp")), text(uid("t"), "We started as a small counter on the main road. Today we're the city's go-to for everything tech — online and off.")]), sec(uid("s"), [stats()]), sec(uid("s"), [gallery()]), sec(uid("s"), [cta(uid("c"))], { padY: 48 })]) },
  { id: "newsletter", name: "Lead Capture", desc: "WebGL + form + features", data: doc([sec(uid("s"), [webgl("Join the club")], { padY: 0 }), sec(uid("s"), [{ type: "FormBlock", props: { id: uid("fm"), heading: "Get exclusive deals", button: "Join on WhatsApp" } }]), sec(uid("s"), [features(uid("f"))])]) },
];
