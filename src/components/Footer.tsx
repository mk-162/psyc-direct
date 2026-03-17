"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NavigationData, GlobalSettings } from "@/lib/types";
import { defaultNavigation, defaultSettings } from "@/lib/defaults";
import { trackFormSubmission } from "@/lib/analytics";

interface FooterProps {
  navigation?: NavigationData;
  settings?: GlobalSettings;
}

export default function Footer({ navigation, settings }: FooterProps = {}) {
  const [footerEmail, setFooterEmail] = useState("");
  const [footerStatus, setFooterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const nav = navigation || defaultNavigation;
  const siteSettings = settings || defaultSettings;

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Website Visitor", email: footerEmail, message: "Enquiry from footer signup form — please get in touch." }),
      });
      if (!res.ok) throw new Error();
      trackFormSubmission("footer_signup");
      setFooterStatus("success");
    } catch {
      setFooterStatus("error");
    }
  };

  return (
    <footer className="footer">
      {/* CTA Section */}
      <div className="footer-cta">
        <h2 className="footer-cta-title">Start Your Journey Today</h2>
        <p className="footer-cta-subtitle">Book a consultation and discover proactive healthcare designed around you.</p>
        {footerStatus === "success" ? (
          <p className="body-editorial footer-cta-success">Thank you — we&apos;ll be in touch soon.</p>
        ) : (
          <form className="footer-cta-form" onSubmit={handleFooterSubmit}>
            <input type="email" className="footer-cta-input" placeholder="Your email address" required value={footerEmail} onChange={e => setFooterEmail(e.target.value)} disabled={footerStatus === "submitting"} />
            <button type="submit" className="footer-cta-btn" disabled={footerStatus === "submitting"}>
              {footerStatus === "submitting" ? "Sending..." : footerStatus === "error" ? "Try Again" : "Get Started"}
            </button>
          </form>
        )}
      </div>

      {/* Navigation Columns */}
      <div className="footer-nav">
        <div className="footer-columns">
          {nav.footerNav?.map((column, index) => (
            <div key={index} className="footer-column">
              <h4>{column.title}</h4>
              <ul className="footer-links">
                {column.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column - Always shown */}
          <div className="footer-column">
            <h4>Get in Touch</h4>
            <ul className="footer-links">
              {siteSettings.site?.phone && (
                <li><a href={`tel:${siteSettings.site.phone.replace(/\s/g, '')}`}>{siteSettings.site.phone}</a></li>
              )}
              {siteSettings.site?.email && (
                <li><a href={`mailto:${siteSettings.site.email}`}>{siteSettings.site.email}</a></li>
              )}
              <li><Link href="/utility/contact">Contact Form</Link></li>
            </ul>
            <div className="footer-social">
              {siteSettings.social?.instagram && (
                <a href={siteSettings.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {siteSettings.social?.linkedin && (
                <a href={siteSettings.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              )}
              {siteSettings.social?.twitter && (
                <a href={siteSettings.social.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            <div className="footer-logo">
              <img 
                src="/cocoon-logo-white.svg" 
                alt="Cocoon" 
                className="footer-logo-img"
              />
            </div>
            <p className="footer-copyright">© {currentYear} {siteSettings.site?.name || 'Cocoon Wellness'}. All rights reserved.</p>
          </div>
          <ul className="footer-legal">
            <li><Link href="/utility/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/utility/terms-and-conditions">Terms of Service</Link></li>
            <li><Link href="/utility/cookie-policy">Cookie Policy</Link></li>
            <li><Link href="/utility/accessibility-statement">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
