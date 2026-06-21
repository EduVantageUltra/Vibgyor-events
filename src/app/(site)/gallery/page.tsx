import Gallery from "@/components/vibgyor/pages/Gallery";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("gallery", {
    title: "Weddings — Vibgyor Events | Real Celebrations, Real Stories",
    description: "Step inside real Indian weddings designed by Vibgyor Events. Tap any story to view its gallery of photos and films.",
  });
}

export default function GalleryPage() {
  return renderEditable("gallery", () => <Gallery />);
}
