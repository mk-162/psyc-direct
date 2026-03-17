import { Hero } from "@/components/blocks/Hero";
import { MyCocoonClient } from "./MyCocoonClient";

export const metadata = {
  title: "My Cocoon | Cocoon Healthcare",
  description: "Look up your bookings and health records at Cocoon Healthcare.",
};

export default function MyCocoonPage() {
  return (
    <>
      <Hero
        data={{
          eyebrow: "My Cocoon",
          headline: "Your health, your record",
          subtitle:
            "Look up your bookings and appointment history. Enter the email address you used when booking.",
          theme: "grey",
        }}
      />
      <MyCocoonClient />
    </>
  );
}
