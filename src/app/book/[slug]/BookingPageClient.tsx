"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Hero } from "@/components/blocks/Hero";
import { BookingForm } from "@/components/blocks/BookingForm";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";

function BookingContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || "";
  const productName = searchParams.get("name") || "Service";
  const productPrice = parseFloat(searchParams.get("price") || "0");

  if (!productId) {
    return (
      <>
        <Hero
          data={{
            eyebrow: "Booking",
            headline: "Service not found",
            subtitle: "Please select a service from our services page.",
            primaryButtonText: "View Services",
            primaryButtonUrl: "/services",
            theme: "grey",
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="demo-banner">
        <span className="demo-banner-text">
          ⚠️ Demo / Sandbox — This is not a live booking system
        </span>
      </div>

      <Hero
        data={{
          eyebrow: "Book Your Appointment",
          headline: productName,
          subtitle: `£${productPrice} · Cocoon Healthcare, Harrogate`,
          theme: "grey",
        }}
      />

      <ProcessSteps
        data={{
          eyebrow: "How It Works",
          heading: "Simple, seamless booking",
          theme: "off-white",
          steps: [
            {
              number: "01",
              title: "Complete your details",
              description:
                "Fill in the form below with your contact information and any relevant health details.",
            },
            {
              number: "02",
              title: "We confirm your appointment",
              description:
                "A member of our team will be in touch within 4 working hours to arrange a convenient time.",
            },
            {
              number: "03",
              title: "Attend your appointment",
              description:
                "Visit us at Cocoon Healthcare in Harrogate. Results and next steps discussed in person.",
            },
          ],
        }}
      />

      <BookingForm
        productId={productId}
        productName={productName}
        productPrice={productPrice}
        theme="grey"
      />
    </>
  );
}

export function BookingPageClient() {
  return (
    <Suspense
      fallback={
        <section className="section-editorial section-bleed section-mineral-white theme-light">
          <div className="container-wide">
            <p className="body-editorial">Loading booking form…</p>
          </div>
        </section>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
