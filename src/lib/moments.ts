// Vibgyor Events — "Moments" film gallery.
// Real client footage, web-encoded into /public/media/moments (m01.mp4 + m01.jpg poster).
// To add a clip: drop the mp4 + a poster jpg in that folder and add a row below.

export const MOMENT_CATS = [
  "Mandap & Stage",
  "Sangeet",
  "Mehendi & Haldi",
  "Entrances",
  "Reception",
  "Florals & Details",
] as const;

export type MomentCat = (typeof MOMENT_CATS)[number];

export type Moment = {
  id: string;
  cat: MomentCat;
  title: string;
  note: string;
};

const M = (id: string, cat: MomentCat, title: string, note: string): Moment => ({ id, cat, title, note });

export const MOMENTS: Moment[] = [
  M("m03", "Mandap & Stage", "Fireworks Over the Mandap", "Floral aisle · night ceremony"),
  M("m02", "Sangeet", "White Florals & Crystal", "Sangeet aisle"),
  M("m11", "Entrances", "Step Into the Spotlight", "House of Prasang"),
  M("m26", "Mehendi & Haldi", "Marigold Terrace", "Open-air haldi lounge"),
  M("m01", "Reception", "Fairy-Light Ballroom", "Grand reception hall"),
  M("m07", "Florals & Details", "The Red Rose Tower", "Floral installation"),

  M("m04", "Mandap & Stage", "Brighter Than the Sky", "Mirror walkway · fireworks"),
  M("m06", "Sangeet", "Sangeet, Take One", "Cinema-themed sangeet"),
  M("m13", "Entrances", "The Carnival Walkway", "Raipur"),
  M("m14", "Mehendi & Haldi", "The Mehendi Welcome", "Welcome signage & florals"),
  M("m08", "Reception", "The Long Table", "Banquet reception"),
  M("m09", "Florals & Details", "Candles & Foliage", "Green lounge wall"),

  M("m10", "Mandap & Stage", "The Pink Palace Stage", "Ornate stage build"),
  M("m12", "Sangeet", "Shiv & Parvati", "Sangeet performance"),
  M("m25", "Entrances", "The LED Waterfall", "Illuminated entry"),
  M("m15", "Mehendi & Haldi", "Leheriya Chowk", "Mehendi lounge"),
  M("m19", "Reception", "After Dark", "Open-air reception"),
  M("m16", "Florals & Details", "Ek Yaadon Ka Jashn", "Pastel floral lounge"),

  M("m20", "Mandap & Stage", "Crimson Canopy", "Draped ceiling"),
  M("m29", "Sangeet", "LED Waterfall & Grand Stage", "Sangeet night"),
  M("m27", "Entrances", "The Blue Light Tunnel", "Guest walkway"),
  M("m17", "Mehendi & Haldi", "The Hot Air Balloon", "Daytime function décor"),
  M("m18", "Florals & Details", "Gerbera & Blush", "Seating detail"),

  M("m21", "Mandap & Stage", "Red & Black Chandelier", "Stage design"),
  M("m05", "Sangeet", "The Sangeet Aisle", "Crystal chandeliers"),
  M("m22", "Entrances", "The Crimson Entrance", "Niksa Banquet"),
  M("m23", "Florals & Details", "The Black Chandelier", "Ceiling detail"),

  M("m28", "Mandap & Stage", "Gold Shimmer Stage", "Arqosi"),
  M("m30", "Entrances", "The Lavender Welcome", "Entry facade"),
];

export const momentVideo = (id: string) => `/media/moments/${id}.mp4`;
export const momentPoster = (id: string) => `/media/moments/${id}.jpg`;
