import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Page Template | Design System",
  description: "Template for text-heavy editorial pages: Our Story, Founder's Letter, Cocoon Difference, Careers, Press.",
};

const timelineItems = [
  { year: "2018", title: "The Vision", desc: "Founded on a single belief: that preventive care, delivered with genuine attention, could transform how people experience their health." },
  { year: "2020", title: "Harrogate Opens", desc: "Our first clinic opens in the heart of Harrogate. From day one, every detail — the light, the pace, the people — was designed around you." },
  { year: "2022", title: "Growing the Team", desc: "We brought together clinicians who share a rare combination: deep expertise and the ability to listen. Our care team grew from 4 to 18." },
  { year: "2024", title: "A New Standard", desc: "Over 3,000 members now experience healthcare built around their lives — not the other way around." },
];

const values = [
  { icon: "◎", title: "Unhurried Care", desc: "Every appointment is given the time it deserves. We don't rush consultations — because your health story takes time to understand." },
  { icon: "◈", title: "Radical Transparency", desc: "You receive your full results. Every number, every finding, explained clearly by a clinician who knows your history." },
  { icon: "◉", title: "Longitudinal Relationships", desc: "We track your health over years, not visits. Our understanding of you deepens over time — and so does the quality of your care." },
];

export default function EditorialPageTemplate() {
  return (
    <main>

      {/* ─── HERO: Full-bleed immersive ─── */}
      <section className="hero-immersive section-bleed theme-dark">
        <img
          src="/images/team_outside_1.jpg"
          alt="Cocoon team"
          className="hero-immersive-image"
        />
        <div className="hero-immersive-overlay" />
        <div className="hero-immersive-content">
          <div className="eyebrow-hero">— Our Story</div>
          <h1 className="heading-display-xl text-cream">
            A Clinic Built<br />on Conviction
          </h1>
          <p className="hero-immersive-body">
            We believe healthcare should feel like a relationship — not a transaction.
            Everything about Cocoon was designed to prove that belief right.
          </p>
          <a href="#story" className="hero-discover-link">Read our story</a>
        </div>
      </section>

      {/* ─── INTRO: Wide opening statement ─── */}
      <section id="story" className="section-editorial-lg">
        <div className="container-narrow">
          <p className="body-editorial">
            Cocoon began with a question: why does excellent healthcare so rarely feel excellent?
            Not just clinically — but in the experience of receiving it. The waiting. The hurry.
            The sense that you're a case number, not a person.
          </p>
          <p className="body-editorial mt-content">
            Our founders — a physician and a designer — set out to answer that question with something
            real. Not a rebrand. Not a glossy waiting room. A genuinely different model of care,
            built from the ground up around the people it serves.
          </p>
        </div>
      </section>

      {/* ─── PULL QUOTE: Sage background, centred ─── */}
      <section className="section-editorial-sage">
        <div className="container-narrow text-center">
          <div className="eyebrow eyebrow-center">— Founding Principle</div>
          <blockquote className="pull-quote">
            "We didn't want to build a better clinic. We wanted to build a better relationship
            between people and their health."
          </blockquote>
          <p className="pull-quote-attribution">Dr. Sarah Whitfield, Co-Founder</p>
        </div>
      </section>

      {/* ─── CONTENT + IMAGE: Editorial two-column ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="content-media-grid">
            <div className="content-side">
              <div className="eyebrow">— How We're Different</div>
              <h2 className="heading-display-lg">Designed around your life,<br />not our schedule</h2>
              <p className="body-editorial mt-content">
                Most clinics are organised around the needs of the clinic. Cocoon is organised
                around the needs of its members. That sounds obvious. In practice, it changes everything.
              </p>
              <p className="body-editorial mt-content">
                Your appointments are never rushed. Your clinician has read your file before you arrive.
                Your results come with a conversation, not a letter. And when something changes — in
                your life or your health — we're already paying attention.
              </p>
              <div className="btn-row mt-section">
                <Link href="/our-story/the-cocoon-difference" className="btn-ghost">
                  The Cocoon Difference →
                </Link>
              </div>
            </div>
            <div className="content-side">
              <img
                src="/images/kate_consultation.jpg"
                alt="Consultation at Cocoon"
                className="full-width-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES: Three pillars on warm stone ─── */}
      <section className="section-editorial-stone">
        <div className="container-wide">
          <div className="section-header-center">
            <div className="eyebrow eyebrow-center">— What We Stand For</div>
            <h2 className="heading-display-lg">Three principles.<br />Every decision.</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="values-item">
                <div className="values-item-icon">{v.icon}</div>
                <h3 className="values-item-title">{v.title}</h3>
                <p className="body-editorial-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE: Our journey ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="section-header-center">
            <div className="eyebrow eyebrow-center">— Our Journey</div>
            <h2 className="heading-display-lg">Built with intention,<br />year by year</h2>
          </div>
          <div className="timeline-container mt-section">
            <div className="timeline-steps">
              {timelineItems.map((item, i) => (
                <div key={i} className="timeline-step">
                  <div className="timeline-step-number">{item.year}</div>
                  <div>
                    <div className="timeline-step-title">{item.title}</div>
                    <div className="timeline-step-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIGNATURE FOOTER: CTA ─── */}
      <section className="signature-footer">
        <div className="signature-footer-content">
          <div className="signature-eyebrow">— Join Cocoon</div>
          <h2 className="signature-headline">
            Healthcare that knows you.<br />Care that grows with you.
          </h2>
          <div className="signature-actions">
            <Link href="/utility/book-visit" className="signature-btn signature-btn-primary">
              Book a Visit
            </Link>
            <Link href="/membership/index" className="signature-btn signature-btn-secondary">
              Explore Membership
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
