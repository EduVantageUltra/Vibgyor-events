// Vibgyor Events — gallery + testimonial data
// Replace image/video URLs with your REAL Indian wedding footage later.

export type Media = { type: "image" | "video"; src: string; poster?: string };
export type Event = {
  id: string;
  title: string;
  meta: string;
  cover: string;
  intro: string;
  media: Media[];
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;
// placeholder film — swap with real wedding films
const VID = "https://cdn.coverr.co/videos/coverr-confetti-falling-1573/1080p.mp4";

export const TESTIMONIALS: [string, string, string][] = [
  ["“We didn’t realise how much we’d be able to simply enjoy our own wedding. Vibgyor didn’t just plan it — they felt it with us.”", "Meera & Aarav", "Udaipur Wedding, 2025"],
  ["“Three functions, four hundred guests, two cities — and not one moment of stress reached us. That is their real magic.”", "Diya & Rohan", "Jaipur Wedding, 2024"],
  ["“Every single guest told us it was the most beautiful Indian wedding they had ever attended. Every single one.”", "Sara & Vikram", "Kerala Wedding, 2025"],
];

export const EVENTS: Record<string, Event> = {
  udaipur: {
    id: "udaipur",
    title: "Meera & Aarav",
    meta: "City Palace · Udaipur · 2025",
    cover: U("photo-1604017011826-d3b4c23f8914", 1600),
    intro: "A three-day royal celebration on the ghats of Lake Pichola — floating mandap, palace baraat and a sangeet under a thousand lanterns.",
    media: [
      { type: "image", src: U("photo-1604017011826-d3b4c23f8914") },
      { type: "video", src: VID, poster: U("photo-1583939003579-730e3918a45a") },
      { type: "image", src: U("photo-1606800052052-a08af7148866") },
      { type: "image", src: U("photo-1610047569524-29104abe2e2c") },
      { type: "image", src: U("photo-1595407753234-0882f1e77954") },
      { type: "video", src: VID, poster: U("photo-1519225421980-715cb0215aed") },
      { type: "image", src: U("photo-1532712938310-34cb3982ef74") },
      { type: "image", src: U("photo-1546032996-6dfacbacbf3f") },
    ],
  },
  jaipur: {
    id: "jaipur",
    title: "Diya & Rohan",
    meta: "Rambagh Palace · Jaipur · 2024",
    cover: U("photo-1583939411023-14783179e581", 1600),
    intro: "Pink-city heritage meets emerald grandeur — an elephant baraat, a haldi drenched in marigold, and a reception fit for royalty.",
    media: [
      { type: "image", src: U("photo-1583939411023-14783179e581") },
      { type: "image", src: U("photo-1599458448510-59aecaea4752") },
      { type: "video", src: VID, poster: U("photo-1604017011826-d3b4c23f8914") },
      { type: "image", src: U("photo-1610047569524-29104abe2e2c") },
      { type: "image", src: U("photo-1583939003579-730e3918a45a") },
      { type: "image", src: U("photo-1595407753234-0882f1e77954") },
      { type: "video", src: VID, poster: U("photo-1606800052052-a08af7148866") },
    ],
  },
  goa: {
    id: "goa",
    title: "Anaya & Kabir",
    meta: "Beachfront Resort · Goa · 2025",
    cover: U("photo-1519225421980-715cb0215aed", 1600),
    intro: "Barefoot vows at golden hour, a sundowner sangeet on the sand, and fireworks over the Arabian Sea.",
    media: [
      { type: "image", src: U("photo-1519225421980-715cb0215aed") },
      { type: "image", src: U("photo-1465495976277-4387d4b0b4c6") },
      { type: "video", src: VID, poster: U("photo-1511285560929-80b456fea0bc") },
      { type: "image", src: U("photo-1532712938310-34cb3982ef74") },
      { type: "image", src: U("photo-1583939003579-730e3918a45a") },
      { type: "image", src: U("photo-1546032996-6dfacbacbf3f") },
    ],
  },
  kerala: {
    id: "kerala",
    title: "Sara & Vikram",
    meta: "Backwaters · Kerala · 2025",
    cover: U("photo-1610047569524-29104abe2e2c", 1600),
    intro: "A serene South-Indian celebration among the palms — traditional rituals, houseboat baraat and banana-leaf feasts.",
    media: [
      { type: "image", src: U("photo-1610047569524-29104abe2e2c") },
      { type: "image", src: U("photo-1599458448510-59aecaea4752") },
      { type: "image", src: U("photo-1606800052052-a08af7148866") },
      { type: "video", src: VID, poster: U("photo-1583939411023-14783179e581") },
      { type: "image", src: U("photo-1595407753234-0882f1e77954") },
      { type: "image", src: U("photo-1604017011826-d3b4c23f8914") },
    ],
  },
  mumbai: {
    id: "mumbai",
    title: "Nisha & Ishaan",
    meta: "Grand Reception · Mumbai · 2024",
    cover: U("photo-1599458448510-59aecaea4752", 1600),
    intro: "A glittering city reception — black-tie glamour, a live orchestra and a couple entrance no guest will ever forget.",
    media: [
      { type: "image", src: U("photo-1599458448510-59aecaea4752") },
      { type: "video", src: VID, poster: U("photo-1532712938310-34cb3982ef74") },
      { type: "image", src: U("photo-1465495976277-4387d4b0b4c6") },
      { type: "image", src: U("photo-1546032996-6dfacbacbf3f") },
      { type: "image", src: U("photo-1519225421980-715cb0215aed") },
      { type: "image", src: U("photo-1583939003579-730e3918a45a") },
    ],
  },
  agra: {
    id: "agra",
    title: "Tara & Arjun",
    meta: "Heritage Haveli · Agra · 2025",
    cover: U("photo-1511285560929-80b456fea0bc", 1600),
    intro: "Old-world romance in the shadow of monuments — a candlelit mehendi, qawwali nights and a mandap of fresh roses.",
    media: [
      { type: "image", src: U("photo-1511285560929-80b456fea0bc") },
      { type: "image", src: U("photo-1606800052052-a08af7148866") },
      { type: "video", src: VID, poster: U("photo-1610047569524-29104abe2e2c") },
      { type: "image", src: U("photo-1595407753234-0882f1e77954") },
      { type: "image", src: U("photo-1604017011826-d3b4c23f8914") },
      { type: "image", src: U("photo-1583939411023-14783179e581") },
    ],
  },
};

export const EVENT_LIST = Object.values(EVENTS);
