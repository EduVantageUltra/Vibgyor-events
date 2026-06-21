VIBGYOR EVENTS — YOUR REAL PHOTOS & VIDEOS GO HERE
===================================================

When you have your real wedding photos / films, this is the easy way to use them:

1) Drop your files in THIS folder (public/media/), e.g.
      our-hero.jpg
      mandap.jpg
      haldi.jpg
      film-udaipur.mp4

2) Open  src/lib/media.ts  and replace the Unsplash URL with your file path:
      couple1: "/media/our-hero.jpg",
      mandapStage: "/media/mandap.jpg",
   And for films, in src/lib/media.ts:
      export const SAMPLE_VIDEO = "/media/film-udaipur.mp4";

That's it — every gallery, hero and card across the whole site updates automatically,
because everything reads from that one file.

For the PAGE images (home hero, section images) you can ALSO just swap them visually
in the editor at  /editor  — open a page, click the image block, and upload your photo.

Tip: keep photos ~1600px wide and JPG/WebP for fast loading. Films as MP4 (H.264).
