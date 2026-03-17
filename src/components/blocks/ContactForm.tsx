"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trackFormSubmission } from "@/lib/analytics";

interface ContactMethod {
  icon?: string;
  label?: string;
  value?: string;
  href?: string;
  note?: string;
}

interface ContactFormData {
  eyebrow?: string;
  headline?: string;
  infoEyebrow?: string;
  infoHeadline?: string;
  mapPlaceholder?: string;
  theme?: "off-white" | "green" | "grey" | "terracotta";
  contactMethods?: ContactMethod[];
}

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  name: string;
  email: string;
  phone: string;
  message: string;
  errorMessage: string;
};

export const ContactForm = ({ data }: { data: ContactFormData }) => {
  const [form, setForm] = useState<FormState>({
    status: "idle",
    name: "",
    email: "",
    phone: "",
    message: "",
    errorMessage: "",
  });

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((s) => ({ ...s, status: "submitting" }));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Something went wrong");
      trackFormSubmission("contact_form");
      setForm((s) => ({ ...s, status: "success" }));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setForm((s) => ({ ...s, status: "error", errorMessage: message }));
    }
  };

  const themeClass =
    data.theme === "green"
      ? "section-deep-green theme-dark"
      : data.theme === "grey"
        ? "section-warm-stone theme-light"
        : data.theme === "terracotta"
          ? "section-terracotta theme-dark"
          : "section-mineral-white theme-light";

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        <div className="content-media-grid">
          {/* Left: Contact Form */}
          <div className="content-side">
            {data.eyebrow && (
              <div className="eyebrow">{data.eyebrow}</div>
            )}
            {data.headline && (
              <h2 className="heading-display">{data.headline}</h2>
            )}

            {form.status === "success" ? (
              <div className="contact-confirmation">
                <div className="contact-confirmation-icon">◉</div>
                <h3 className="contact-confirmation-title">
                  Thank you, {form.name}.
                </h3>
                <p className="body-editorial contact-confirmation-body">
                  Your message has been received. A member of our team will be
                  in touch personally within 4 working hours — usually sooner.
                </p>
                <p className="body-editorial contact-confirmation-body mt-content">
                  In the meantime, you&apos;re welcome to explore our services
                  or read more about what makes Cocoon different.
                </p>
                <div className="contact-confirmation-meta">
                  Confirmation sent to {form.email}
                </div>
                <div className="btn-row mt-content">
                  <Link href="/services" className="btn-ghost">
                    Explore Services →
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="contact-form contact-form-wrapper"
              >
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
                  <label className="contact-form-label">
                    Phone Number{" "}
                    <span className="contact-form-optional">(optional)</span>
                  </label>
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
                  <label className="contact-form-label">
                    How can we help? *
                  </label>
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
                  <Link href="/utility/privacy-policy">Privacy Policy</Link>. We
                  never share your information.
                </p>
              </form>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="content-side">
            {data.infoEyebrow && (
              <div className="eyebrow">{data.infoEyebrow}</div>
            )}
            {data.infoHeadline && (
              <h2 className="heading-display">{data.infoHeadline}</h2>
            )}
            {data.contactMethods && data.contactMethods.length > 0 && (
              <div className="contact-info-list contact-info-wrapper">
                {data.contactMethods.map((c, i) => (
                  <a key={i} href={c.href || "#"} className="contact-info-item">
                    <span className="contact-info-icon">{c.icon}</span>
                    <div className="contact-info-body">
                      {c.label && (
                        <div className="contact-info-label">{c.label}</div>
                      )}
                      {c.value && (
                        <div className="contact-info-value">{c.value}</div>
                      )}
                      {c.note && (
                        <div className="contact-info-note">{c.note}</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
            {data.mapPlaceholder && (
              <div className="contact-map">{data.mapPlaceholder}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
