import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category Home Template | Design System",
};

export default function CategoryHomeTemplate() {
  return (
    <main>
      <header className="minimal-header" style={{ padding: '8rem 0 4rem 0', backgroundColor: 'var(--color-warm-stone)' }}>
        <div className="ds-container">
          <h1 className="minimal-title">Wellness Services</h1>
          <p className="minimal-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            A proactive approach to health. Explore our comprehensive diagnostic, preventative, and specialized services.
          </p>
        </div>
      </header>

      <section className="ds-section section-bleed">
        <div className="ds-container">
          <div className="cards-grid">
            <Link href="/design-system/templates/service-page" className="card card-sage" style={{ textDecoration: 'none' }}>
              <div className="card-image">
                <img src="/images/alice_ultrasound_scan.jpg" alt="Scan" />
              </div>
              <div className="card-content">
                <span className="card-tag">Diagnostic</span>
                <h3 className="card-title">Comprehensive Scans</h3>
                <p className="card-description">
                  Advanced ultrasound and imaging for precise health insights.
                </p>
              </div>
            </Link>

            <Link href="/design-system/templates/service-page" className="card card-sage" style={{ textDecoration: 'none' }}>
              <div className="card-image">
                <img src="/images/kate_consultation.jpg" alt="Consultation" />
              </div>
              <div className="card-content">
                <span className="card-tag">Preventative</span>
                <h3 className="card-title">Annual Assessments</h3>
                <p className="card-description">
                  Full-body health checks tailored to your stage of life.
                </p>
              </div>
            </Link>

            <Link href="/design-system/templates/service-page" className="card card-sage" style={{ textDecoration: 'none' }}>
              <div className="card-image">
                <img src="/images/penny_consultation.jpg" alt="Consultation" />
              </div>
              <div className="card-content">
                <span className="card-tag">Specialist</span>
                <h3 className="card-title">Hormonal Health</h3>
                <p className="card-description">
                  Expert care for menopause, fertility, and hormonal balance.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="ds-section section-bleed section-sage">
         <div className="ds-container">
            <div className="widget-cta" style={{ background: 'transparent' }}>
               <h2 className="widget-title" style={{ color: 'var(--color-primary)' }}>Not Sure Where to Start?</h2>
               <p className="widget-description" style={{ color: 'var(--color-text-secondary)' }}>Book a discovery call with our care team to find the right pathway.</p>
               <Link href="/book-visit" className="btn btn-primary">Book Discovery Call</Link>
            </div>
         </div>
      </section>
    </main>
  );
}