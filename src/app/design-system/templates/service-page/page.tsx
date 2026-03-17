"use client";

import { useState } from "react";
import Link from "next/link";

const faqItems = [
  { q: "How long does the screening take?", a: "The full screening typically takes 2–3 hours. We deliberately pace the experience so you never feel rushed — this is your time." },
  { q: "Do I need to prepare beforehand?", a: "We'll send a pre-screening questionnaire and fasting instructions (12 hours before for blood work). Otherwise, simply arrive as you are." },
  { q: "When will I receive my results?", a: "Your comprehensive health report is delivered within 5 working days, followed by a dedicated consultation to walk through every finding." },
  { q: "Can I add additional tests?", a: "Absolutely. We offer a range of supplementary panels including genetic screening, advanced cardiac markers, and food intolerance testing. Your clinician can advise during your visit." },
  { q: "Is there parking at the clinic?", a: "Yes — complimentary parking is available directly outside our Harrogate clinic. We'll send directions with your booking confirmation." },
];

export default function ServicePageTemplate() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <main>
      {/* ─── HERO: Full-bleed image with centred text overlay ─── */}
      <section className="hero-immersive">
        <img
          src="/images/team_inside.jpg"
          alt="Cocoon Wellness Clinic"
          className="hero-immersive-image"
        />
        <div className="hero-immersive-overlay" />
        <div className="hero-immersive-content">
          <div className="eyebrow-hero">— Men&apos;s Health</div>
          <h1 className="heading-display-xl">Male Health Screening</h1>
          <p className="hero-immersive-body">
            A complete view of your health and wellbeing. Thorough, unhurried, and designed around you.
          </p>
          <a href="#details" className="hero-discover-link">
            Discover
          </a>
        </div>
      </section>

      {/* ─── INTRO: Centred text block with generous whitespace ─── */}
      <section id="details" className="section-editorial-lg text-center">
        <div className="container-mid">
          <div className="eyebrow">Our Approach</div>
          <h2 className="heading-display-lg">
            Proactive care that builds understanding over time
          </h2>
          <p className="body-editorial">
            Our male health screening goes beyond routine checks. We combine advanced diagnostics
            with genuine clinical expertise to build a detailed picture of your health — cardiovascular,
            metabolic, hormonal, and lifestyle factors — then give you the insight and guidance to act on it.
          </p>
        </div>
      </section>

      {/* ─── PRODUCT DETAILS: Asymmetric text/image split ─── */}
      <section className="section-editorial-flush">
        <div className="grid-asymmetric">
          <div>
            <div className="eyebrow">Screening Details</div>
            <h3 className="heading-display-sub">
              Comprehensive. Unhurried. Yours.
            </h3>
            <p className="body-editorial-sm">
              Over 2–3 hours at our Harrogate clinic, your dedicated clinician will guide you
              through a thorough assessment covering cardiovascular health, advanced blood panels,
              hormonal profiling, body composition, and lifestyle evaluation.
            </p>
            <div className="product-stats">
              <div>
                <div className="stat-value">£950</div>
                <div className="stat-label">Per screening</div>
              </div>
              <div>
                <div className="stat-value">2–3h</div>
                <div className="stat-label">Duration</div>
              </div>
              <div>
                <div className="stat-value">5 days</div>
                <div className="stat-label">Results delivered</div>
              </div>
            </div>
            <Link href="/utility/book-visit" className="product-cta">
              Book This Screening
            </Link>
          </div>
          <div className="grid-asymmetric-image">
            <img
              src="/images/kate_consultation.jpg"
              alt="Clinical consultation"
            />
          </div>
        </div>
      </section>

      {/* ─── THREE-UP CARDS: What's Included ─── */}
      <section className="section-editorial-sage">
        <div className="container-wide">
          <div className="section-intro">
            <div className="eyebrow-sm">What&apos;s Included</div>
            <h2 className="heading-display">A meticulously designed assessment</h2>
          </div>
          <div className="cards-portrait-grid">
            {[
              {
                img: "/images/alice_ultrasound_scan.jpg",
                label: "Diagnostic Panels",
                title: "Advanced Blood Work",
                desc: "Comprehensive blood panel including cardiovascular markers, liver and kidney function, cholesterol profile, testosterone, thyroid, and essential vitamins.",
              },
              {
                img: "/images/penny_consultation.jpg",
                label: "Clinical Review",
                title: "60-Minute Consultation",
                desc: "An unhurried session with your dedicated clinician to review every finding, discuss concerns, and build your personalised health optimisation plan.",
              },
              {
                img: "/images/katie_upstairs.jpg",
                label: "Physical Assessment",
                title: "Body & Heart",
                desc: "Cardiovascular check, body composition analysis, grip strength, flexibility assessment, and VO2 max estimation. The full physical picture.",
              },
            ].map((card, i) => (
              <div key={i} className="card-portrait">
                <div className="card-portrait-image">
                  <img src={card.img} alt={card.title} />
                </div>
                <div className="card-portrait-label">{card.label}</div>
                <h3 className="card-portrait-title">{card.title}</h3>
                <p className="card-portrait-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FULL-WIDTH IMAGE BAND ─── */}
      <section className="image-band">
        <img
          src="/images/team_outside_1.jpg"
          alt="Cocoon Wellness exterior"
        />
      </section>

      {/* ─── INCLUDED GRID: 4-column breakdown ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="section-intro">
            <div className="eyebrow">Full Breakdown</div>
            <h2 className="heading-display">Everything your screening covers</h2>
          </div>
          <div className="included-grid">
            {[
              { title: "Physical Assessment", items: ["Full cardiovascular check", "Body composition analysis", "Grip strength & flexibility", "VO2 max estimation"] },
              { title: "Diagnostic Panels", items: ["Comprehensive blood panel", "Hormonal profile (testosterone, thyroid)", "Metabolic markers", "PSA screening"] },
              { title: "Fitness & Lifestyle", items: ["Exercise capacity assessment", "Stress & sleep evaluation", "Nutrition review", "Alcohol & lifestyle impact"] },
              { title: "Consultation & Follow-up", items: ["GP-led results review", "Personalised health plan", "Written report within 5 days", "Follow-up guidance included"] },
            ].map((cat, i) => (
              <div key={i} className="included-category">
                <h4 className="included-category-title">{cat.title}</h4>
                <ul className="included-list">
                  {cat.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PERSONA CARDS: Who is this for? ─── */}
      <section className="section-editorial-stone">
        <div className="container-persona">
          <div className="section-intro-sm">
            <div className="eyebrow-sm">Is This For You?</div>
            <h2 className="heading-display">Designed for men who want answers</h2>
          </div>
          <div className="persona-grid">
            <div className="persona-card">
              <h4 className="persona-title">The Busy Professional</h4>
              <p className="persona-desc">
                You&apos;re performing well, but you haven&apos;t stopped to check in with your body in years.
                This screening gives you a clear, data-driven picture of where you stand.
              </p>
            </div>
            <div className="persona-card">
              <h4 className="persona-title">The Health-Conscious Man</h4>
              <p className="persona-desc">
                You already eat well and exercise, but want clinical validation and insight into what
                bloodwork, heart health, and fitness metrics actually say about your longevity.
              </p>
            </div>
            <div className="persona-card">
              <h4 className="persona-title">The Milestone Marker</h4>
              <p className="persona-desc">
                Turning 40, 50, or starting a new chapter? This is the health reset you&apos;ve been
                meaning to book. Comprehensive, reassuring, and genuinely useful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE: What to expect ─── */}
      <section className="section-editorial">
        <div className="container-narrow">
          <div className="section-intro-sm">
            <div className="eyebrow">Your Journey</div>
            <h2 className="heading-display">What to expect</h2>
          </div>
          <div className="timeline">
            {[
              { n: "1", title: "Book Your Appointment", desc: "Choose a convenient date. We'll send a pre-screening questionnaire and fasting instructions to complete at home." },
              { n: "2", title: "Your Screening Day", desc: "Arrive at our Harrogate clinic. Your dedicated clinician will guide you through each assessment at a comfortable pace." },
              { n: "3", title: "Results & Report", desc: "Within 5 working days you'll receive a comprehensive health report with clear explanations and actionable recommendations." },
              { n: "4", title: "Follow-Up Consultation", desc: "A dedicated session to walk through your results, answer questions, and agree on next steps for your health plan." },
            ].map((step, i) => (
              <div key={i} className="timeline-step">
                <div className="timeline-number">{step.n}</div>
                <div className="timeline-content">
                  <h4 className="timeline-step-title">{step.title}</h4>
                  <p className="timeline-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ASYMMETRIC IMAGE + QUOTE ─── */}
      <section className="section-editorial-flush">
        <div className="grid-asymmetric-wide">
          <div className="grid-asymmetric-image grid-asymmetric-image-landscape">
            <img
              src="/images/staff_photo_1.jpg"
              alt="Our clinical team"
            />
          </div>
          <div>
            <blockquote className="testimonial-quote">
              &ldquo;The most thorough health assessment I&apos;ve ever had. They actually took time
              to explain everything — no rush, no jargon.&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <div className="testimonial-author-name">James Peterson</div>
              <div className="testimonial-author-role">Health MOT Patient</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDION ─── */}
      <section className="section-editorial section-editorial-border-top">
        <div className="container-narrow">
          <div className="section-intro-sm">
            <div className="eyebrow">Common Questions</div>
            <h2 className="heading-display">Frequently asked</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {item.q}
                  <span>{activeFaq === i ? "−" : "+"}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DARK CTA: Signature footer ─── */}
      <section className="section-editorial-dark">
        <div className="container-semi">
          <div className="eyebrow-light">Begin Your Journey</div>
          <h2 className="heading-display-dark">
            Your health deserves more than <em>guesswork</em>
          </h2>
          <p className="body-editorial-dark">
            Book your Male Health Screening today and take the first step towards a clearer,
            more confident understanding of your health.
          </p>
          <div className="btn-row">
            <Link href="/utility/book-visit" className="btn-cream">
              Book Screening
            </Link>
            <Link href="/utility/contact" className="btn-ghost">
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
