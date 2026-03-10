import { SiteHeader } from "@/components/site-header";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-[#032552] dark:bg-[#021b3d] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3" data-testid="text-terms-heading">
            Terms of Service
          </h1>
          <p className="text-[#cee4f7] text-base">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>

      <article className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground dark:prose-invert" data-testid="terms-content">
          <h2>1. Introduction</h2>
          <p>These Terms of Service ("Terms") govern your use of the Psychology Direct website and services. By accessing our website or engaging our services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.</p>
          <p>Psychology Direct is a trading name registered in England and Wales (Company Reg. 07008023).</p>

          <h2>2. Our Services</h2>
          <p>Psychology Direct provides a matching and management service connecting legal professionals with qualified psychologists and psychiatrists for expert witness and medico-legal work. Our services include:</p>
          <ul>
            <li>Matching solicitors, insurers, and other legal professionals with appropriate psychological experts</li>
            <li>Administrative management of case instructions and assessments</li>
            <li>Quality assurance and review of expert reports</li>
            <li>Coordination of assessments, scheduling, and correspondence</li>
          </ul>
          <p>Psychology Direct acts as an intermediary. The psychologists and psychiatrists in our network are independent practitioners and are not employees of Psychology Direct.</p>

          <h2>3. Use of Our Website</h2>
          <p>You agree to use our website only for lawful purposes and in accordance with these Terms. You must not:</p>
          <ul>
            <li>Use the website in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorised access to any part of the website or its systems</li>
            <li>Reproduce, distribute, or commercially exploit any content without our prior written consent</li>
            <li>Introduce viruses, trojans, or other malicious material</li>
            <li>Use automated tools to scrape or extract data from the website</li>
          </ul>

          <h2>4. Engaging Our Services</h2>
          <p>When you instruct Psychology Direct to provide expert witness services:</p>
          <ul>
            <li>You must provide accurate and complete information about your case requirements</li>
            <li>We will use reasonable endeavours to match you with an appropriate expert</li>
            <li>Timelines provided are estimates and may be affected by the complexity of the case, availability of the subject, and other factors</li>
            <li>You are responsible for reviewing and approving the matched expert before instruction proceeds</li>
          </ul>

          <h2>5. Fees and Payment</h2>
          <ul>
            <li>Fees for our services will be communicated to you in advance of any work commencing</li>
            <li>We accept Legal Aid rates for eligible cases in accordance with Legal Aid Agency guidelines</li>
            <li>All fees are quoted exclusive of VAT unless otherwise stated</li>
            <li>Payment terms are 30 days from the date of invoice unless otherwise agreed in writing</li>
            <li>We reserve the right to charge interest on overdue payments in accordance with the Late Payment of Commercial Debts Act 1998</li>
          </ul>

          <h2>6. Cancellations</h2>
          <p>If you wish to cancel an instruction:</p>
          <ul>
            <li>Cancellations made before an expert has been instructed will incur no charge</li>
            <li>Cancellations made after an expert has been instructed may be subject to a cancellation fee to cover any work already undertaken</li>
            <li>Late cancellation of scheduled assessments (less than 48 hours' notice) may incur a fee</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>All content on this website — including text, graphics, logos, images, and software — is the property of Psychology Direct or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.</p>

          <h2>8. Expert Reports</h2>
          <ul>
            <li>Reports prepared by our experts are provided for the purpose specified in the instruction</li>
            <li>Reports remain the intellectual property of the instructing party once paid for in full</li>
            <li>Psychology Direct and the individual expert retain the right to reference anonymised case data for quality assurance and professional development purposes</li>
            <li>All reports are prepared in accordance with the relevant professional standards and legal requirements (including CPR Part 35 and Family Procedure Rules where applicable)</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law:</p>
          <ul>
            <li>Psychology Direct shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services</li>
            <li>Our total liability for any claim arising from or relating to our services shall not exceed the fees paid for the specific service giving rise to the claim</li>
            <li>We do not guarantee the outcome of any legal proceedings in which our experts are involved</li>
            <li>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be lawfully excluded</li>
          </ul>

          <h2>10. Confidentiality</h2>
          <p>We treat all case information as confidential. Information shared with us will only be disclosed to the matched expert and any relevant administrative staff. We will not share your case details with third parties except as required by law or with your express consent.</p>

          <h2>11. Data Protection</h2>
          <p>We process personal data in accordance with our <a href="/privacy-policy" className="text-[#066aab] hover:underline">Privacy Policy</a> and applicable data protection legislation including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

          <h2>12. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

          <h2>13. Changes to These Terms</h2>
          <p>We reserve the right to update these Terms at any time. Changes will be effective when posted on this page. Your continued use of our website or services after any changes constitutes acceptance of the revised Terms.</p>

          <h2>14. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li>Email: info@psychologydirect.co.uk</li>
            <li>Phone: 01306 879 075</li>
            <li>Post: Psychology Direct, United Kingdom</li>
          </ul>
        </div>
      </article>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="https://www.psychologydirect.co.uk/wp-content/themes/psychologydirect-2018/images/svg/footer-logo.svg" alt="Psychology Direct" className="h-8 w-auto" />
          <p className="text-[#cee4f7]/50 text-xs">
            &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
