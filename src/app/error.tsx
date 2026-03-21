'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section
      className="min-h-[60vh] flex items-center justify-center"
      style={{ background: 'var(--brand-bg-tint)' }}
    >
      <div className="text-center px-4 max-w-lg">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          We&apos;re experiencing a temporary issue. Please try again or call us on{' '}
          <a href="tel:01306879975" className="font-semibold" style={{ color: 'var(--brand-azure-vivid)' }}>
            01306 879 975
          </a>.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-md text-white font-semibold"
          style={{ background: 'var(--brand-navy)' }}
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
