"use client";

export default function BrandingBriefPage() {
  return (
    <main className="ds-container" style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <header className="ds-header">
        <h1>Branding Brief</h1>
        <p>
          Visual identity reference for Cocoon Wellness. Colour palette,
          typography scale, spacing system, responsive breakpoints, and
          iconography &mdash; all in one place.
        </p>
      </header>

      {/* ───────────── Color Palette ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Color Palette</h2>
        <p className="ds-section-description">
          Our color system is built on five carefully chosen colors that convey
          trust, calm, and clinical authority. Mineral White dominates, Deep
          Green anchors, and Terracotta accents sparingly.
        </p>

        <div className="color-grid">
          <div className="color-swatch color-deep-green">
            <div className="color-display">Primary</div>
            <div className="color-info">
              <div className="color-name">Deep Green</div>
              <div className="color-hex">#4B563B</div>
              <div className="color-usage">
                Primary CTAs, headers, trust elements, authority
              </div>
            </div>
          </div>

          <div className="color-swatch color-mineral-white">
            <div className="color-display">Background</div>
            <div className="color-info">
              <div className="color-name">Mineral White</div>
              <div className="color-hex">#F4F3EF</div>
              <div className="color-usage">
                Primary background, dominant color, clean spacious modern
              </div>
            </div>
          </div>

          <div className="color-swatch color-warm-stone">
            <div className="color-display">Secondary</div>
            <div className="color-info">
              <div className="color-name">Warm Stone</div>
              <div className="color-hex">#C6BEB4</div>
              <div className="color-usage">
                Subtle backgrounds, cards, borders, section divisions
              </div>
            </div>
          </div>

          <div className="color-swatch color-sage-green">
            <div className="color-display">Tertiary</div>
            <div className="color-info">
              <div className="color-name">Sage Green</div>
              <div className="color-hex">#B7B9AE</div>
              <div className="color-usage">
                Alternative backgrounds, subtle accents, sections
              </div>
            </div>
          </div>

          <div className="color-swatch color-terracotta">
            <div className="color-display">Accent</div>
            <div className="color-info">
              <div className="color-name">Terracotta</div>
              <div className="color-hex">#7A3E2D</div>
              <div className="color-usage">
                SPARINGLY for warmth &mdash; tags, small accents only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Typography Scale ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Typography Scale</h2>
        <p className="ds-section-description">
          Inter serves as our primary typeface for clarity and trust. Clean,
          readable, and professional across all sizes.
        </p>

        <div className="typography-scale">
          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 1 (Hero)</span>
              <span className="type-specs">Inter SemiBold / 72px / 1.1</span>
            </div>
            <div className="sample-h1">Healthcare designed for life</div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 2 (Page)</span>
              <span className="type-specs">Inter SemiBold / 56px / 1.2</span>
            </div>
            <div className="sample-h2">
              Proactive care that understands you
            </div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 3 (Section)</span>
              <span className="type-specs">Inter SemiBold / 40px / 1.3</span>
            </div>
            <div className="sample-h3">Comprehensive Health Assessment</div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 4</span>
              <span className="type-specs">Inter SemiBold / 32px / 1.3</span>
            </div>
            <div className="sample-h4">Our Services &amp; Approach</div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 5</span>
              <span className="type-specs">Inter SemiBold / 24px / 1.4</span>
            </div>
            <div className="sample-h5">
              What&apos;s Included in Your Visit
            </div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Heading 6</span>
              <span className="type-specs">Inter SemiBold / 20px / 1.4</span>
            </div>
            <div className="sample-h6">Frequently Asked Questions</div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Body Text</span>
              <span className="type-specs">Inter Regular / 18px / 1.6</span>
            </div>
            <div className="sample-body">
              Our proactive healthcare platform combines clinician-led care with
              thoughtful design and intelligence that works quietly in the
              background. We believe care should feel calm, personal, and
              continuous.
            </div>
          </div>

          <div className="type-sample">
            <div className="type-meta">
              <span className="type-label">Small Text</span>
              <span className="type-specs">Inter Regular / 14px / 1.5</span>
            </div>
            <div className="sample-small">
              Available Monday-Friday, 9am-5pm. Same-day appointments often
              available.
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Emotional Typography ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Emotional Typography</h2>
        <p className="ds-section-description">
          Playfair Display is reserved exclusively for emotional moments:
          testimonials, pull quotes, and moments that require warmth and
          humanity. Never use for navigation, CTAs, or body text. This creates
          contrast with our clinical Inter font.
        </p>

        <div className="emotional-type">
          <blockquote className="quote-text">
            &ldquo;True health is not merely the absence of disease, but a state
            of complete physical, mental, and social vitality.&rdquo;
          </blockquote>
          <cite className="quote-attribution">The Cocoon Philosophy</cite>
        </div>

        <div className="typography-note">
          <p>
            <strong>Usage:</strong> Use Playfair Display only for patient
            testimonials, philosophical quotes, and emotional storytelling. The
            serif style creates warmth and humanity in contrast to our primary
            Inter typeface.
          </p>
        </div>
      </section>

      {/* ───────────── Spacing System ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Spacing System</h2>
        <p className="ds-section-description">
          Consistent spacing scale based on 4px increments for harmonious
          layouts.
        </p>

        <div className="spacing-grid">
          {[
            { token: "--space-1", px: 4 },
            { token: "--space-2", px: 8 },
            { token: "--space-3", px: 12 },
            { token: "--space-4", px: 16 },
            { token: "--space-6", px: 24 },
            { token: "--space-8", px: 32 },
            { token: "--space-10", px: 40 },
            { token: "--space-12", px: 48 },
            { token: "--space-16", px: 64 },
          ].map(({ token, px }) => (
            <div key={token} className="spacing-item">
              <span className="spacing-label">{token}</span>
              <div className="spacing-visual" style={{ width: `${px}px` }} />
              <span className="spacing-value">{px}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Responsive Breakpoints ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Responsive Breakpoints</h2>
        <p className="ds-section-description">
          Mobile-first responsive design with logical breakpoints for all common
          screen sizes.
        </p>

        <div className="typography-scale">
          {[
            {
              label: "Mobile",
              specs: "375px – 767px (default)",
              desc: "Single column layout, stacked components, mobile-optimized spacing",
            },
            {
              label: "Tablet",
              specs: "768px – 1023px",
              desc: "Two-column grids, expanded navigation, medium spacing",
            },
            {
              label: "Desktop",
              specs: "1024px – 1439px",
              desc: "Three-column grids, full navigation, generous spacing",
            },
            {
              label: "Large Desktop",
              specs: "1440px+",
              desc: "Four+ column grids, maximum content width, optimal spacing",
            },
          ].map(({ label, specs, desc }) => (
            <div key={label} className="type-sample">
              <div className="type-meta">
                <span className="type-label">{label}</span>
                <span className="type-specs">{specs}</span>
              </div>
              <div className="sample-body">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Icons ───────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">Icons</h2>
        <p className="ds-section-description">
          Simple, minimal healthcare icons in our Deep Green.
        </p>

        <div className="icon-grid">
          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="icon-label">Heart</span>
          </div>

          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="icon-label">Calendar</span>
          </div>

          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="icon-label">Shield</span>
          </div>

          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="icon-label">Help</span>
          </div>

          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="icon-label">User</span>
          </div>

          <div className="icon-demo">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="icon-label">Home</span>
          </div>
        </div>
      </section>
    </main>
  );
}
