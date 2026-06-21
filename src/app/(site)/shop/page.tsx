import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/products";
import { ShopClient } from "@/components/commerce/ShopClient";
import { SectionHeading } from "@/components/sections/SectionHeading";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse smartphones, audio, charging, wearables and accessories.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-32">
      <SectionHeading
        eyebrow="The collection"
        title={<>Everything in <span className="text-aurora">store</span></>}
        description="Genuine, warrantied and in stock. Filter, search and add to bag — or order any item on WhatsApp."
        className="mb-12"
      />
      <ShopClient products={products} categories={categories} initialCategory={cat} />
    </div>
  );
}
