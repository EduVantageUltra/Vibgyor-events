import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, getProducts, getRelated } from "@/lib/products";
import { ProductDetail } from "@/components/commerce/ProductDetail";
import { ProductReviews } from "@/components/commerce/ProductReviews";
import { ProductCard } from "@/components/commerce/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(product);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: `https://rajrishi.example.com${product.image}`,
          description: product.description,
          brand: { "@type": "Brand", name: product.brand },
          sku: product.id,
          offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `https://rajrishi.example.com/product/${product.slug}` },
          aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
        }}
      />
      <nav className="mb-8 flex items-center gap-1 text-xs text-fog-dim">
        <Link href="/" className="hover:text-fog">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-fog">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} className="hover:text-fog">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-fog">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-24">
          <SectionHeading
            eyebrow="You may also like"
            title={<>More in <span className="text-aurora">{product.category}</span></>}
            className="mb-10"
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
