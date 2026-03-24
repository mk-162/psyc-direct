import { Metadata } from 'next';
import { SITE_URL } from '@/lib/tina-page-helpers';
import { PsychOrPsychiatrist } from '@/components/tools/PsychOrPsychiatrist';

export const metadata: Metadata = {
  title: 'Psychologist or Psychiatrist? | Free Expert Selector | Psychology Direct',
  description: 'Not sure whether your case needs a psychologist or psychiatrist? Answer three questions and get a clear recommendation with next steps.',
  alternates: { canonical: `${SITE_URL}/tools/psychologist-or-psychiatrist/` },
};

export default function PsychOrPsychiatristPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="py-12 sm:py-16"
        style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--brand-azure-light)] text-xs font-semibold uppercase tracking-widest mb-3">
            Free Tool · 2 minutes
          </p>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Psychologist or Psychiatrist?
          </h1>
          <p className="text-[var(--brand-azure-light)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Three questions to identify the right type of expert for your case — with the key differences explained at each step.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <PsychOrPsychiatrist />
      </section>
    </>
  );
}
