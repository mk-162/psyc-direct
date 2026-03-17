"use client";

import { useState } from "react";
import Link from "next/link";

interface Task {
  id: string;
  subject: string;
  status: string;
  dueDate: string | null;
  comments: string | null;
}

interface Invoice {
  id: string;
  date: string;
  total: number;
  status: string;
  comments: string | null;
  lineItems: Array<{
    product: { name: string } | null;
    quantity: number;
    price: number;
  }> | null;
}

interface LookupResult {
  found: boolean;
  patient: { id: string; firstName: string; lastName: string } | null;
  invoices: Invoice[];
  tasks: Task[];
}

export function MyCocoonClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/semble/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Lookup form */}
      <section className="section-editorial section-bleed section-mineral-white theme-light">
        <div className="container-wide container-narrow">
          <form onSubmit={handleLookup} className="contact-form contact-form-wrapper">
            <div className="contact-form-field">
              <label className="contact-form-label" htmlFor="mc-email">
                Email address
              </label>
              <input
                id="mc-email"
                type="email"
                className="contact-form-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="ds-btn ds-btn-primary"
              disabled={loading}
            >
              {loading ? "Looking up…" : "Find my records"}
            </button>
          </form>

          {error && (
            <div className="contact-form-error confirmation-body-text">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && !result.found && (
        <section className="section-editorial section-bleed section-mineral-white theme-light">
          <div className="container-wide container-narrow">
            <div className="section-header-center">
              <h2 className="heading-display-lg">No records found</h2>
              <p className="body-editorial">
                We couldn&apos;t find an account with that email address. If you&apos;ve booked
                with us before, you may have used a different email.
              </p>
              <div className="btn-row-center">
                <Link href="/services" className="ds-btn ds-btn-primary">
                  Book a Service
                </Link>
                <Link href="/utility/contact" className="ds-btn ds-btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {result && result.found && result.patient && (
        <>
          <section className="section-editorial section-bleed section-sage theme-light">
            <div className="container-wide">
              <div className="section-intro">
                <div className="eyebrow">Welcome back</div>
                <h2 className="heading-display-lg">
                  {result.patient.firstName} {result.patient.lastName}
                </h2>
              </div>
            </div>
          </section>

          {/* Tasks / Bookings */}
          {result.tasks.length > 0 && (
            <section className="section-editorial section-bleed section-mineral-white theme-light">
              <div className="container-wide">
                <div className="section-intro">
                  <div className="eyebrow">Your Bookings</div>
                  <h2 className="heading-display-lg">Appointments</h2>
                </div>
                <div className="cards-grid">
                  {result.tasks.map((task) => (
                    <div key={task.id} className="card card-mineral">
                      <div className="card-content">
                        <div className="eyebrow">
                          {task.status === "open" ? "Pending" : task.status === "closed" ? "Completed" : task.status}
                        </div>
                        <h3 className="card-title">{task.subject}</h3>
                        {task.dueDate && (
                          <p className="card-description">Due: {task.dueDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Invoices */}
          {result.invoices.length > 0 && (
            <section className="section-editorial section-bleed section-mineral-white theme-light">
              <div className="container-wide">
                <div className="section-intro">
                  <div className="eyebrow">Payment History</div>
                  <h2 className="heading-display-lg">Invoices</h2>
                </div>
                <div className="cards-grid">
                  {result.invoices.map((inv) => (
                    <div key={inv.id} className="card card-mineral">
                      <div className="card-content">
                        <div className="eyebrow">{inv.status}</div>
                        <h3 className="card-title">£{inv.total}</h3>
                        <p className="card-description">{inv.date}</p>
                        {inv.lineItems && inv.lineItems.length > 0 && (
                          <ul className="included-list">
                            {inv.lineItems.map((li, j) => (
                              <li key={j} className="included-list-item">
                                {li.product?.name || "Service"} × {li.quantity} — £{li.price}
                              </li>
                            ))}
                          </ul>
                        )}
                        {inv.comments && (
                          <p className="card-description invoice-comment">
                            {inv.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {result.tasks.length === 0 && result.invoices.length === 0 && (
            <section className="section-editorial section-bleed section-mineral-white theme-light">
              <div className="container-wide container-narrow">
                <div className="section-header-center">
                  <p className="body-editorial">
                    No bookings or invoices found yet. Your records will appear here once
                    you&apos;ve booked a service.
                  </p>
                  <div className="btn-row-center">
                    <Link href="/services" className="ds-btn ds-btn-primary">
                      Browse Services
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
