import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { getNavigation, getGlobalSettings } from "@/lib/markdown";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Psychology Direct | Expert Witness & Educational Psychologists",
  description: "Fast, reliable access to HCPC-registered psychologists and psychiatrists for legal, education, and professional services across the UK.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getNavigation();
  const settings = getGlobalSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>
              {settings?.site?.name || 'Psychology Direct'}
            </a>
            <nav className="hidden md:flex items-center gap-6">
              {navigation?.mainNav?.map((item: any) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="/contact/"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white"
              style={{ background: 'var(--brand-navy)' }}
            >
              Get in Touch
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border mt-16" style={{ background: 'var(--brand-navy)', color: 'white' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {navigation?.footerNav?.map((col: any) => (
                <div key={col.title}>
                  <h3 className="text-sm font-semibold mb-4 opacity-70 uppercase tracking-wider">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links?.map((link: any) => (
                      <li key={link.url}>
                        <a href={link.url} className="text-sm opacity-80 hover:opacity-100 transition-opacity">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-sm opacity-60 flex flex-col sm:flex-row justify-between gap-2">
              <span>© {new Date().getFullYear()} Psychology Direct Ltd. All rights reserved.</span>
              <span>Tel: {settings?.site?.phone || '01306 879 975'} | {settings?.site?.email || 'enquiries@psychologydirect.co.uk'}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
