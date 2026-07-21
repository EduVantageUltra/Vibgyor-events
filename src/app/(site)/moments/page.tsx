import Moments from "@/components/vibgyor/pages/Moments";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("moments", {
    title: "Moments — Vibgyor Events | Indian Wedding Photo & Film Gallery",
    description:
      "A gallery of real Indian wedding moments by Vibgyor Events — mehendi, haldi, sangeet, the wedding, reception and destination celebrations across India.",
  });
}

export default function MomentsPage() {
  return renderEditable("moments", () => <Moments />);
}
