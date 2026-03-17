import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System | Cocoon",
};

export default function DesignSystemHome() {
  return (
    <main>
      <header className="hero-header" style={{ minHeight: "45vh", paddingBottom: "3rem" }}>
        <div className="hero-content">
          <span className="hero-eyebrow">Design System</span>
          <h1 className="hero-title">Component System & Templates</h1>
          <p className="hero-subtitle">
            Centralized component library (the Lego set) and sample page templates. Update a component once, apply globally.
          </p>
        </div>
      </header>

      <section className="ds-section section-bleed section-warm-stone">
        <div className="ds-container">
          <h2 className="ds-section-title">Start Here</h2>
          <p className="ds-section-description">Use the component library for real UI modules, then assemble pages from templates.</p>

          <div className="cards-grid">
            <Link href="/design-system/components" className="card card-sage" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Core</span>
                <h3 className="card-title">Component Library</h3>
                <p className="card-description">
                  Live HTML/CSS components with real states and interactions (hero, grids, timelines, FAQs, booking, CTA footer).
                </p>
              </div>
            </Link>

            <Link href="/design-system/templates/service-page" className="card card-warm" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Assembly</span>
                <h3 className="card-title">Page Templates</h3>
                <p className="card-description">
                  Service, membership, category, and editorial archetypes built from reusable blocks.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="ds-section section-bleed section-mineral-white">
        <div className="ds-container">
          <h2 className="ds-section-title">Page Templates</h2>
          <p className="ds-section-description">Full page layouts assembled from components. Use these as the starting point for real pages.</p>

          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: "2rem" }}>
            <Link href="/design-system/templates/service-page" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Service Page</h3>
                <p className="card-description">Full-bleed hero, product details, cards, timeline, FAQ, CTA.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/membership-details" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Membership Details</h3>
                <p className="card-description">Tier comparison, pricing, benefits breakdown.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/category-home" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Category Home</h3>
                <p className="card-description">Overview page with service listings and navigation.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/blog-post" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Blog Post</h3>
                <p className="card-description">Editorial article layout with rich content.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/editorial-page" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Editorial Page</h3>
                <p className="card-description">Our Story, Founder's Letter, Cocoon Difference — text-led, image-rich narrative pages.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/team-page" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Team Page</h3>
                <p className="card-description">Meet Your Care Team — portrait grid, featured clinician, stats, dark CTA.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/contact-utility" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Contact & Utility</h3>
                <p className="card-description">Contact form, booking, process steps, location — conversion-focused utility pages.</p>
              </div>
            </Link>
            <Link href="/design-system/templates/knowledge-sub" className="card" style={{ textDecoration: "none" }}>
              <div className="card-content">
                <span className="card-tag">Template</span>
                <h3 className="card-title">Knowledge Sub-page</h3>
                <p className="card-description">Wellness Library, Guides, Member Stories — article index with category filtering.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-container">
          <h2 className="ds-section-title">Theme System (Tina-ready)</h2>
          <p className="ds-section-description">
            Components support theme variants (light, dark, sage, warm-sand). These are intended for Tina dropdown fields so editors can switch section palettes per block.
          </p>
        </div>
      </section>
    </main>
  );
}
