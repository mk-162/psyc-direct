"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trackFormSubmission } from "@/lib/analytics";

interface BookingFormProps {
  productId: string;
  productName: string;
  productPrice: number;
  theme?: "off-white" | "green" | "grey" | "terracotta";
}

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  message: string;
  errorMessage: string;
  orderRef: string;
  steps: string[];
};

export const BookingForm = ({
  productId,
  productName,
  productPrice,
  theme = "off-white",
}: BookingFormProps) => {
  const [form, setForm] = useState<FormState>({
    status: "idle",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    message: "",
    errorMessage: "",
    orderRef: "",
    steps: [],
  });

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((s) => ({ ...s, status: "submitting" }));
    try {
      const res = await fetch("/api/semble/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          productId,
          productName,
          price: productPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      trackFormSubmission("booking_form", {
        product: productName,
        value: String(productPrice),
      });
      setForm((s) => ({
        ...s,
        status: "success",
        orderRef: data.orderRef,
        steps: data.steps || [],
      }));
    } catch (err) {
      setForm((s) => ({
        ...s,
        status: "error",
        errorMessage:
          err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  };

  const themeClass =
    theme === "green"
      ? "section-deep-green theme-dark"
      : theme === "grey"
        ? "section-warm-stone theme-light"
        : theme === "terracotta"
          ? "section-terracotta theme-dark"
          : "section-mineral-white theme-light";

  if (form.status === "success") {
    return (
      <section className={`section-editorial section-bleed ${themeClass}`}>
        <div className="container-wide">
          <div className="contact-confirmation">
            <div className="contact-confirmation-icon">◉</div>
            <h3 className="contact-confirmation-title">
              Thank you, {form.firstName}.
            </h3>
            <p className="body-editorial contact-confirmation-body">
              Your booking for <strong>{productName}</strong> has been received.
              <br />
              Reference: <strong>{form.orderRef}</strong>
            </p>
            <p className="body-editorial contact-confirmation-body mt-content">
              A member of our team will be in touch shortly to arrange your
              appointment at Cocoon Healthcare, Harrogate.
            </p>
            <div className="contact-confirmation-meta">
              Confirmation sent to {form.email}
            </div>
            <div className="btn-row mt-content">
              <Link href="/services" className="btn-ghost">
                View More Services →
              </Link>
            </div>

            {form.steps.length > 0 && (
              <details className="details-spaced">
                <summary className="eyebrow">
                  Integration log (demo only)
                </summary>
                <ul className="included-list details-list">
                  {form.steps.map((step, i) => (
                    <li key={i} className="included-list-item">
                      {step}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        <div className="content-media-grid">
          {/* Left: Booking info */}
          <div className="content-side">
            <div className="eyebrow">Your Booking</div>
            <h2 className="heading-display">{productName}</h2>
            <p className="body-editorial">
              Complete your details below to book this service. We&apos;ll be in
              touch to confirm your appointment.
            </p>

            <div className="contact-info-list contact-info-list-spaced">
              <div className="contact-info-item">
                <div className="contact-info-icon">£</div>
                <div>
                  <div className="contact-info-label">Price</div>
                  <div className="contact-info-value">£{productPrice}</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">◎</div>
                <div>
                  <div className="contact-info-label">Location</div>
                  <div className="contact-info-value">
                    Cocoon Healthcare, Harrogate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="media-side">
            <form
              onSubmit={handleSubmit}
              className="contact-form contact-form-wrapper"
            >
              {form.status === "error" && (
                <div className="contact-form-error">{form.errorMessage}</div>
              )}

              <div className="contact-form-row">
                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="bf-firstName">
                    First name *
                  </label>
                  <input
                    id="bf-firstName"
                    className="contact-form-input"
                    required
                    value={form.firstName}
                    onChange={set("firstName")}
                    placeholder="Jane"
                    disabled={form.status === "submitting"}
                  />
                </div>
                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="bf-lastName">
                    Last name *
                  </label>
                  <input
                    id="bf-lastName"
                    className="contact-form-input"
                    required
                    value={form.lastName}
                    onChange={set("lastName")}
                    placeholder="Smith"
                    disabled={form.status === "submitting"}
                  />
                </div>
              </div>

              <div className="contact-form-field">
                <label className="contact-form-label" htmlFor="bf-email">
                  Email address *
                </label>
                <input
                  id="bf-email"
                  type="email"
                  className="contact-form-input"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="jane@example.com"
                  disabled={form.status === "submitting"}
                />
              </div>

              <div className="contact-form-row">
                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="bf-phone">
                    Phone{" "}
                    <span className="contact-form-optional">(optional)</span>
                  </label>
                  <input
                    id="bf-phone"
                    type="tel"
                    className="contact-form-input"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="01423 000 000"
                    disabled={form.status === "submitting"}
                  />
                </div>
                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="bf-dob">
                    Date of birth
                  </label>
                  <input
                    id="bf-dob"
                    type="date"
                    className="contact-form-input"
                    value={form.dob}
                    onChange={set("dob")}
                    disabled={form.status === "submitting"}
                  />
                </div>
              </div>

              <div className="contact-form-field">
                <label className="contact-form-label" htmlFor="bf-message">
                  Additional notes{" "}
                  <span className="contact-form-optional">(optional)</span>
                </label>
                <textarea
                  id="bf-message"
                  className="contact-form-textarea"
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Anything we should know before your appointment?"
                  disabled={form.status === "submitting"}
                />
              </div>

              <button
                type="submit"
                className="ds-btn ds-btn-primary"
                disabled={form.status === "submitting"}
              >
                {form.status === "submitting"
                  ? "Processing…"
                  : `Book now — £${productPrice}`}
              </button>

              <p className="contact-form-privacy">
                By booking, you agree to our{" "}
                <Link href="/utility/terms-and-conditions">terms</Link> and{" "}
                <Link href="/utility/privacy-policy">privacy policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
