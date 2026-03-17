import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Details Template | Design System",
};

export default function MembershipDetailsTemplate() {
  return (
    <main>
      <header className="hero-header" style={{ backgroundImage: "linear-gradient(180deg, rgba(42, 36, 24, 0.4) 0%, rgba(42, 36, 24, 0.6) 100%), url('/images/team_outside_2.jpg')" }}>
        <div className="hero-content">
          <span className="hero-eyebrow">Membership Tier</span>
          <h1 className="hero-title">Premier Membership</h1>
          <p className="hero-subtitle">
            Unrestricted access to our highest level of preventative care, unlimited appointments, and personalized health orchestration.
          </p>
          <div className="hero-actions">
            <Link href="/book-visit" className="btn btn-primary btn-lg" style={{ color: "var(--color-background)", borderBottomColor: "var(--color-background)" }}>
              Apply for Membership
            </Link>
          </div>
        </div>
      </header>

      <section className="ds-section section-bleed">
        <div className="ds-container">
          <h2 className="ds-section-title">The Foundation of Health</h2>
          <p className="ds-section-description">
            Experience healthcare that doesn&apos;t wait for symptoms. The Premier Membership gives you direct, unhurried access to your dedicated physician.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-8)" }}>
             <div className="info-box-warm">
                <h3 className="info-title">Annual Investment</h3>
                <p className="info-text" style={{ fontSize: "var(--text-3xl)", color: "var(--color-terracotta)", marginBottom: "var(--space-2)" }}>£5,500</p>
                <p className="info-text" style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Per Person / Per Year</p>
             </div>
             
             <div className="highlight-box-sage">
                <div className="highlight-number">24/7</div>
                <div className="highlight-label">Direct Doctor Access</div>
             </div>
          </div>
        </div>
      </section>

      <section className="ds-section section-bleed section-deep-green">
        <div className="ds-container">
          <h2 className="ds-section-title">Membership Benefits</h2>
          <p className="ds-section-description">
            What is included in the Premier tier.
          </p>

          <div className="cards-grid">
            <div className="card" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="card-content" style={{ padding: "var(--space-8)" }}>
                <h3 className="card-title" style={{ color: "var(--color-background)" }}>Unlimited Consultations</h3>
                <p className="card-description" style={{ color: "rgba(255,255,255,0.7)" }}>See your doctor as often as needed, with extended 30-60 minute appointments as standard, both in-clinic and virtually.</p>
              </div>
            </div>
            
            <div className="card" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="card-content" style={{ padding: "var(--space-8)" }}>
                <h3 className="card-title" style={{ color: "var(--color-background)" }}>Advanced Annual Medical</h3>
                <p className="card-description" style={{ color: "rgba(255,255,255,0.7)" }}>Our most comprehensive half-day health assessment, including advanced diagnostics, cardiac screening, and genetic profiling.</p>
              </div>
            </div>

            <div className="card" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="card-content" style={{ padding: "var(--space-8)" }}>
                <h3 className="card-title" style={{ color: "var(--color-background)" }}>Health Orchestration</h3>
                <p className="card-description" style={{ color: "rgba(255,255,255,0.7)" }}>Dedicated administrative support to manage specialist referrals, hospital admissions, and international medical coordination.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}