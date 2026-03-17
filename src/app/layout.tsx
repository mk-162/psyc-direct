import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Providers } from "@/components/Providers";
import { getNavigation, getGlobalSettings } from "@/lib/markdown";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Cocoon Healthcare - Premium Wellness & Preventive Health",
  description: "Proactive healthcare designed for life. Expert-led wellness services, personalised health screening, and longitudinal care that builds understanding over time.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch navigation and settings at build time
  const navigation = getNavigation();
  const settings = getGlobalSettings();

  return (
    <html lang="en">
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
        <Providers>
          <Header navigation={navigation} settings={settings} />
          {children}
          <CookieBanner />
          <Footer navigation={navigation} settings={settings} />
        </Providers>
      </body>
    </html>
  );
}
