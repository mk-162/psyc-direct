"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { number: "01", title: "Enquire", desc: "Tell us what you're looking for. We'll match you with the right clinician and service before you commit to anything." },
  { number: "02", title: "Welcome Consultation", desc: "A 60-minute conversation with your allocated clinician. We learn your health history, your goals, and what Cocoon can do for you." },
  { number: "03", title: "Your Care Plan", desc: "Based on your consultation, we recommend a personalised programme — whether that's a one-off screening or an ongoing membership." },
];

const contactMethods = [
  { icon: "◎", label: "Call us", value: "01423 567437", href: "tel:01423567437", note: "Mon–Fri, 8am–6pm" },
  { icon: "◈", label: "Email us", value: "hello@cocoon-hgt.com", href: "mailto:hello@cocoon-hgt.com", note: "Response within 4 hours" },
  { icon: "◉", label: "Find us", value: "Rear Of 23 Victoria Avenue, Harrogate, England, HG1 5RD", href: "https://maps.google.com/?q=HG1+5RD", note: "Parking on Victoria Avenue & Waitrose (2hrs free)" },
];

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  name: string;
  email: string;
  phone: string;
  message: string;
  errorMessage: string;
};

export default function ContactUtilityTemplate() {
  const [form, setForm] = useState<FormState>({
    status: "idle",
    name: "",
    email: "",
    phone: "",
    message: "",
    errorMessage: "",
  });

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(s => ({ ...s, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm(s => ({ ...s, status: "submitting" }));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setForm(s => ({ ...s, status: "success" }));
    } catch (err: any) {
      setForm(s => ({ ...s, status: "error", errorMessage: err.message || "Something went wrong. Please try again." }));
    }
  };

  return (
    <main>

      {/* ─── HERO: Text-led dark header ─── */}
      <section className="section-editorial-dark contact-hero">
        <div className="container-narrow">
          <div className="eyebrow-light">— Get in Touch</div>
          <h1 className="heading-display-xl text-cream">
            We'd love to<br />hear from you
          </h1>
          <p className="body-editorial-dark mt-content">
            Whether you have a question about our services, want to understand membership,
            or are ready to book — we're here. Expect a warm, unhurried response.
          </p>
        </div>
      </section>

      {/* ─── CONTACT: Form + Info ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="content-media-grid">

            {/* Left: Contact Form */}
            <div className="content-side">
              <div className="eyebrow">— Send a Message</div>
              <h2 className="heading-display">Start a conversation</h2>

              {form.status === "success" ? (
                <div className="contact-confirmation">
                  <div className="contact-confirmation-icon">◉</div>
                  <h3 className="contact-confirmation-title">
                    Thank you, {form.name}.
                  </h3>
                  <p className="body-editorial contact-confirmation-body">
                    Your message has been received. A member of our team will
                    be in touch personally within 4 working hours — usually sooner.
                  </p>
                  <p className="body-editorial contact-confirmation-body mt-content">
                    In the meantime, you're welcome to explore our services or
                    read more about what makes Cocoon different.
                  </p>
                  <div className="contact-confirmation-meta">
                    Confirmation sent to {form.email}
                  </div>
                  <div className="btn-row mt-content">
                    <Link href="/services/index" className="btn-ghost">Explore Services →</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form contact-form-wrapper">
                  <div className="contact-form-field">
                    <label className="contact-form-label">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Dr. Sarah Jones"
                      className="contact-form-input"
                      disabled={form.status === "submitting"}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label className="contact-form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      placeholder="sarah@example.com"
                      className="contact-form-input"
                      disabled={form.status === "submitting"}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label className="contact-form-label">Phone Number <span className="contact-form-optional">(optional)</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="01423 000 000"
                      className="contact-form-input"
                      disabled={form.status === "submitting"}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label className="contact-form-label">How can we help? *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us a little about what you're looking for..."
                      className="contact-form-textarea"
                      disabled={form.status === "submitting"}
                    />
                  </div>

                  {form.status === "error" && (
                    <p className="contact-form-error">{form.errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={form.status === "submitting"}
                  >
                    {form.status === "submitting" ? "Sending..." : "Send Message"}
                  </button>

                  <p className="contact-form-privacy">
                    Your details are handled in accordance with our{" "}
                    <Link href="/utility/privacy-policy">Privacy Policy</Link>.
                    We never share your information.
                  </p>
                </form>
              )}
            </div>

            {/* Right: Contact Info */}
            <div className="content-side">
              <div className="eyebrow">— Contact Details</div>
              <h2 className="heading-display">Other ways to reach us</h2>
              <div className="contact-info-list contact-info-wrapper">
                {contactMethods.map((c, i) => (
                  <a key={i} href={c.href} className="contact-info-item">
                    <span className="contact-info-icon">{c.icon}</span>
                    <div className="contact-info-body">
                      <div className="contact-info-label">{c.label}</div>
                      <div className="contact-info-value">{c.value}</div>
                      <div className="contact-info-note">{c.note}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="contact-map">Map — Harrogate Clinic</div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROCESS STEPS ─── */}
      <section className="section-editorial-stone">
        <div className="container-wide">
          <div className="section-header-center">
            <div className="eyebrow eyebrow-center">— What Happens Next</div>
            <h2 className="heading-display-lg">Your journey begins here</h2>
          </div>
          <div className="process-steps mt-section">
            {steps.map((step, i) => (
              <div key={i} className="process-step">
                <div className="process-step-number">{step.number}</div>
                <div className="process-step-title">{step.title}</div>
                <div className="process-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING SECTION ─── */}
      <section className="booking-section">
        <div className="container-narrow text-center">
          <div className="eyebrow eyebrow-center">— Ready to Begin</div>
          <h2 className="booking-title">Book your Welcome Consultation</h2>
          <p className="booking-subtitle">
            A 60-minute appointment with one of our clinicians. No commitment required —
            just a chance to understand what Cocoon can do for you.
          </p>
          <div className="booking-fallback">
            <p className="booking-fallback-label">Online booking coming soon</p>
            <div className="btn-row-center">
              <a href="tel:01423000000" className="btn-ghost">Call 01423 000 000</a>
              <a href="mailto:hello@cocoonwellness.com" className="btn-ghost">Email us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="section-editorial-sage">
        <div className="container-narrow">
          <div className="testimonial-content text-center">
            <blockquote className="testimonial-blockquote">
              "I was nervous about my first visit — I always am with doctors. But within
              ten minutes I felt completely at ease. The whole team just makes you feel
              like you matter."
            </blockquote>
            <div className="testimonial-meta">
              <div className="testimonial-name">Robert T.</div>
              <div className="testimonial-role">Premier Member</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
