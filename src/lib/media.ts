/* =====================================================================
   VIBGYOR EVENTS — CENTRAL IMAGE MAP
   ---------------------------------------------------------------------
   👉 TO USE YOUR OWN REAL PHOTOS LATER (one place to change):
      Option A — drop files in  /public/media/  and set e.g.
                 couple1: "/media/our-wedding-hero.jpg",
      Option B — paste any image URL in place of the Unsplash one below.
   Everything on the site (galleries, heroes) reads from here.
   Current images are hand-picked Indian-wedding stock (interim).
   ===================================================================== */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const MEDIA = {
  // couples / hero
  couple1: u("photo-1722952934708-749c22eb2e58", 1920),
  coupleCanopy: u("photo-1727430256509-0f897d6f4765", 1920),
  traditionalCouple: u("photo-1665960213508-48f07086d49c", 1600),
  rings: u("photo-1774024872805-5a73cc24a721", 1200),
  ceremony: u("photo-1774024051976-7b5a15542a05", 1200),
  // mandap / decor / stage
  mandapStage: u("photo-1745573674206-1d4805fcc427", 1600),
  mandapEntrance: u("photo-1744891471118-f74c0453cd21", 1600),
  floralCeiling: u("photo-1587271407850-8d438ca9fdf2", 1600),
  floralUmbrella: u("photo-1587271636175-90d58cdad458", 1400),
  // brides
  brideSariSmile: u("photo-1551854716-8b811be39e7e", 1200),
  brideRed: u("photo-1599462616558-2b75fd26a283", 1200),
  brideGreen: u("photo-1611106211090-8f3c79eb8552", 1200),
  brideGold: u("photo-1610173827043-9db50e0d8ef9", 1200),
  // haldi / mehendi / details
  haldiTurmeric: u("photo-1681717166573-f71589207785", 1200),
  haldiSari: u("photo-1698460918119-7359a8a945a0", 1200),
  haldiGarland: u("photo-1681717075175-19feb7a6f664", 1200),
  mehendiHands: u("photo-1505932794465-147d1f1b2c97", 1200),
  bangles: u("photo-1621801306185-8c0ccf9c8eb8", 1200),
  sehra: u("photo-1597157639073-69284dc0fdaf", 1200),
};

// placeholder film — replace with your real wedding film URL or /media/film.mp4
export const SAMPLE_VIDEO = "https://cdn.coverr.co/videos/coverr-confetti-falling-1573/1080p.mp4";
