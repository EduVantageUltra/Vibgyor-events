export const GOOGLE_FONTS = [
  "Poppins", "Montserrat", "Playfair Display", "Bebas Neue", "Oswald", "Raleway",
  "Lora", "Roboto Slab", "Inter", "DM Sans", "Sora", "Archivo", "Syne", "Outfit",
  "Plus Jakarta Sans", "Anton", "Pacifico", "Caveat", "Dancing Script", "Righteous",
  "Abril Fatface", "Cinzel", "Josefin Sans", "Quicksand", "Comfortaa", "Teko",
];

export const SHADOWS: Record<string, string | undefined> = {
  none: undefined,
  soft: "0 8px 24px rgba(0,0,0,0.25)",
  medium: "0 16px 40px rgba(0,0,0,0.4)",
  strong: "0 24px 60px rgba(0,0,0,0.6)",
  glow: "0 0 40px rgba(124,92,255,0.6)",
};

/** Build a Google Fonts stylesheet href for the given font names. */
export function googleFontsHref(fonts: string[]): string | null {
  const uniq = [...new Set(fonts.filter(Boolean))];
  if (!uniq.length) return null;
  const fam = uniq.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;600;700;800`).join("&");
  return `https://fonts.googleapis.com/css2?${fam}&display=swap`;
}
