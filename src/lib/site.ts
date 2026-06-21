/**
 * Central business details. Edit these (or do it from the visual canvas /editor)
 * — every page reads from here, so one change updates the whole site.
 */
export const site = {
  name: "Vibgyor Events",
  shortName: "Vibgyor",
  tagline: "We don't plan weddings. We craft forever.",
  description:
    "India's luxury wedding & celebration designers — 20+ years crafting unforgettable Indian weddings across palaces, beaches and backwaters.",
  // Contact — replace with your real details
  phone: "+91 98000 00000",
  whatsapp: "919800000000", // digits only, country code first (no +)
  email: "hello@vibgyorevents.com",
  address: "3rd Floor, Celebration House, MG Road, Bengaluru 560001, India",
  hours: "Mon–Sun · 10:00 AM – 8:00 PM",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  // Not a shop — kept for type compatibility
  freeShippingOver: 0,
} as const;

export type Site = typeof site;
