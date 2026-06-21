import About from "@/components/vibgyor/pages/About";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("about", {
    title: "The Studio — Vibgyor Events | 20+ Years of Indian Weddings",
    description: "Two decades designing India's most cherished weddings. Meet the studio behind Vibgyor Events.",
  });
}

export default function AboutPage() {
  return renderEditable("about", () => <About />);
}
