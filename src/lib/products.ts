import fs from "node:fs";
import path from "node:path";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  badges: string[];
  stock: number;
  featured: boolean;
  highlights: string[];
  description: string;
  specs: Record<string, string>;
};

const DATA_FILE = path.join(process.cwd(), "src", "data", "products.json");

/** Read fresh from disk every call so visual-editor writes show up without a rebuild. */
export function getProducts(): Product[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(getProducts().map((p) => p.category)));
}

export function getFeatured(): Product[] {
  return getProducts().filter((p) => p.featured);
}

export function getRelated(product: Product, count = 4): Product[] {
  return getProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count);
}

export function discountPct(p: Pick<Product, "price" | "mrp">): number {
  if (!p.mrp || p.mrp <= p.price) return 0;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function writeProducts(products: Product[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}
