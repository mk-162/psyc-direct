import type { Metadata, Viewport } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import { getNavigation, getGlobalSettings } from "@/lib/markdown";
import { MobileNav } from "@/components/MobileNav";
import { DesktopNav } from "@/components/DesktopNav";
import { CookieBanner } from "@/components/CookieBanner";

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
  metadataBase: new URL("https://www.psychologydirect.co.uk"),
  title: "Psychology Direct | Expert Witness & Educational Psychologists",
  description: "Fast, reliable access to HCPC-registered psychologists and psychiatrists for legal, education, and professional services across the UK.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "66x66", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    siteName: "Psychology Direct",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Psychology Direct — Expert Witness & Educational Psychologists" }],
  },
  twitter: {
    card: "summary_large_image",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
                "@id": "https://www.psychologydirect.co.uk/#organization",
                name: "Psychology Direct",
                url: "https://www.psychologydirect.co.uk",
                logo: "https://www.psychologydirect.co.uk/images/logo.png",
                image: "https://www.psychologydirect.co.uk/images/og-default.jpg",
                description: "Fast, reliable access to HCPC-registered psychologists and psychiatrists for legal, education, and professional services across the UK.",
                telephone: "+441306879975",
                email: "enquiries@psychologydirect.co.uk",
                address: { "@type": "PostalAddress", postOfficeBoxNumber: "497", addressLocality: "Leatherhead", addressRegion: "Surrey", postalCode: "KT22 2PD", addressCountry: "GB" },
                areaServed: { "@type": "Country", name: "United Kingdom" },
                sameAs: ["https://www.linkedin.com/company/psychology-direct/"],
                foundingDate: "2009",
                priceRange: "$$",
                knowsAbout: ["Expert Witness Psychology", "Expert Witness Psychiatry", "Educational Psychology", "EHCP Assessments", "Medico-Legal Reports"],
              },
              {
                "@type": "WebSite",
                "@id": "https://www.psychologydirect.co.uk/#website",
                url: "https://www.psychologydirect.co.uk",
                name: "Psychology Direct",
                publisher: { "@id": "https://www.psychologydirect.co.uk/#organization" },
              },
            ],
          }) }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--brand-navy)] focus:rounded-md focus:shadow-lg focus:font-semibold focus:text-sm">
          Skip to main content
        </a>
        {/* Utility ribbon — scrolls away with page */}
        <div className="hidden sm:block" style={{ background: 'var(--brand-navy)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8 text-xs">
            <span className="text-white/70 text-xs">Find Psychologists and Psychiatrists</span>
            <div className="flex items-center gap-4">
            <a
              href="https://psychologydirect.zohocreatorportal.eu/"
              className="text-white/70 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Associate Portal
            </a>
            <a
              href="https://accounts.zoho.eu/signin?servicename=ZohoProjects&signupurl=https://www.zoho.eu/projects/signup.html"
              className="text-white/70 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Client Login
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="font-semibold text-white hover:text-white/80 transition-colors"
            >
              {phone}
            </a>
            </div>
          </div>
        </div>
        <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center">
              <Image
                src="/images/logo-header.png"
                alt="Psychology Direct"
                width={153}
                height={34}
                priority
              />
            </a>
            <div className="flex items-center gap-1">
              <DesktopNav items={(navigation?.mainNav ?? []).filter((item: any) => ['Expert Witness', 'Education', 'About'].includes(item.label))} />
              <a
                href="/contact/"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white ml-2"
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
            {/* Accreditations & Award */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <a href="https://www.bps.org.uk/" target="_blank" rel="nofollow noopener noreferrer" className="block rounded-md bg-white p-2 opacity-90 hover:opacity-100 transition-opacity">
                  <Image src="/images/accreditations/bps-logo.png" alt="British Psychological Society" width={72} height={52} />
                </a>
                <a href="https://www.hcpc-uk.org/" target="_blank" rel="nofollow noopener noreferrer" className="block rounded-md bg-white p-2 opacity-90 hover:opacity-100 transition-opacity">
                  <Image src="/images/accreditations/hcpc-logo.png" alt="Health and Care Professions Council" width={64} height={66} />
                </a>
              </div>
              <div className="rounded-md bg-white p-2 opacity-90">
                <Image src="/images/accreditations/award-logo.png" alt="SME Surrey Business Awards 2024 Gold Winner" width={100} height={100} />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 text-xs opacity-70 flex flex-col sm:flex-row justify-between gap-3">
              <span>© {new Date().getFullYear()} Psychology Direct Ltd. All rights reserved.</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {navigation?.footerLegal?.map((link: any) => (
                  <a key={link.url} href={link.url} className="hover:opacity-100 transition-opacity">{link.label}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
        <CookieBanner />
      </body>
    </html>
  );
}
