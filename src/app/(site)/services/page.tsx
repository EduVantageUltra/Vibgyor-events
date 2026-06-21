import Services from "@/components/vibgyor/pages/Services";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("services", {
    title: "The Experiences — Vibgyor Events | Every Ritual, Reimagined",
    description: "Pre-wedding, Haldi, Mehendi, Sangeet, the Wedding, Reception and Destination — every Indian ceremony designed by Vibgyor Events.",
  });
}

export default function ServicesPage() {
  return renderEditable("services", () => <Services />);
}
