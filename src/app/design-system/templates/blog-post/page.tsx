import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Template | Design System",
};

export default function BlogPostTemplate() {
  return (
    <main>
      <header className="standard-header" style={{ paddingTop: '8rem' }}>
        <span className="page-eyebrow">Founder&apos;s Letter</span>
        <h1 className="page-title" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>The Cocoon Philosophy</h1>
        <p className="page-description" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-lg)' }}>
          Why we decided to build a clinic that doesn&apos;t wait for you to get sick.
        </p>
      </header>

      <div className="ds-container" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: 'var(--space-20)' }}>
        <div className="standard-header-image" style={{ marginBottom: 'var(--space-16)' }}>
            <img src="/images/team_inside.jpg" alt="Cocoon Founders" />
        </div>

        <div className="editorial-content" style={{ fontSize: 'var(--text-lg)', lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
          <p style={{ marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: '3rem', float: 'left', lineHeight: '0.8', paddingRight: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-terracotta)' }}>F</span>or too long, healthcare has been entirely reactive. We wait until something is broken, until pain is unbearable, or until a routine check uncovers a problem that has been quietly developing for years.
          </p>

          <p style={{ marginBottom: 'var(--space-6)' }}>
            When we started Cocoon, we asked a simple question: What if we treated our bodies with the same proactive care and attention that we give to our careers, our homes, and our vehicles?
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-primary)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-6)', fontWeight: '300' }}>
            A New Standard of Care
          </h2>

          <p style={{ marginBottom: 'var(--space-6)' }}>
            It is not enough to simply run tests and hand over results. True care involves time, empathy, and explanation. It involves a relationship between doctor and patient that spans years, not mere minutes.
          </p>

          <div className="quote-text" style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: 'var(--space-12) 0' }}>
            &quot;Our goal isn&apos;t just to add years to your life, but to add life to your years.&quot;
            <div className="quote-attribution" style={{ marginTop: 'var(--space-4)' }}>- Dr. Penny</div>
          </div>

          <p style={{ marginBottom: 'var(--space-6)' }}>
            This is the foundation of the Cocoon difference. It is an investment in your future self. We look forward to welcoming you.
          </p>
        </div>
      </div>
    </main>
  );
}