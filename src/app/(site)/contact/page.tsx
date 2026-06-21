import Contact from "@/components/vibgyor/pages/Contact";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("contact", {
    title: "Contact — Vibgyor Events | Begin Your Story",
    description: "Tell us your date and we'll bring the magic. Enquire with Vibgyor Events — luxury Indian wedding designers.",
  });
}

export default function ContactPage() {
  return renderEditable("contact", () => <Contact />);
}
