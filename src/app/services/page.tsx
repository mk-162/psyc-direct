import { Hero } from "@/components/blocks/Hero";
import { SectionIntro } from "@/components/blocks/SectionIntro";
import { DarkCta } from "@/components/blocks/DarkCta";
import { ServicesGrid } from "./ServicesGridClient";

export const metadata = {
  title: "Our Services | Cocoon Healthcare",
  description:
    "Comprehensive health screening, specialist clinics, and wellness services at Cocoon Healthcare, Harrogate.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        data={{
          eyebrow: "Our Services",
          headline: "Invest in your health",
          subtitle:
            "From comprehensive screening to specialist clinics — personalised care designed around you.",
          primaryButtonText: "Book a Consultation",
          primaryButtonUrl: "/utility/contact",
          theme: "green",
          image: "/images/kate_consultation.jpg",
        }}
      />

      <SectionIntro
        data={{
          eyebrow: "Proactive Healthcare",
          heading: "Know more. Worry less.",
          bodyText:
            "Our services are designed to give you a clear, detailed picture of your health — and the expert guidance to act on it. Whether you're looking for a comprehensive health check, investigating a specific concern, or seeking specialist support, we'll tailor our approach to your needs.",
          theme: "off-white",
        }}
      />

      <ServicesGrid />

      <DarkCta
        data={{
          eyebrow: "Not sure where to start?",
          heading: "We'll help you choose",
          bodyText:
            "Our team can recommend the right service based on your age, health history, and goals. Book a free 15-minute discovery call.",
          primaryButtonText: "Book Discovery Call",
          primaryButtonUrl: "/utility/contact",
          secondaryButtonText: "View All FAQs",
          secondaryButtonUrl: "/knowledge-hub/faq",
        }}
      />
    </>
  );
}
