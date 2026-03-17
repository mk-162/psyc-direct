"use client";

import { useState } from "react";
import Link from "next/link";

const categories = ["All", "Prevention", "Hormones", "Men's Health", "Women's Health", "Nutrition", "Mental Wellness"];

const featured = {
  image: "/images/kate_consultation_2.jpg",
  tag: "Prevention",
  title: "Why Preventive Screening at 40 Changes Everything",
  subtitle: "The decade between 40 and 50 is when most of the conditions we fear in later life first take root — quietly, without symptoms. Here's what to look for, and why it matters now.",
  author: "Dr. Penny Ashworth",
  readTime: "8 min read",
  href: "/knowledge-hub/preventive-screening-at-40",
};

const articles = [
  {
    image: "/images/alice_ultrasound_scan_2.jpg",
    tag: "Hormones",
    title: "Understanding Your Hormone Panel: What the Numbers Actually Mean",
    desc: "Testosterone, cortisol, DHEA — your hormone results can look like a foreign language. A guide to understanding what's normal, what's not, and when to act.",
    author: "Dr. Kate Fellowes",
    readTime: "6 min read",
    href: "#",
  },
  {
    image: "/images/penny_consultation.jpg",
    tag: "Men's Health",
    title: "The Silent Markers: Cardiac Risk in Men Under 50",
    desc: "Heart disease rarely announces itself. We look at the biomarkers that predict cardiac risk years before symptoms emerge — and what you can do about them.",
    author: "Dr. Penny Ashworth",
    readTime: "7 min read",
    href: "#",
  },
  {
    image: "/images/staff_photo_2.jpg",
    tag: "Women's Health",
    title: "Perimenopause: The Decade That Medicine Mostly Ignores",
    desc: "The symptoms of perimenopause can begin 10 years before menopause. Understanding what's happening — and having a clinician who does too — makes all the difference.",
    author: "Dr. Kate Fellowes",
    readTime: "9 min read",
    href: "#",
  },
  {
    image: "/images/team_outside_2.jpg",
    tag: "Prevention",
    title: "Sleep, Stress, and Your Immune System: A Clinician's Perspective",
    desc: "The research is unambiguous: chronic sleep deprivation and unmanaged stress are primary drivers of immune dysfunction. What the evidence says, and how to respond.",
    author: "Dr. Penny Ashworth",
    readTime: "5 min read",
    href: "#",
  },
  {
    image: "/images/katie_upstairs.jpg",
    tag: "Mental Wellness",
    title: "When Fatigue Isn't Just Tiredness",
    desc: "Persistent fatigue is one of the most common complaints we see — and one of the most under-investigated. A guide to the clinical causes that often go undetected.",
    author: "Dr. Penny Ashworth",
    readTime: "6 min read",
    href: "#",
  },
  {
    image: "/images/staff_photo_1.jpg",
    tag: "Nutrition",
    title: "The Inflammation Diet: Evidence Over Fad",
    desc: "Inflammation underpins nearly every chronic disease. The research on dietary inflammation is robust — and much simpler than the wellness industry suggests.",
    author: "Dr. Kate Fellowes",
    readTime: "7 min read",
    href: "#",
  },
];

export default function KnowledgeSubTemplate() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? articles : articles.filter(a => a.tag === activeCategory);

  return (
    <main>

      {/* ─── LIBRARY HEADER ─── */}
      <section className="section-editorial-dark contact-hero">
        <div className="container-wide">
          <div className="library-header">
            <div className="eyebrow-light">— Wellness Library</div>
            <h1 className="library-title text-cream">
              Evidence-based insight<br />for how you live
            </h1>
            <p className="library-subtitle">
              Written by our clinicians. Grounded in research. Designed to help you understand
              your health — and what to do about it.
            </p>
          </div>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-btn${activeCategory === cat ? " filter-btn--active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ARTICLE: Mosaic ─── */}
      <section className="editorial-mosaic-section">
        <div className="container-wide">
          <div className="eyebrow">— Editor's Pick</div>
          <div className="editorial-mosaic-hero">
            <div className="editorial-mosaic-split">
              <div className="editorial-mosaic-side-main">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="full-width-image"
                />
              </div>
              <div className="editorial-mosaic-feature">
                <div className="editorial-card-tag">{featured.tag}</div>
                <h2 className="editorial-mosaic-headline">{featured.title}</h2>
                <p className="body-editorial mt-content">{featured.subtitle}</p>
                <div className="card-meta-row mt-section">
                  <span className="article-meta-author">{featured.author}</span>
                  <span className="article-meta-divider" />
                  <span className="card-read-time">{featured.readTime}</span>
                </div>
                <div className="btn-row mt-content">
                  <Link href={featured.href} className="btn-ghost">Read Article →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ARTICLE GRID ─── */}
      <section className="editorial-grid-section">
        <div className="container-wide">
          <div className="editorial-grid-header">
            <div className="editorial-grid-eyebrow">— Latest Articles</div>
            <h2 className="editorial-grid-headline">
              {activeCategory === "All" ? "From our clinicians" : activeCategory}
            </h2>
          </div>
          {filtered.length > 0 ? (
            <div className="editorial-grid mt-section">
              {filtered.map((article, i) => (
                <Link key={i} href={article.href} className="card-article-link">
                  <div className="editorial-card">
                    <img src={article.image} alt={article.title} className="editorial-card-image" />
                    <div className="editorial-card-tag">{article.tag}</div>
                    <h3 className="editorial-card-link">{article.title}</h3>
                    <p className="editorial-card-desc">{article.desc}</p>
                    <div className="card-meta-row mt-content">
                      <span className="article-meta-author">{article.author}</span>
                      <span className="article-meta-divider" />
                      <span className="card-read-time">{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid-empty">
              <p className="body-editorial">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="section-editorial-sage">
        <div className="container-narrow">
          <div className="testimonial-content text-center">
            <blockquote className="testimonial-blockquote">
              "The Wellness Library is unlike anything I've seen from a healthcare provider.
              These aren't marketing articles — they're the kind of explanations I used to have
              to pay a private GP to give me."
            </blockquote>
            <div className="testimonial-meta">
              <div className="testimonial-name">Marcus D.</div>
              <div className="testimonial-role">Essential Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARK CTA: Newsletter / Membership ─── */}
      <section className="section-editorial-dark">
        <div className="container-narrow text-center">
          <div className="dark-cta-content">
            <div className="eyebrow-light eyebrow-center">— Never Miss an Article</div>
            <h2 className="heading-display-lg text-cream">
              Health insight, delivered monthly
            </h2>
            <p className="body-editorial-dark mt-content">
              Our clinical team curates one email a month: the articles worth reading,
              the research worth knowing, and the questions worth asking your doctor.
            </p>
            <div className="dark-cta-buttons">
              <Link href="/utility/newsletter-signup" className="btn-cream">Subscribe Free</Link>
              <Link href="/knowledge-hub/index" className="btn-ghost">Browse All Articles</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
