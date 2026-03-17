"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBasket, type BasketItem } from "@/lib/basket";
import { trackFormSubmission } from "@/lib/analytics";
import client from "../../../tina/__generated__/client";

type FormState = {
  status: "idle" | "submitting" | "error";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  notes: string;
  termsAccepted: boolean;
  showTermsModal: boolean;
  showPrivacyModal: boolean;
  errorMessage: string;
};

export function CheckoutPageClient() {
  const { items, total, itemCount, clearBasket } = useBasket();

  useEffect(() => {
    document.body.classList.add("page-checkout");
    return () => document.body.classList.remove("page-checkout");
  }, []);
  const [form, setForm] = useState<FormState>({
    status: "idle",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    notes: "",
    termsAccepted: false,
    showTermsModal: false,
    showPrivacyModal: false,
    errorMessage: "",
  });

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const errors: string[] = [];
    if (!form.firstName.trim()) errors.push("First name is required");
    if (!form.lastName.trim()) errors.push("Last name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!form.dob.trim()) errors.push("Date of birth is required");
    if (!form.termsAccepted) errors.push("You must accept the terms and conditions");
    
    if (errors.length > 0) {
      setForm((s) => ({ ...s, status: "error", errorMessage: errors.join(" • ") }));
      return;
    }
    
    if (items.length === 0) {
      setForm((s) => ({ ...s, status: "error", errorMessage: "No items in your order" }));
      return;
    }
    
    setForm((s) => ({ ...s, status: "submitting" }));

    try {
      const res = await fetch("/api/semble/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          notes: form.notes,
          items: items.map((i: BasketItem) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      trackFormSubmission("checkout", { value: String(total) });

      if (data.paymentMode === "semble-pay" && data.paymentUrl) {
        // Semble Pay: redirect to hosted payment page
        // Store order ref + invoice ID for verification on return
        localStorage.setItem("cocoon-pending-order", JSON.stringify({
          orderRef: data.orderRef,
          invoiceId: data.summary?.invoiceId,
        }));
        clearBasket();
        window.location.href = data.paymentUrl;
        return;
      }

      // Direct/sandbox: payment already recorded
      // Store order details and redirect to confirmation
      localStorage.setItem("cocoon-completed-order", JSON.stringify({
        orderRef: data.orderRef,
        invoiceId: data.summary?.invoiceId,
        total: data.summary?.total,
        itemCount: data.summary?.itemCount,
        paidOrOutstanding: data.summary?.paidOrOutstanding || "Paid",
        steps: data.steps || [],
        firstName: form.firstName,
        email: form.email,
        notes: form.notes,
      }));
      clearBasket();
      window.location.href = "/book/confirmation";
    } catch (err) {
      setForm((s) => ({
        ...s,
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  };

  // Empty basket
  if (items.length === 0) {
    return (
      <section className="section-editorial section-bleed section-mineral-white theme-light">
        <div className="container-wide">
          <div className="section-header-center">
            <div className="eyebrow">Checkout</div>
            <h1 className="heading-display-lg">Your bag is empty</h1>
            <p className="body-editorial">
              Please add some services before checking out.
            </p>
            <div
              className="btn-row-center"
            >
              <Link href="/services" className="ds-btn ds-btn-primary">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-editorial section-bleed section-sage theme-light checkout-hero">
        <div className="container-wide">
          <div className="section-intro">
            <div className="eyebrow">Checkout</div>
            <h1 className="heading-display-lg">Complete your order</h1>
          </div>
        </div>
      </section>

      <section className="section-editorial section-bleed section-mineral-white theme-light">
        <div className="container-wide">
          <div className="checkout-layout">
            {/* Form */}
            <div className="checkout-form-side">
              <h2 className="heading-display-sm">Your Details</h2>
              <form
                onSubmit={handleSubmit}
                className="contact-form contact-form-wrapper"
              >
                {/* Error Modal Overlay */}
                {form.status === "error" && (
                  <div className="error-modal-overlay" onClick={() => setForm(s => ({ ...s, status: "idle" }))}>
                    <div className="error-modal" onClick={(e) => e.stopPropagation()}>
                      <div className="error-modal-icon">⚠️</div>
                      <h3 className="error-modal-title">Please check your details</h3>
                      <ul className="error-modal-list">
                        {form.errorMessage.split(" • ").map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="ds-btn ds-btn-primary error-modal-btn"
                        onClick={() => setForm(s => ({ ...s, status: "idle" }))}
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                )}

                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <label className="contact-form-label" htmlFor="co-firstName">
                      First name *
                    </label>
                    <input
                      id="co-firstName"
                      className="contact-form-input"
                      required
                      value={form.firstName}
                      onChange={set("firstName")}
                      placeholder=""
                      disabled={form.status === "submitting"}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label className="contact-form-label" htmlFor="co-lastName">
                      Last name *
                    </label>
                    <input
                      id="co-lastName"
                      className="contact-form-input"
                      required
                      value={form.lastName}
                      onChange={set("lastName")}
                      placeholder=""
                      disabled={form.status === "submitting"}
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="co-email">
                    Email address *
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    className="contact-form-input"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder=""
                    disabled={form.status === "submitting"}
                  />
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <label className="contact-form-label" htmlFor="co-phone">
                      Phone{" "}
                      <span className="contact-form-optional">(optional)</span>
                    </label>
                    <input
                      id="co-phone"
                      type="tel"
                      className="contact-form-input"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder=""
                      disabled={form.status === "submitting"}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label className="contact-form-label" htmlFor="co-dob">
                      Date of birth *
                    </label>
                    <input
                      id="co-dob"
                      type="date"
                      className="contact-form-input"
                      required
                      value={form.dob}
                      onChange={set("dob")}
                      onClick={(e) => {
                        try { (e.target as HTMLInputElement).showPicker(); } catch {}
                      }}
                      onFocus={(e) => {
                        try { (e.target as HTMLInputElement).showPicker(); } catch {}
                      }}
                      disabled={form.status === "submitting"}
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label className="contact-form-label" htmlFor="co-notes">
                    Additional notes{" "}
                    <span className="contact-form-optional">(optional)</span>
                  </label>
                  <textarea
                    id="co-notes"
                    className="contact-form-textarea"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                    placeholder="Anything we should know? Allergies, medications, preferences…"
                    disabled={form.status === "submitting"}
                  />
                </div>

                {/* Terms checkbox */}
                <div className="contact-form-terms">
                  <label className="contact-form-terms-label">
                    <input
                      type="checkbox"
                      checked={form.termsAccepted}
                      onChange={(e) => setForm((s) => ({ ...s, termsAccepted: e.target.checked }))}
                      disabled={form.status === "submitting"}
                      className="contact-form-terms-checkbox"
                    />
                    <span>
                      I accept the{" "}
                      <button
                        type="button"
                        className="contact-form-terms-link"
                        onClick={() => setForm((s) => ({ ...s, showTermsModal: true }))}
                      >
                        terms and conditions
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="contact-form-terms-link"
                        onClick={() => setForm((s) => ({ ...s, showPrivacyModal: true }))}
                      >
                        privacy policy
                      </button>
                    </span>
                  </label>
                </div>

                {/* Terms Modal */}
                {form.showTermsModal && (
                  <TermsModal onClose={() => setForm((s) => ({ ...s, showTermsModal: false }))} />
                )}
                {form.showPrivacyModal && (
                  <PrivacyModal onClose={() => setForm((s) => ({ ...s, showPrivacyModal: false }))} />
                )}

                <button
                  type="submit"
                  className="ds-btn ds-btn-primary"
                  disabled={form.status === "submitting"}
                >
                  {form.status === "submitting"
                    ? "Processing…"
                    : `Place Order — £${total}`}
                </button>
              </form>
            </div>

            {/* Order summary sidebar */}
            <div className="checkout-summary-side">
              <div className="basket-summary-card">
                <h3 className="basket-summary-title">
                  Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h3>

                <div className="basket-summary-rows">
                  {items.map((item) => (
                    <div key={item.productId} className="basket-summary-row">
                      <span>
                        {item.name}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </span>
                      <span>£{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="basket-summary-divider" />

                <div className="basket-summary-row basket-summary-total">
                  <span>Total</span>
                  <span>£{total}</span>
                </div>

                <p className="basket-summary-vat">No VAT applicable</p>

                <Link href="/basket" className="basket-continue-link">
                  Edit order →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Terms Modal - fetches content from TinaCMS
function TermsModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tina?path=utility/terms-and-conditions.md")
      .then((r) => r.json())
      .then((data) => {
        setContent(data.page);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load terms and conditions");
        setLoading(false);
      });
  }, []);

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <button className="terms-modal-close" onClick={onClose}>×</button>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : content ? (
          <>
            <h2 className="terms-modal-title">{content.title || "Terms and Conditions"}</h2>
            <div className="terms-modal-body" dangerouslySetInnerHTML={{ __html: content.html || "" }} />
          </>
        ) : (
          <p>No content found</p>
        )}
      </div>
    </div>
  );
}

// Privacy Modal - fetches content from TinaCMS
function PrivacyModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tina?path=utility/privacy-policy.md")
      .then((r) => r.json())
      .then((data) => {
        setContent(data.page);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load privacy policy");
        setLoading(false);
      });
  }, []);

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <button className="terms-modal-close" onClick={onClose}>×</button>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : content ? (
          <>
            <h2 className="terms-modal-title">{content.title || "Privacy Policy"}</h2>
            <div className="terms-modal-body" dangerouslySetInnerHTML={{ __html: content.html || "" }} />
          </>
        ) : (
          <p>No content found</p>
        )}
      </div>
    </div>
  );
}
