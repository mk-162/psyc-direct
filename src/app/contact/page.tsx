import { cache } from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import client from "../../../tina/__generated__/client";
import { ContactForm } from "@/components/tools/ContactForm";
import { SITE_URL } from "@/lib/tina-page-helpers";

const getData = cache(async () => {
  try { return await client.queries.pages({ relativePath: "contact.json" }); }
  catch (e) { console.error("[contact]", e); return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await getData();
  return {
    title: res?.data?.pages?.title || "Contact Us | Psychology Direct",
    description: res?.data?.pages?.description || "Get in touch with Psychology Direct. Call us or complete the form for matched expert CVs and quotes within 24 hours.",
    alternates: { canonical: `${SITE_URL}/contact/` },
  };
}

const SELLING_POINTS = [
  "Wide network of HCPC-registered psychologists",
  "Enhanced DBS certificates for all experts",
  "Competitive, transparent rates",
  "Quick report turnaround times",
  "Ongoing support throughout your case",
  "Dedicated client management team",
  "Full administrative management",
];

export default async function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-16 sm:py-20 lg:py-24"
        style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-sans tracking-tight">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Our specialist Client Managers are here to help, so let us do the work for you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact options strip */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--brand-bg-tint)' }}>
                <Phone className="w-5 h-5" style={{ color: 'var(--brand-azure-vivid)' }} />
              </div>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--brand-navy)' }}>Call us</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Discuss the details of your case and we aim to provide you with up to 3 CVs, quotations &amp; timescales for suitable Psychologists in your area within 24 hours, or less.
                </p>
                <a
                  href="tel:01306879975"
                  className="text-base font-bold hover:underline"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  01306 879 975
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--brand-bg-tint)' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--brand-azure-vivid)' }} />
              </div>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--brand-navy)' }}>Email us</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Receive 3 CVs, quotes and timescales by email within 24 hours of your enquiry by completing the contact form below.
                </p>
                <a
                  href="mailto:enquiries@psychologydirect.co.uk"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  enquiries@psychologydirect.co.uk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content: Form + Sidebar */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Form — takes 2 cols */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-sans" style={{ color: 'var(--brand-navy)' }}>
                Send Us Your Enquiry
              </h2>
              <p className="text-muted-foreground mb-8">
                Complete the form and we&rsquo;ll respond within 24 hours with matched expert CVs and quotes.
              </p>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Contact details card */}
              <div className="bg-[var(--brand-bg-tint)] rounded-xl p-6 space-y-5">
                <h3 className="text-base font-bold" style={{ color: 'var(--brand-navy)' }}>Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a href="tel:01306879975" className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>
                        01306 879 975
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href="mailto:enquiries@psychologydirect.co.uk" className="text-sm font-semibold break-all" style={{ color: 'var(--brand-navy)' }}>
                        enquiries@psychologydirect.co.uk
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm" style={{ color: 'var(--brand-navy)' }}>
                        PO Box 497<br />
                        Leatherhead, Surrey<br />
                        KT22 2PD
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                    <div>
                      <p className="text-xs text-muted-foreground">Company Registration</p>
                      <p className="text-sm" style={{ color: 'var(--brand-navy)' }}>07008023</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why choose us */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>Why Choose Us</h3>
                <ul className="space-y-3">
                  {SELLING_POINTS.map((point) => (
                    <li key={point} className="flex gap-2.5 items-start text-sm">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section style={{ background: 'var(--brand-navy)' }} className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10 font-sans">
            Our Simple Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Expert Matching', desc: 'We match your case with up to 3 suitable psychologists from our vetted network, providing CVs and quotes within 24 hours.' },
              { step: '2', title: 'Instruction & Admin', desc: 'Once you instruct an expert, we handle all the administration — scheduling, liaison, and bundle management.' },
              { step: '3', title: 'Quality Assurance', desc: 'Every report undergoes quality checks before delivery, and our team remains available for any follow-up queries.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold mb-4"
                  style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
