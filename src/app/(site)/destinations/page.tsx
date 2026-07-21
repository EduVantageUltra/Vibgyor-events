import Destinations from "@/components/vibgyor/pages/Destinations";
import { renderEditable } from "@/components/puck/EditableContent";
import { seoFor } from "@/lib/pages";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return seoFor("destinations", {
    title: "Destination Weddings — Vibgyor Events | Wedding Venues Across India",
    description:
      "Planning a destination wedding? Pick your city — Udaipur, Jaipur, Jodhpur, Goa, Kerala, Rishikesh, Delhi NCR and 180+ more across India. Vibgyor Events shortlists venues, runs the recce, negotiates the contract and moves your guests.",
  });
}

export default function DestinationsPage() {
  return renderEditable("destinations", () => <Destinations />);
}
