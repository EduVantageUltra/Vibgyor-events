import Privacy from "@/components/vibgyor/pages/Privacy";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("privacy", { title: "Privacy Policy — Vibgyor Events", description: "How Vibgyor Events collects, uses and protects your personal information." });
}

export default function PrivacyPage() {
  return renderEditable("privacy", () => <Privacy />);
}
