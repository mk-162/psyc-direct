import { SiteHeader } from "@/components/site-header";
import { Phone, Mail, MapPin } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-[#032552] dark:bg-[#021b3d] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3" data-testid="text-privacy-heading">
            Privacy Policy
          </h1>
          <p className="text-[#cee4f7] text-base">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>

      <article className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground dark:prose-invert" data-testid="privacy-content">
          <h2>1. Introduction</h2>
          <p>Psychology Direct ("we", "our", "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          <p>Psychology Direct is registered in England and Wales (Company Reg. 07008023). For the purposes of applicable data protection legislation, the data controller is Psychology Direct.</p>

          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <h3>Information you provide to us</h3>
          <ul>
            <li>Name, email address, telephone number, and postal address</li>
            <li>Company or organisation name and job title</li>
            <li>Details of your enquiry or case requirements</li>
            <li>Payment and billing information</li>
            <li>Any other information you choose to provide via forms, email, or telephone</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>IP address and browser type</li>
            <li>Pages visited, time spent on pages, and navigation paths</li>
            <li>Referring website or source</li>
            <li>Device type and operating system</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your enquiries and provide our services</li>
            <li>Match you with appropriate psychological experts</li>
            <li>Manage and administer your case</li>
            <li>Send you relevant updates about your case or our services</li>
            <li>Improve our website, services, and user experience</li>
            <li>Comply with legal and regulatory obligations</li>
            <li>Send marketing communications where you have given consent</li>
          </ul>

          <h2>4. Legal Basis for Processing</h2>
          <p>We process your personal data on the following legal bases:</p>
          <ul>
            <li><strong>Consent:</strong> Where you have given clear consent for us to process your data for a specific purpose</li>
            <li><strong>Contract:</strong> Where processing is necessary for a contract we have with you or to take steps at your request before entering a contract</li>
            <li><strong>Legitimate interests:</strong> Where processing is necessary for our legitimate interests and does not override your rights</li>
            <li><strong>Legal obligation:</strong> Where processing is necessary to comply with the law</li>
          </ul>

          <h2>5. Data Sharing</h2>
          <p>We may share your personal information with:</p>
          <ul>
            <li>Psychologists and psychiatrists in our network, where necessary to fulfil your case requirements</li>
            <li>Service providers who assist in operating our website and delivering our services</li>
            <li>Professional advisors such as lawyers, auditors, and insurers</li>
            <li>Regulatory bodies or law enforcement agencies where required by law</li>
          </ul>
          <p>We will never sell your personal information to third parties.</p>

          <h2>6. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. For case-related data, we typically retain records for a minimum of 6 years following the conclusion of a case, in line with professional and regulatory requirements.</p>

          <h2>7. Your Rights</h2>
          <p>Under applicable data protection legislation, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability — receive your data in a structured, machine-readable format</li>
            <li>Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details below.</p>

          <h2>8. Cookies</h2>
          <p>Our website uses cookies to distinguish you from other users and to improve your experience. Cookies are small text files placed on your device. We use the following types:</p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
          </ul>
          <p>You can manage your cookie preferences through your browser settings.</p>

          <h2>9. Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li>Email: info@psychologydirect.co.uk</li>
            <li>Phone: 01306 879 075</li>
            <li>Post: Psychology Direct, United Kingdom</li>
          </ul>
          <p>You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data has been handled unlawfully.</p>
        </div>
      </article>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/images/logo.png" alt="Psychology Direct" className="h-8 w-auto brightness-0 invert" />
          <p className="text-[#cee4f7]/50 text-xs">
            &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
