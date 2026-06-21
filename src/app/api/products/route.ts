import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getProducts, writeProducts, type Product } from "@/lib/products";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProducts());
}

/** Create a product. */
export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const body = (await req.json()) as Partial<Product>;
  const products = getProducts();
  const name = body.name?.trim() || "New product";
  let slug = body.slug || slugify(name);
  if (products.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const product: Product = {
    id: body.id || `p-${Date.now().toString(36)}`,
    slug,
    name,
    brand: body.brand || "Brand",
    category: body.category || "Smartphones",
    price: Number(body.price) || 0,
    mrp: Number(body.mrp) || Number(body.price) || 0,
    rating: Number(body.rating) || 4.5,
    reviews: Number(body.reviews) || 0,
    image: body.image || "/products/phone-aurora.jpg",
    colors: body.colors?.length ? body.colors : ["Default"],
    badges: body.badges || [],
    stock: Number(body.stock) || 0,
    featured: !!body.featured,
    highlights: body.highlights?.length ? body.highlights : [],
    description: body.description || "",
    specs: body.specs || {},
  };
  writeProducts([...products, product]);
  return NextResponse.json(product);
}

/** Update a product by id. */
export async function PUT(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const body = (await req.json()) as Product;
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "not_found" }, { status: 404 });
  products[idx] = { ...products[idx], ...body, price: Number(body.price), mrp: Number(body.mrp), stock: Number(body.stock) };
  writeProducts(products);
  return NextResponse.json(products[idx]);
}

/** Delete a product by id. */
export async function DELETE(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const { id } = (await req.json()) as { id: string };
  const products = getProducts();
  if (!products.some((p) => p.id === id)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  writeProducts(products.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
