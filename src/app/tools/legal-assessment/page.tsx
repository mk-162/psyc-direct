import { Metadata } from 'next';
import { SITE_URL } from '@/lib/tina-page-helpers';
import { LegalAssessmentTool } from '@/components/tools/LegalAssessmentTool';

export const metadata: Metadata = {
  title: 'Expert Witness Case Assessment | Free Legal Assessment Tool | Psychology Direct',
  description: 'Answer four quick questions to find out whether your case needs a psychological or psychiatric expert witness — with legal citations and a 24-hour expert match.',
  alternates: { canonical: `${SITE_URL}/tools/legal-assessment/` },
};

export default function LegalAssessmentPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="py-12 sm:py-16"
        style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--brand-azure-light)] text-xs font-semibold uppercase tracking-widest mb-3">
            Free Tool · 3 minutes
          </p>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Does Your Case Need Expert Evidence?
          </h1>
          <p className="text-[var(--brand-azure-light)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Four steps to find out whether you need a psychological or psychiatric expert witness — with the legal basis for your case type.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <LegalAssessmentTool />
      </section>
    </>
  );
}
