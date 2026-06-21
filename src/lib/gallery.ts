// Vibgyor Events — gallery + testimonial data
// Images come from the central map in ./media (swap to real footage there).

import { MEDIA as M, SAMPLE_VIDEO as VID } from "./media";

export type Media = { type: "image" | "video"; src: string; poster?: string };
export type Event = {
  id: string;
  title: string;
  meta: string;
  cover: string;
  intro: string;
  media: Media[];
};

export const TESTIMONIALS: [string, string, string][] = [
  ["“We didn’t realise how much we’d be able to simply enjoy our own wedding. Vibgyor didn’t just plan it — they felt it with us.”", "Meera & Aarav", "Udaipur Wedding, 2025"],
  ["“Three functions, four hundred guests, two cities — and not one moment of stress reached us. That is their real magic.”", "Diya & Rohan", "Jaipur Wedding, 2024"],
  ["“Every single guest told us it was the most beautiful Indian wedding they had ever attended. Every single one.”", "Sara & Vikram", "Kerala Wedding, 2025"],
];

const img = (src: string): Media => ({ type: "image", src });
const vid = (poster: string): Media => ({ type: "video", src: VID, poster });

export const EVENTS: Record<string, Event> = {
  udaipur: {
    id: "udaipur",
    title: "Meera & Aarav",
    meta: "City Palace · Udaipur · 2025",
    cover: M.coupleCanopy,
    intro: "A three-day royal celebration on the ghats of Lake Pichola — floating mandap, palace baraat and a sangeet under a thousand lanterns.",
    media: [img(M.coupleCanopy), vid(M.mandapStage), img(M.mandapStage), img(M.brideSariSmile), img(M.ceremony), vid(M.floralCeiling), img(M.rings), img(M.bangles)],
  },
  jaipur: {
    id: "jaipur",
    title: "Diya & Rohan",
    meta: "Rambagh Palace · Jaipur · 2024",
    cover: M.brideRed,
    intro: "Pink-city heritage meets emerald grandeur — an elephant baraat, a haldi drenched in marigold, and a reception fit for royalty.",
    media: [img(M.brideRed), img(M.mandapEntrance), vid(M.ceremony), img(M.traditionalCouple), img(M.haldiTurmeric), img(M.brideGold), vid(M.floralUmbrella)],
  },
  goa: {
    id: "goa",
    title: "Anaya & Kabir",
    meta: "Beachfront Resort · Goa · 2025",
    cover: M.couple1,
    intro: "Barefoot vows at golden hour, a sundowner sangeet on the sand, and fireworks over the Arabian Sea.",
    media: [img(M.couple1), img(M.coupleCanopy), vid(M.rings), img(M.floralCeiling), img(M.brideGreen), img(M.mehendiHands)],
  },
  kerala: {
    id: "kerala",
    title: "Sara & Vikram",
    meta: "Backwaters · Kerala · 2025",
    cover: M.brideGreen,
    intro: "A serene South-Indian celebration among the palms — traditional rituals, houseboat baraat and banana-leaf feasts.",
    media: [img(M.brideGreen), img(M.haldiSari), img(M.mandapStage), vid(M.ceremony), img(M.haldiGarland), img(M.traditionalCouple)],
  },
  mumbai: {
    id: "mumbai",
    title: "Nisha & Ishaan",
    meta: "Grand Reception · Mumbai · 2024",
    cover: M.floralCeiling,
    intro: "A glittering city reception — black-tie glamour, a live orchestra and a couple entrance no guest will ever forget.",
    media: [img(M.floralCeiling), vid(M.mandapStage), img(M.rings), img(M.bangles), img(M.brideRed), img(M.sehra)],
  },
  agra: {
    id: "agra",
    title: "Tara & Arjun",
    meta: "Heritage Haveli · Agra · 2025",
    cover: M.traditionalCouple,
    intro: "Old-world romance in the shadow of monuments — a candlelit mehendi, qawwali nights and a mandap of fresh roses.",
    media: [img(M.traditionalCouple), img(M.mehendiHands), vid(M.coupleCanopy), img(M.brideSariSmile), img(M.mandapEntrance), img(M.brideGold)],
  },
};

export const EVENT_LIST = Object.values(EVENTS);
