import Home from "@/components/vibgyor/pages/Home";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("home", {
    title: "Vibgyor Events — We Craft Forever | Luxury Indian Wedding Designers",
    description: "Vibgyor Events — India's luxury wedding & celebration designers. 20+ years crafting unforgettable Indian weddings.",
  });
}

export default function HomePage() {
  return renderEditable("home", () => <Home />);
}
