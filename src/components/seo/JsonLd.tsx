import { site } from "@/lib/site";

const BASE = "https://rajrishi.example.com";

/** Renders a JSON-LD <script> for structured data (rich results + GEO). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Store",
        name: site.name,
        description: site.description,
        url: BASE,
        telephone: site.phone,
        email: site.email,
        address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "IN" },
        openingHours: site.hours,
        sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: BASE,
        potentialAction: { "@type": "SearchAction", target: `${BASE}/shop?cat={search_term_string}`, "query-input": "required name=search_term_string" },
      }}
    />
  );
}
