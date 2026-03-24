import type { Metadata, Viewport } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import { getNavigation, getGlobalSettings } from "@/lib/markdown";
import { MobileNav } from "@/components/MobileNav";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

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
  openGraph: {
    siteName: "Psychology Direct",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getNavigation();
  const settings = getGlobalSettings();
  const phone = settings?.site?.phone || '01306 879 975';
  const email = settings?.site?.email || 'enquiries@psychologydirect.co.uk';

  return (
    <html lang="en" className={`${montserrat.variable} ${libreBaskerville.variable}`}>
      <head>
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--brand-navy)] focus:rounded-md focus:shadow-lg focus:font-semibold focus:text-sm">
          Skip to main content
        </a>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--brand-navy) 0%, var(--brand-azure-dark) 40%, var(--brand-azure) 100%)' }} />
        <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center">
              <Image
                src="/images/logo-header.png"
                alt="Psychology Direct"
                width={180}
                height={40}
                priority
              />
            </a>
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
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
            <div className="flex items-center gap-2">
              <a
                href="/contact/"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white"
                style={{ background: 'var(--brand-navy)' }}
              >
                Get in Touch
              </a>
              <MobileNav items={navigation?.mainNav ?? []} phone={phone} />
            </div>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="border-t border-border mt-16" style={{ background: 'var(--brand-navy)', color: 'white' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 pb-8 border-b border-white/10">
              <Image
                src="/images/logo-header.png"
                alt="Psychology Direct"
                width={160}
                height={36}
                className="brightness-0 invert opacity-90 mb-3"
              />
              <p className="text-sm text-white/60 max-w-md">
                Connecting solicitors, schools, and local authorities with vetted psychologists and psychiatrists since 2009.
              </p>
            </div>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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
            </nav>
            <div className="mt-8 pt-8 border-t border-white/20 text-sm opacity-80 flex flex-col sm:flex-row justify-between gap-2">
              <span>© {new Date().getFullYear()} Psychology Direct Ltd. All rights reserved.</span>
              <span>
                Tel: <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:opacity-100">{phone}</a>
                {' | '}
                <a href={`mailto:${email}`} className="hover:opacity-100">{email}</a>
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
