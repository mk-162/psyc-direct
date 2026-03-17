import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="ds-section section-bleed section-mineral-white theme-light not-found-section">
        <div className="container-narrow not-found-container">
          <p className="body-editorial not-found-eyebrow">
            Page not found
          </p>
          <h1 className="heading-display-lg not-found-title">
            We can&apos;t find that page
          </h1>
          <p className="body-editorial not-found-body">
            The page you&apos;re looking for may have moved or no longer exists.
            Let us help you find what you need.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link href="/services" className="btn btn-secondary">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
