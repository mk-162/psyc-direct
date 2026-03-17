import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="min-h-[50vh] flex items-center justify-center py-16">
        <div className="container text-center px-4 max-w-xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-azure)' }}>
            Page not found
          </p>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
            We can&apos;t find that page
          </h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for may have moved or no longer exists.
            Let us help you find what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-semibold"
              style={{ background: 'var(--brand-navy)' }}
            >
              Return Home
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
