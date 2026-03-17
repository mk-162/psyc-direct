"use client";

import { useState } from "react";
import { Hero } from "@/components/blocks/Hero";
import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { EditorialGrid } from "@/components/blocks/EditorialGrid";
import { IntroGallery } from "@/components/blocks/IntroGallery";
import { SignatureFooter } from "@/components/blocks/SignatureFooter";

type Theme3 = "off-white" | "grey" | "green" | "terracotta";

const COMPONENTS = [
  "Hero",
  "Feature Grid",
  "Editorial Grid",
  "Intro Gallery",
  "Hero Immersive",
  "Section Intro",
  "Product Stats",
  "Cards Portrait",
  "Full-Width Image Band",
  "Asymmetric Split",
  "Testimonial",
  "Dark CTA Section",
  "Navigation",
  "Page Headers",
  "Cards",
  "Card Variants",
  "Info Boxes",
  "Widgets",
  "Form Component",
  "Form Elements",
  "Breadcrumb",
  "Process Timeline",
  "Persona Cards",
  "Booking Placeholder",
  "Included Grid",
  "Service/Product",
  "Foundations",
  "Mega Footer",
  "Image Focal Points",
] as const;

type ComponentName = (typeof COMPONENTS)[number];

const SECTION_IDS: Record<ComponentName, string> = {
  Hero: "section-hero",
  "Feature Grid": "section-feature-grid",
  "Editorial Grid": "section-editorial-grid",
  "Intro Gallery": "section-intro-gallery",
  "Hero Immersive": "section-hero-immersive",
  "Section Intro": "section-section-intro",
  "Product Stats": "section-product-stats",
  "Cards Portrait": "section-cards-portrait",
  "Full-Width Image Band": "section-image-band",
  "Asymmetric Split": "section-asymmetric-split",
  Testimonial: "section-testimonial",
  "Dark CTA Section": "section-dark-cta",
  Navigation: "section-navigation",
  "Page Headers": "section-page-headers",
  Cards: "section-cards",
  "Card Variants": "section-card-variants",
  "Info Boxes": "section-info-boxes",
  Widgets: "section-widgets",
  "Form Component": "section-form-component",
  "Form Elements": "section-form-elements",
  Breadcrumb: "section-breadcrumb",
  "Process Timeline": "section-process-timeline",
  "Persona Cards": "section-persona-cards",
  "Booking Placeholder": "section-booking-placeholder",
  "Included Grid": "section-included-grid",
  "Service/Product": "section-service-product",
  Foundations: "section-foundations",
  "Mega Footer": "section-mega-footer",
  "Image Focal Points": "section-focal-points",
};

/* All components support theme switching */
const THEMEABLE: ComponentName[] = [...COMPONENTS];

const faqItems = [
  {
    q: "How long does the screening take?",
    a: "The full screening typically takes 2–3 hours. We deliberately pace the experience so you never feel rushed.",
  },
  {
    q: "Do I need to prepare beforehand?",
    a: "We'll send a pre-screening questionnaire and fasting instructions (12 hours) before blood work.",
  },
  {
    q: "When do I receive results?",
    a: "You receive a full report within 5 working days, then a clinician follow-up to discuss next steps.",
  },
];

function sectionTheme(t: Theme3) {
  if (t === "green") return "section-deep-green theme-dark";
  if (t === "grey") return "section-warm-stone theme-light";
  if (t === "terracotta") return "section-terracotta theme-dark";
  return "section-mineral-white theme-light";
}

/* ─── Section Title Bar ─── */
function SectionBar({ name, id }: { name: string; id: string }) {
  return (
    <div
      id={id}
      style={{
        background: "#000",
        color: "#fff",
        padding: "0.6rem 1.5rem",
        fontFamily: "var(--font-accent, sans-serif)",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        width: "100%",
      }}
    >
      {name}
    </div>
  );
}

/* ─── Sticky Side Panel ─── */
function ThemePanel({
  themes,
  onChange,
}: {
  themes: Record<ComponentName, Theme3>;
  onChange: (name: ComponentName, value: Theme3) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<ComponentName | null>(null);
  const options: Theme3[] = ["off-white", "grey", "green", "terracotta"];

  const scrollTo = (name: ComponentName) => {
    const el = document.getElementById(SECTION_IDS[name]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Tab trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          writingMode: "vertical-rl",
          background: "#2A2418",
          color: "#E8DFD0",
          border: "none",
          borderRadius: "6px 0 0 6px",
          padding: "14px 10px",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontFamily: "var(--font-accent, sans-serif)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        Themes
      </button>

      {/* Slide-out panel */}
      <div
        style={{
          position: "fixed",
          right: open ? 0 : "-300px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9998,
          width: "280px",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#2A2418",
          color: "#E8DFD0",
          borderRadius: "8px 0 0 8px",
          padding: "1.25rem 1rem",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.25)",
          transition: "right 0.25s ease",
          fontFamily: "var(--font-accent, sans-serif)",
          fontSize: "0.8rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <strong
            style={{
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Theme Control
          </strong>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#E8DFD0",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            ✕
          </button>
        </div>

        {COMPONENTS.map((name) => {
          const isThemeable = THEMEABLE.includes(name);
          return (
            <div key={name} style={{ marginBottom: "0.5rem" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
              >
                {/* Jump-to link */}
                <button
                  onClick={() => scrollTo(name)}
                  title={`Jump to ${name}`}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#C4A87C",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    padding: "0.3rem",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  &#8599;
                </button>
                {isThemeable ? (
                  <button
                    onClick={() =>
                      setExpanded(expanded === name ? null : name)
                    }
                    style={{
                      flex: 1,
                      textAlign: "left",
                      background:
                        expanded === name
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "4px",
                      color: "#E8DFD0",
                      padding: "0.5rem 0.6rem",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{name}</span>
                    <span
                      style={{
                        opacity: 0.5,
                        fontSize: "0.7rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {themes[name]} {expanded === name ? "▲" : "▼"}
                    </span>
                  </button>
                ) : (
                  <span
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.6rem",
                      fontSize: "0.78rem",
                      opacity: 0.6,
                    }}
                  >
                    {name}
                  </span>
                )}
              </div>

              {isThemeable && expanded === name && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.35rem",
                    padding: "0.4rem 0.2rem 0.4rem 1.8rem",
                  }}
                >
                  {options.map((o) => (
                    <button
                      key={o}
                      onClick={() => onChange(name, o)}
                      style={{
                        flex: 1,
                        padding: "0.3rem 0",
                        fontSize: "0.72rem",
                        textTransform: "capitalize",
                        border:
                          themes[name] === o
                            ? "1px solid #C4A87C"
                            : "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "3px",
                        background:
                          themes[name] === o
                            ? "rgba(196,168,124,0.2)"
                            : "transparent",
                        color: themes[name] === o ? "#C4A87C" : "#E8DFD0",
                        cursor: "pointer",
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const FOCAL_CLASSES = [
  { cls: "", label: "Default (center)" },
  { cls: "img-focus-top", label: ".img-focus-top" },
  { cls: "img-focus-face", label: ".img-focus-face" },
  { cls: "img-focus-center", label: ".img-focus-center" },
  { cls: "img-focus-bottom", label: ".img-focus-bottom" },
  { cls: "img-focus-left", label: ".img-focus-left" },
  { cls: "img-focus-right", label: ".img-focus-right" },
  { cls: "img-focus-top-left", label: ".img-focus-top-left" },
  { cls: "img-focus-top-right", label: ".img-focus-top-right" },
] as const;

function FocalPointDemo() {
  const [active, setActive] = useState(0);
  const current = FOCAL_CLASSES[active];

  return (
    <div>
      {/* Class selector buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {FOCAL_CLASSES.map((f, i) => (
          <button
            key={f.cls}
            onClick={() => setActive(i)}
            style={{
              fontFamily: "var(--font-accent, sans-serif)",
              fontSize: "0.72rem",
              letterSpacing: "0.05em",
              padding: "0.4rem 0.8rem",
              border: active === i ? "2px solid var(--color-figmav1-black, #2A2418)" : "1px solid rgba(0,0,0,0.15)",
              borderRadius: "3px",
              background: active === i ? "var(--color-figmav1-black, #2A2418)" : "transparent",
              color: active === i ? "var(--color-figmav1-cream, #E8DFD0)" : "inherit",
              cursor: "pointer",
              fontWeight: active === i ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Demo images in different aspect ratios */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {/* Portrait */}
        <div>
          <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", opacity: 0.6 }}>
            Portrait (3:4)
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img
              key={`portrait-${active}`}
              src="/images/kate_consultation.jpg"
              alt="Portrait focal point demo"
              className={current.cls}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
        {/* Landscape */}
        <div>
          <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", opacity: 0.6 }}>
            Landscape (16:9)
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "16/9" }}>
            <img
              key={`landscape-${active}`}
              src="/images/team_outside_2.jpg"
              alt="Landscape focal point demo"
              className={current.cls}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
        {/* Square */}
        <div>
          <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", opacity: 0.6 }}>
            Square (1:1)
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img
              key={`square-${active}`}
              src="/images/penny_consultation.jpg"
              alt="Square focal point demo"
              className={current.cls}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* Code snippet */}
      <div style={{
        marginTop: "1.25rem",
        padding: "0.75rem 1rem",
        background: "rgba(0,0,0,0.05)",
        borderRadius: "4px",
        fontFamily: "'Courier New', monospace",
        fontSize: "0.8rem",
        color: "var(--color-figmav1-black)",
      }}>
        {current.cls
          ? <>&lt;img src=&quot;...&quot; className=&quot;<strong>{current.cls}</strong>&quot; /&gt;</>
          : <>&lt;img src=&quot;...&quot; /&gt; <span style={{ opacity: 0.5 }}>/* default object-position: center center */</span></>
        }
      </div>
    </div>
  );
}

export default function ComponentsLibraryPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themes, setThemes] = useState<Record<ComponentName, Theme3>>({
    Hero: "green",
    "Feature Grid": "off-white",
    "Editorial Grid": "grey",
    "Intro Gallery": "off-white",
    "Hero Immersive": "green",
    "Section Intro": "off-white",
    "Product Stats": "off-white",
    "Cards Portrait": "grey",
    "Full-Width Image Band": "off-white",
    "Asymmetric Split": "off-white",
    Testimonial: "off-white",
    "Dark CTA Section": "green",
    Navigation: "off-white",
    "Page Headers": "off-white",
    Cards: "off-white",
    "Card Variants": "off-white",
    "Info Boxes": "off-white",
    Widgets: "off-white",
    "Form Component": "off-white",
    "Form Elements": "off-white",
    Breadcrumb: "off-white",
    "Process Timeline": "off-white",
    "Persona Cards": "off-white",
    "Booking Placeholder": "off-white",
    "Included Grid": "off-white",
    "Service/Product": "off-white",
    Foundations: "off-white",
    "Mega Footer": "off-white",
    "Image Focal Points": "off-white",
  });

  const set = (name: ComponentName, value: Theme3) =>
    setThemes((prev) => ({ ...prev, [name]: value }));

  return (
    <main style={{ "--ds-gap": "0" } as React.CSSProperties}>
      <ThemePanel themes={themes} onChange={set} />

      {/* ═══════════ Hero ═══════════ */}
      <SectionBar name="Hero" id={SECTION_IDS["Hero"]} />
      <Hero
        data={{
          theme: themes["Hero"],
          eyebrow: "Design System",
          headline: "Component Library",
          subtitle:
            "Live HTML/CSS components used as the site Lego set.",
          image: "/images/team_inside.jpg",
          primaryButtonText: "View Templates",
          primaryButtonUrl: "/design-system/templates/service-page",
          secondaryButtonText: "Back to Design System",
          secondaryButtonUrl: "/design-system",
        }}
      />

      {/* ═══════════ Feature Grid ═══════════ */}
      <SectionBar name="Feature Grid" id={SECTION_IDS["Feature Grid"]} />
      <FeatureGrid
        data={{
          theme: themes["Feature Grid"],
          headline: "Foundations",
          description: "Theme-aware primitives shared across all pages.",
          features: [
            { title: "Color Themes", description: "light / sage / dark" },
            {
              title: "Type Scale",
              description: "Consistent heading + body rhythm",
            },
            {
              title: "Block Composition",
              description: "Reusable blocks stack into templates",
            },
          ],
        }}
      />

      {/* ═══════════ Editorial Grid ═══════════ */}
      <SectionBar name="Editorial Grid" id={SECTION_IDS["Editorial Grid"]} />
      <EditorialGrid
        data={{
          theme: themes["Editorial Grid"],
          eyebrow: "Editorial Grid",
          headline: "Card-based content module",
          items: [
            {
              image: "/images/kate_consultation.jpg",
              title: "Clinical Insight",
              description:
                "Structured cards with image, title, body, and CTA.",
              linkText: "Read More",
              linkUrl: "#",
            },
            {
              image: "/images/alice_ultrasound_scan.jpg",
              title: "Preventive Focus",
              description: "Used for service listings and landing sections.",
              linkText: "Read More",
              linkUrl: "#",
            },
            {
              image: "/images/penny_consultation.jpg",
              title: "Story-led Layout",
              description: "Flexible image ratio handling.",
              linkText: "Read More",
              linkUrl: "#",
            },
          ],
        }}
      />

      {/* ═══════════ Intro Gallery ═══════════ */}
      <SectionBar name="Intro Gallery" id={SECTION_IDS["Intro Gallery"]} />
      <IntroGallery
        data={{
          theme: themes["Intro Gallery"],
          headline: "Intro Gallery",
          description:
            "Asymmetric image composition for premium storytelling.",
          galleryItems: [
            { image: "/images/team_outside_1.jpg", caption: "Consultation spaces" },
            { image: "/images/team_outside_2.jpg", caption: "Member experience" },
            { image: "/images/katie_upstairs.jpg", caption: "Clinical environment" },
          ],
        }}
      />

      {/* ═══════════ Hero Immersive ═══════════ */}
      <SectionBar name="Hero Immersive" id={SECTION_IDS["Hero Immersive"]} />
      <section className="hero-immersive">
        <img
          src="/images/team_inside.jpg"
          alt="Cocoon Wellness Clinic"
          className="hero-immersive-image"
        />
        <div className="hero-immersive-overlay" />
        <div className="hero-immersive-content">
          <div className="eyebrow-hero">— Editorial Luxury</div>
          <h1 className="heading-display-xl">Full-Bleed Image Hero</h1>
          <p className="hero-immersive-body">
            Immersive hero with gradient overlay, centred serif headline, and discover link. Used for service landing pages.
          </p>
          <a href="#" className="hero-discover-link">Discover</a>
        </div>
      </section>

      {/* ═══════════ Section Intro ═══════════ */}
      <SectionBar name="Section Intro" id={SECTION_IDS["Section Intro"]} />
      <section className="section-editorial-lg text-center">
        <div className="container-mid">
          <div className="eyebrow">Our Approach</div>
          <h2 className="heading-display-lg">
            Centred eyebrow + display heading pattern
          </h2>
          <p className="body-editorial">
            The section intro is a reusable pattern: an all-caps eyebrow label above a serif display heading, centred with generous whitespace. Used to introduce every major section.
          </p>
        </div>
      </section>

      {/* ═══════════ Product Stats ═══════════ */}
      <SectionBar name="Product Stats" id={SECTION_IDS["Product Stats"]} />
      <section className="section-editorial">
        <div className="container-wide">
          <div className="section-intro">
            <div className="eyebrow">Screening Details</div>
            <h2 className="heading-display">Price, duration &amp; results at a glance</h2>
          </div>
          <div className="product-stats">
            <div>
              <div className="stat-value">&pound;950</div>
              <div className="stat-label">Per screening</div>
            </div>
            <div>
              <div className="stat-value">2&ndash;3h</div>
              <div className="stat-label">Duration</div>
            </div>
            <div>
              <div className="stat-value">5 days</div>
              <div className="stat-label">Results delivered</div>
            </div>
            <div>
              <div className="stat-value">98%</div>
              <div className="stat-label">Patient satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Cards Portrait ═══════════ */}
      <SectionBar name="Cards Portrait" id={SECTION_IDS["Cards Portrait"]} />
      <section className="section-editorial-sage">
        <div className="container-wide">
          <div className="section-intro">
            <div className="eyebrow-sm">What&apos;s Included</div>
            <h2 className="heading-display">Portrait image cards &mdash; 3:4 ratio</h2>
          </div>
          <div className="cards-portrait-grid">
            {[
              { img: "/images/alice_ultrasound_scan.jpg", label: "Diagnostic Panels", title: "Advanced Blood Work", desc: "Comprehensive blood panel including cardiovascular markers, liver and kidney function, cholesterol profile." },
              { img: "/images/penny_consultation.jpg", label: "Clinical Review", title: "60-Minute Consultation", desc: "An unhurried session with your dedicated clinician to review every finding and build your health plan." },
              { img: "/images/katie_upstairs.jpg", label: "Physical Assessment", title: "Body & Heart", desc: "Cardiovascular check, body composition analysis, grip strength, flexibility assessment, and VO2 max estimation." },
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

      {/* ═══════════ Full-Width Image Band ═══════════ */}
      <SectionBar name="Full-Width Image Band" id={SECTION_IDS["Full-Width Image Band"]} />
      <section className="image-band">
        <img src="/images/team_outside_1.jpg" alt="Cocoon Wellness exterior" />
      </section>

      {/* ═══════════ Asymmetric Split ═══════════ */}
      <SectionBar name="Asymmetric Split" id={SECTION_IDS["Asymmetric Split"]} />
      <section className="section-editorial-flush">
        <div className="grid-asymmetric">
          <div>
            <div className="eyebrow">Screening Details</div>
            <h3 className="heading-display-sub">Comprehensive. Unhurried. Yours.</h3>
            <p className="body-editorial-sm">
              Text + image split layout with generous gap. The asymmetric grid places content and a portrait image side by side, aligned centre. Used for product detail sections.
            </p>
            <a href="#" className="product-cta">Book This Screening</a>
          </div>
          <div className="grid-asymmetric-image">
            <img src="/images/kate_consultation.jpg" alt="Clinical consultation" />
          </div>
        </div>
      </section>

      {/* ═══════════ Testimonial ═══════════ */}
      <SectionBar name="Testimonial" id={SECTION_IDS["Testimonial"]} />
      <section className="section-editorial-flush">
        <div className="grid-asymmetric-wide">
          <div className="grid-asymmetric-image grid-asymmetric-image-landscape">
            <img src="/images/staff_photo_1.jpg" alt="Our clinical team" />
          </div>
          <div>
            <blockquote className="testimonial-quote">
              &ldquo;The most thorough health assessment I&apos;ve ever had. They actually took time to explain everything &mdash; no rush, no jargon.&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <div className="testimonial-author-name">James Peterson</div>
              <div className="testimonial-author-role">Health MOT Patient</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Dark CTA Section ═══════════ */}
      <SectionBar name="Dark CTA Section" id={SECTION_IDS["Dark CTA Section"]} />
      <section className="section-editorial-dark">
        <div className="container-semi">
          <div className="eyebrow-light">Begin Your Journey</div>
          <h2 className="heading-display-dark">
            Your health deserves more than <em>guesswork</em>
          </h2>
          <p className="body-editorial-dark">
            Dark section with cream text, gold eyebrow, and dual buttons &mdash; one solid cream, one ghost outline. Used as a signature CTA footer.
          </p>
          <div className="btn-row">
            <a href="#" className="btn-cream">Book Screening</a>
            <a href="#" className="btn-ghost">Contact Team</a>
          </div>
        </div>
      </section>

      {/* ═══════════ Navigation ═══════════ */}
      <SectionBar name="Navigation" id={SECTION_IDS["Navigation"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Navigation"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Navigation (Mega Menu)</h2>
          <p className="ds-section-description">
            Clean, minimal navigation with clear hierarchy and CTAs. Click MENU to expand.
          </p>
          <div className="nav-demo" style={{ marginTop: "1.25rem" }}>
            <div className="nav-header">
              <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                MENU
              </button>
              <div className="nav-logo" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                COCOON
              </div>
              <a href="#" className="nav-cta">
                ENQUIRE
              </a>
            </div>
            <div className={`nav-menu${menuOpen ? " active" : ""}`}>
              <div className="nav-menu-grid">
                <div className="nav-menu-column">
                  <h3>Services</h3>
                  <ul className="nav-menu-links">
                    <li><a href="#" className="nav-link">Health Assessment</a></li>
                    <li><a href="#" className="nav-link">Blood Testing</a></li>
                    <li><a href="#" className="nav-link">GP Consultations</a></li>
                    <li><a href="#" className="nav-link">Specialist Care</a></li>
                  </ul>
                </div>
                <div className="nav-menu-column">
                  <h3>About</h3>
                  <ul className="nav-menu-links">
                    <li><a href="#" className="nav-link">Our Approach</a></li>
                    <li><a href="#" className="nav-link">Our Team</a></li>
                    <li><a href="#" className="nav-link">Our Clinic</a></li>
                  </ul>
                </div>
                <div className="nav-menu-column">
                  <h3>Membership</h3>
                  <ul className="nav-menu-links">
                    <li><a href="#" className="nav-link">Plans</a></li>
                    <li><a href="#" className="nav-link">Benefits</a></li>
                    <li><a href="#" className="nav-link">Pricing</a></li>
                  </ul>
                </div>
                <div className="nav-menu-column">
                  <h3>Resources</h3>
                  <ul className="nav-menu-links">
                    <li><a href="#" className="nav-link">Health Library</a></li>
                    <li><a href="#" className="nav-link">FAQs</a></li>
                    <li><a href="#" className="nav-link">Contact</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Page Headers ═══════════ */}
      <SectionBar name="Page Headers" id={SECTION_IDS["Page Headers"]} />
      <section className={`ds-section section-bleed ${sectionTheme(themes["Page Headers"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Page Headers</h2>
          <p className="ds-section-description">Dramatic page headers with clear hierarchy. Used for landing pages and key content pages.</p>

          {/* Hero Header */}
          <div className="page-header hero-header" style={{ marginTop: "1.25rem" }}>
            <div className="hero-content">
              <span className="hero-eyebrow">Preventative Healthcare</span>
              <h1 className="hero-title">Healthcare designed for life</h1>
              <p className="hero-subtitle">A proactive, human-first approach to health and wellness. Built on trust. Designed for life.</p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg">Book Consultation</button>
                <button className="btn btn-secondary btn-lg">Explore Services</button>
              </div>
            </div>
          </div>

          {/* Standard Page Header */}
          <div className="page-header standard-header" style={{ marginTop: "2rem" }}>
            <div className="standard-header-image">
              <img src="/images/team_inside.jpg" alt="Cocoon Healthcare Clinic Interior" />
            </div>
            <span className="page-eyebrow">Our Services</span>
            <h1 className="page-title">Comprehensive Health Assessment</h1>
            <p className="page-description">A thorough evaluation of your health status with personalized recommendations from our expert clinical team.</p>
          </div>

          {/* Minimal Page Header */}
          <div className="page-header minimal-header" style={{ marginTop: "2rem" }}>
            <h1 className="minimal-title">About Cocoon</h1>
            <p className="minimal-subtitle">Human-first healthcare that works quietly in the background</p>
          </div>
        </div>
      </section>

      {/* ═══════════ Cards ═══════════ */}
      <SectionBar name="Cards" id={SECTION_IDS["Cards"]} />
      <section className={`ds-section section-bleed ${sectionTheme(themes["Cards"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Cards</h2>
          <p className="ds-section-description">Service and information cards with clean shadows and hover states.</p>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            <div className="card">
              <div className="card-image">
                <img src="/images/kate_consultation.jpg" alt="Health Assessment" />
              </div>
              <div className="card-content">
                <span className="card-tag">Preventive Care</span>
                <h3 className="card-title">Health Assessment</h3>
                <p className="card-description">Comprehensive review of your health markers with personalized recommendations from our clinical team.</p>
                <div className="card-footer">
                  <button className="btn btn-secondary btn-sm">Learn More</button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-image">
                <img src="/images/alice_ultrasound_scan.jpg" alt="Blood Testing" />
              </div>
              <div className="card-content">
                <span className="card-tag">Diagnostics</span>
                <h3 className="card-title">Blood Testing</h3>
                <p className="card-description">Advanced blood panels analyzed by specialists, with results and consultation within 48 hours.</p>
                <div className="card-footer">
                  <button className="btn btn-secondary btn-sm">Learn More</button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-image">
                <img src="/images/penny_consultation.jpg" alt="GP Services" />
              </div>
              <div className="card-content">
                <span className="card-tag">Consultations</span>
                <h3 className="card-title">GP Services</h3>
                <p className="card-description">Same-day GP consultations with experienced clinicians who take time to listen and understand.</p>
                <div className="card-footer">
                  <button className="btn btn-secondary btn-sm">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Card Variants ═══════════ */}
      <SectionBar name="Card Variants" id={SECTION_IDS["Card Variants"]} />
      <section className={`ds-section section-bleed ${sectionTheme(themes["Card Variants"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Card Variants &mdash; Warm Stone &amp; Sage Green</h2>
          <p className="ds-section-description">Alternative card styles using Warm Stone and Sage Green backgrounds for visual variety and hierarchy.</p>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            <div className="card card-warm">
              <div className="card-content">
                <span className="card-tag">Featured</span>
                <h3 className="card-title">Executive Health MOT</h3>
                <p className="card-description">Comprehensive health screening designed for busy professionals. Full blood panel, cardiac assessment, and lifestyle consultation.</p>
                <div className="card-footer">
                  <button className="btn btn-primary btn-sm">Learn More</button>
                </div>
              </div>
            </div>
            <div className="card card-sage">
              <div className="card-content">
                <span className="card-tag">Wellness</span>
                <h3 className="card-title">Lifestyle Consultation</h3>
                <p className="card-description">Personalized guidance on nutrition, exercise, sleep, and stress management from our wellness team.</p>
                <div className="card-footer">
                  <button className="btn btn-secondary btn-sm">Book Now</button>
                </div>
              </div>
            </div>
            <div className="card card-feature-sage">
              <div className="card-image">
                <img src="/images/team_inside.jpg" alt="Virtual Consultations" />
              </div>
              <div className="card-content">
                <span className="card-tag">New</span>
                <h3 className="card-title">Virtual Consultations</h3>
                <p className="card-description">Connect with our clinical team from anywhere. Same quality care, delivered securely online.</p>
                <div className="card-footer">
                  <button className="btn btn-primary btn-sm">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Info Boxes ═══════════ */}
      <SectionBar name="Info Boxes" id={SECTION_IDS["Info Boxes"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Info Boxes"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Info Boxes</h2>
          <p className="ds-section-description">CQC box, same-day highlight, and quote card variants.</p>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            <div className="info-box-warm">
              <div className="info-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="info-title">CQC Registered</h4>
              <p className="info-description">Fully regulated and inspected to ensure the highest standards of care and safety.</p>
            </div>
            <div className="highlight-box-sage">
              <h4 className="highlight-title">Same-Day Appointments</h4>
              <p className="highlight-description">Call us before 10am and we&apos;ll do our best to see you the same day. No long waits.</p>
              <button className="btn btn-tertiary btn-sm">020 1234 5678</button>
            </div>
            <div className="card-quote-warm">
              <p className="quote-text-small">&ldquo;The most thorough health assessment I&apos;ve ever had. They actually took time to explain everything.&rdquo;</p>
              <div className="quote-author">
                <div className="author-name">James Peterson</div>
                <div className="author-role">Health MOT Patient</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Widgets ═══════════ */}
      <SectionBar name="Widgets" id={SECTION_IDS["Widgets"]} />
      <section className={`ds-section section-bleed ${sectionTheme(themes["Widgets"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Widgets</h2>
          <p className="ds-section-description">Reusable interface components for CTAs, alerts, stats, and informational displays.</p>
          <div className="widgets-grid" style={{ marginTop: "1.25rem" }}>
            {/* CTA Widget */}
            <div className="widget widget-cta">
              <h3 className="widget-title">Ready to take control of your health?</h3>
              <p className="widget-description">Book a consultation with our clinical team today.</p>
              <button className="btn btn-primary">Book Consultation</button>
            </div>

            {/* Alert Widget */}
            <div className="widget widget-alert alert-info">
              <div className="alert-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="alert-content">
                <div className="alert-title">Same-day appointments available</div>
                <div className="alert-description">Call us before 10am to book for today</div>
              </div>
            </div>

            {/* Stats Widget */}
            <div className="widget widget-stats">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">&lt; 24hrs</div>
                  <div className="stat-label">Average Wait Time</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">98%</div>
                  <div className="stat-label">Patient Satisfaction</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">15min</div>
                  <div className="stat-label">Avg Consultation</div>
                </div>
              </div>
            </div>

            {/* Feature List Widget */}
            <div className="widget widget-features">
              <h4 className="widget-title-sm">What&apos;s Included</h4>
              <ul className="feature-list">
                {["Comprehensive blood panel", "45-minute consultation", "Personalized health plan", "6-month follow-up included"].map((item) => (
                  <li key={item} className="feature-item">
                    <svg className="icon icon-sm" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Widget */}
            <div className="widget widget-contact">
              <h4 className="widget-title-sm">Get in Touch</h4>
              <div className="contact-item">
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>020 1234 5678</span>
              </div>
              <div className="contact-item">
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>hello@cocoon.health</span>
              </div>
              <div className="contact-item">
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>London, UK</span>
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="widget widget-newsletter">
              <h4 className="widget-title-sm">Stay Informed</h4>
              <p className="widget-description-sm">Get health insights and updates delivered to your inbox.</p>
              <div className="newsletter-form">
                <input type="email" className="form-input" placeholder="your.email@example.com" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Form Component ═══════════ */}
      <SectionBar name="Form Component" id={SECTION_IDS["Form Component"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Form Component"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Form Component</h2>
          <p className="ds-section-description">
            Figma v1-inspired contact form with underlined inputs, minimal styling, and elegant typography.
          </p>
          <div style={{ background: "var(--color-primary)", padding: "var(--space-8)", marginTop: "1.25rem" }}>
            <div className="form-modal" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="form-header">
                <h3 className="form-title">Fill out the form below for more information.</h3>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">FIRST NAME*</label>
                    <input type="text" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LAST NAME*</label>
                    <input type="text" className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">EMAIL*</label>
                  <input type="email" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">PHONE*</label>
                  <div className="form-phone-group">
                    <div className="form-prefix">UK: +44</div>
                    <input type="tel" className="form-input" />
                  </div>
                </div>
                <div className="form-consent">
                  <div className="form-checkbox-group">
                    <div className="form-checkbox-wrapper">
                      <input type="checkbox" className="form-checkbox" />
                      <label className="checkbox-label">I consent to receive marketing communications from Cocoon Healthcare.</label>
                    </div>
                  </div>
                </div>
                <button type="button" className="form-submit">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Form Elements ═══════════ */}
      <SectionBar name="Form Elements" id={SECTION_IDS["Form Elements"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Form Elements"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Form Elements</h2>
          <p className="ds-section-description">Clean, accessible form components with clear labels and helpful states.</p>
          <div className="form-demo" style={{ marginTop: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Enter your full name" />
              <div className="form-helper">As it appears on your medical records</div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your.email@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Select Service</label>
              <select className="form-select">
                <option>Comprehensive Health Assessment</option>
                <option>Male Health Screening</option>
                <option>Female Wellness Package</option>
                <option>Preventative Care Consultation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-textarea" placeholder="Any specific health concerns or questions..." />
            </div>
            <div className="form-group">
              <div className="form-check">
                <input type="checkbox" />
                <label>I agree to the privacy policy and terms of service</label>
              </div>
            </div>
            <button className="btn btn-primary btn-lg">Submit Enquiry</button>
          </div>
        </div>
      </section>

      {/* ═══════════ Breadcrumb Navigation ═══════════ */}
      <SectionBar name="Breadcrumb" id={SECTION_IDS["Breadcrumb"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Breadcrumb"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Breadcrumb Navigation</h2>
          <p className="ds-section-description">Breadcrumb trail for product and service pages. Uses uppercase Inter with slash separators.</p>
          <div style={{ padding: "var(--space-6)", background: "var(--color-background)", marginTop: "1.25rem" }}>
            <nav className="breadcrumb">
              <a href="#">HOME</a>
              <span className="breadcrumb-sep">/</span>
              <a href="#">SERVICES</a>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">MALE HEALTH SCREENING</span>
            </nav>
          </div>
        </div>
      </section>

      {/* ═══════════ Process Timeline ═══════════ */}
      <SectionBar name="Process Timeline" id={SECTION_IDS["Process Timeline"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Process Timeline"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Process Timeline</h2>
          <p className="ds-section-description">Vertical numbered timeline for showing step-by-step processes. Used for &ldquo;What to Expect&rdquo; sections.</p>
          <div style={{ padding: "var(--space-10) var(--space-6)", background: "var(--color-background)", marginTop: "1.25rem" }}>
            <div className="timeline">
              <div className="timeline-step">
                <div className="timeline-number">1</div>
                <div className="timeline-content">
                  <h4 className="timeline-step-title">Book Your Appointment</h4>
                  <p className="timeline-step-desc">Choose a convenient date and time. We&apos;ll send you a pre-screening questionnaire to complete at home.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-number">2</div>
                <div className="timeline-content">
                  <h4 className="timeline-step-title">Your Screening Day</h4>
                  <p className="timeline-step-desc">Arrive at our Harrogate clinic. Your dedicated clinician will guide you through each assessment.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-number">3</div>
                <div className="timeline-content">
                  <h4 className="timeline-step-title">Results &amp; Report</h4>
                  <p className="timeline-step-desc">Within 5 working days you&apos;ll receive a comprehensive health report with clear explanations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Persona Cards ═══════════ */}
      <SectionBar name="Persona Cards" id={SECTION_IDS["Persona Cards"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Persona Cards"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Persona Cards</h2>
          <p className="ds-section-description">Cards describing target audiences for a service. Each card has a Playfair Display title, description, and Deep Green left border accent.</p>
          <div className="persona-grid" style={{ marginTop: "1.25rem" }}>
            <div className="persona-card">
              <h4 className="persona-title">The Busy Professional</h4>
              <p className="persona-desc">You&apos;re performing well, but you haven&apos;t stopped to check in with your body in years. This screening gives you a clear, data-driven picture of where you stand.</p>
            </div>
            <div className="persona-card">
              <h4 className="persona-title">The Health-Conscious Man</h4>
              <p className="persona-desc">You already eat well and exercise, but want clinical validation and insight into what bloodwork, heart health, and fitness metrics actually say about your longevity.</p>
            </div>
            <div className="persona-card">
              <h4 className="persona-title">The Milestone Marker</h4>
              <p className="persona-desc">Turning 40, 50, or starting a new chapter? This is the health reset you&apos;ve been meaning to book. Comprehensive, reassuring, and genuinely useful.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Booking Placeholder ═══════════ */}
      <SectionBar name="Booking Placeholder" id={SECTION_IDS["Booking Placeholder"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Booking Placeholder"])}`} style={{ padding: "0" }}>
        <div className="booking-section" style={{ padding: "var(--space-10) var(--space-6)" }}>
          <h2 className="booking-title">Book Your Screening</h2>
          <p className="booking-subtitle">Choose a date that works for you. Our Harrogate clinic is open Monday&ndash;Friday, with early morning slots available.</p>
          <div className="booking-embed-placeholder">
            <p>Online booking coming soon &mdash; Semble integration placeholder</p>
          </div>
          <div className="booking-fallback">
            <p className="booking-fallback-label">Prefer to book by phone or email?</p>
            <div className="booking-contact-options">
              <a href="tel:+441423000000" className="booking-contact-link">
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                01423 000 000
              </a>
              <a href="mailto:hello@cocoonhealth.co.uk" className="booking-contact-link">
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hello@cocoonhealth.co.uk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Included Grid ═══════════ */}
      <SectionBar name="Included Grid" id={SECTION_IDS["Included Grid"]}/>
      <section className={`ds-section section-bleed ${sectionTheme(themes["Included Grid"])}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Included Grid</h2>
          <p className="ds-section-description">A 4-column grid showing grouped service items. Used for &ldquo;What&apos;s Included&rdquo; sections on product pages.</p>
          <div style={{ padding: "var(--space-10) var(--space-6)", background: "var(--color-background)", marginTop: "1.25rem" }}>
            <div className="included-grid">
              <div className="included-category">
                <h4 className="included-category-title">Physical Assessment</h4>
                <ul className="included-list">
                  <li>Full cardiovascular check</li>
                  <li>Body composition analysis</li>
                  <li>Musculoskeletal screening</li>
                </ul>
              </div>
              <div className="included-category">
                <h4 className="included-category-title">Diagnostic Panels</h4>
                <ul className="included-list">
                  <li>Comprehensive blood panel</li>
                  <li>Hormonal profile</li>
                  <li>Metabolic markers</li>
                </ul>
              </div>
              <div className="included-category">
                <h4 className="included-category-title">Fitness &amp; Lifestyle</h4>
                <ul className="included-list">
                  <li>VO2 max estimation</li>
                  <li>Grip strength &amp; flexibility</li>
                  <li>Stress &amp; sleep assessment</li>
                </ul>
              </div>
              <div className="included-category">
                <h4 className="included-category-title">Consultation</h4>
                <ul className="included-list">
                  <li>GP-led results review</li>
                  <li>Personalised health plan</li>
                  <li>Follow-up guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Service/Product (original) ═══════════ */}
      <SectionBar name="Service / Product" id={SECTION_IDS["Service/Product"]} />
      <section
        className={`ds-section section-bleed ${sectionTheme(themes["Service/Product"])}`}
        style={{ padding: "2.5rem 0" }}
      >
        <div className="ds-container">
          <h2 className="ds-section-title">Service / Product Components</h2>
          <div className="product-header" style={{ marginTop: "1.25rem" }}>
            <div className="product-header-content">
              <span className="product-eyebrow">MEN&apos;S HEALTH</span>
              <h1 className="product-title">Male Health Screening</h1>
              <p className="product-tagline">
                A complete view of your health and wellbeing
              </p>
              <div className="product-price">&pound;950</div>
              <div className="product-meta">
                <span className="product-meta-item">2&ndash;3 HOURS</span>
                <span className="product-meta-item">IN-PERSON, HARROGATE</span>
              </div>
              <a href="#" className="product-cta">
                BOOK THIS SCREENING
              </a>
            </div>
            <div className="product-header-image">
              <img src="/images/team_inside.jpg" alt="Product Header" />
            </div>
          </div>
          <div className="faq-list" style={{ marginTop: "1.25rem" }}>
            {faqItems.map((item, i) => (
              <div
                key={item.q}
                className={`faq-item ${activeFaq === i ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {item.q}
                  <span>{activeFaq === i ? "\u2212" : "+"}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Foundations (Buttons) ═══════════ */}
      <SectionBar name="Foundations" id={SECTION_IDS["Foundations"]} />
      <section
        className={`ds-section section-bleed ${sectionTheme(themes["Foundations"])}`}
        style={{ padding: "2.5rem 0" }}
      >
        <div className="ds-container">
          <h2 className="ds-section-title">Foundational UI Elements</h2>
          <div className="button-grid" style={{ marginTop: "0.75rem" }}>
            <div className="button-demo">
              <div className="button-label">Primary</div>
              <button className="btn btn-primary">Book Consultation</button>
            </div>
            <div className="button-demo">
              <div className="button-label">Secondary</div>
              <button className="btn btn-secondary">Explore Services</button>
            </div>
            <div className="button-demo">
              <div className="button-label">Tertiary</div>
              <button className="btn btn-tertiary">Learn More</button>
            </div>
            <div className="button-demo">
              <div className="button-label">Disabled</div>
              <button className="btn btn-primary" disabled>
                Unavailable
              </button>
            </div>
            <div className="button-demo">
              <div className="button-label">Large Primary</div>
              <button className="btn btn-primary btn-lg">Get Started</button>
            </div>
            <div className="button-demo">
              <div className="button-label">Small Secondary</div>
              <button className="btn btn-secondary btn-sm">View Details</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Mega Footer ═══════════ */}
      <SectionBar name="Mega Footer" id={SECTION_IDS["Mega Footer"]} />
      <footer className="footer">
        <div className="footer-cta">
          <h2 className="footer-cta-title">Ready to take control of your health?</h2>
          <p className="footer-cta-subtitle">Join thousands who trust Cocoon for proactive, personalized healthcare.</p>
          <form className="footer-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your.email@example.com" className="footer-cta-input" />
            <button type="submit" className="btn btn-primary">Get Started</button>
          </form>
        </div>
        <div className="footer-nav">
          <div className="footer-columns">
            <div className="footer-column">
              <div className="footer-logo" style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.75rem" }}>
                COCOON
              </div>
              <p className="footer-tagline">A proactive, human-first approach to health and wellness. Built on trust. Designed for life.</p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg className="icon" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg className="icon" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg className="icon" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Services</h3>
              <ul className="footer-links">
                <li><a href="#">Health Assessments</a></li>
                <li><a href="#">Blood Testing</a></li>
                <li><a href="#">GP Consultations</a></li>
                <li><a href="#">Women&apos;s Health</a></li>
                <li><a href="#">Men&apos;s Health</a></li>
                <li><a href="#">Mental Wellness</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li><a href="#">About Cocoon</a></li>
                <li><a href="#">Our Clinicians</a></li>
                <li><a href="#">Membership</a></li>
                <li><a href="#">Locations</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-links">
                <li><a href="#">Health Library</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Appointment Booking</a></li>
                <li><a href="#">Patient Portal</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-legal">&copy; 2024 Cocoon Healthcare. All rights reserved. Registered in England &amp; Wales. CQC Registered.</p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════ Signature Footer (CTA block) ═══════════ */}
      <SectionBar name="Signature Footer" id="section-footer" />
      <SignatureFooter
        data={{
          backgroundColor: "green",
          eyebrow: "Final CTA",
          headline: "Your health deserves *more than guesswork*",
          buttonPrimaryText: "BOOK SCREENING",
          buttonPrimaryUrl: "/book-visit",
          buttonSecondaryText: "CONTACT TEAM",
          buttonSecondaryUrl: "/contact",
        }}
      />

      {/* ─── Image Focal Points ─── */}
      <SectionBar name="Image Focal Points" id="section-focal-points" />
      <section className={`ds-section section-bleed ${sectionTheme(themes["Image Focal Points"] || "off-white")}`} style={{ padding: "2.5rem 0" }}>
        <div className="ds-container">
          <h2 className="ds-section-title">Image Focal Points</h2>
          <p className="ds-section-description" style={{ marginBottom: "1.5rem" }}>
            Apply these classes to any image with <code>object-fit: cover</code> to control where the crop focuses. Click to switch classes.
          </p>
          <FocalPointDemo />
        </div>
      </section>

      {/* ─── Template Links ─── */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-accent, sans-serif)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1rem",
          }}
        >
          See these components in action
        </div>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Service Page", href: "/design-system/templates/service-page" },
            { label: "Membership", href: "/design-system/templates/membership-details" },
            { label: "Category Home", href: "/design-system/templates/category-home" },
            { label: "Blog Post", href: "/design-system/templates/blog-post" },
          ].map((t) => (
            <a
              key={t.href}
              href={t.href}
              style={{
                fontFamily: "var(--font-accent, sans-serif)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#E8DFD0",
                textDecoration: "none",
                padding: "0.6rem 1.5rem",
                border: "1px solid rgba(232,223,208,0.3)",
              }}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
