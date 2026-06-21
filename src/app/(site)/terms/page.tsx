import Terms from "@/components/vibgyor/pages/Terms";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("terms", { title: "Terms & Conditions — Vibgyor Events", description: "Terms & Conditions for engaging Vibgyor Events wedding planning services." });
}

export default function TermsPage() {
  return renderEditable("terms", () => <Terms />);
}
