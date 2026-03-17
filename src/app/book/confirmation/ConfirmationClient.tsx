"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { PremiumPageRenderer } from "@/components/blocks/PremiumPageRenderer";

interface OrderDetails {
  orderRef: string;
  invoiceId: string;
  total: number;
  itemCount: number;
  firstName: string;
  email: string;
  notes: string;
  paid: boolean;
  steps: string[];
}

type PageState = "loading" | "confirmed" | "pending" | "empty";

interface TinaProps {
  query: string;
  variables: { relativePath: string };
  data: any;
}

export function ConfirmationClient({ tinaData }: { tinaData: TinaProps | null }) {
  const [state, setState] = useState<PageState>("loading");
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Hook into Tina for live editing (always call, pass dummy if no data)
  const tina = useTina(
    tinaData || {
      query: "",
      variables: { relativePath: "confirmation.json" },
      data: {},
    }
  );

  // Extract blocks from Tina data
  const pageData = tinaData ? tina.data?.pages : null;
  const blocks = pageData?.blocks || [];

  useEffect(() => {
    // Check 1: Returning from Semble Pay
    const pendingRaw = localStorage.getItem("cocoon-pending-order");
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw);
        fetch(`/api/semble/verify?invoiceId=${pending.invoiceId}`)
          .then((r) => r.json())
          .then((data) => {
            setOrder({
              orderRef: pending.orderRef,
              invoiceId: pending.invoiceId,
              total: data.total || 0,
              itemCount: 0,
              firstName: "",
              email: "",
              notes: "",
              paid: data.paid || false,
              steps: [],
            });
            setState(data.paid ? "confirmed" : "pending");
            localStorage.removeItem("cocoon-pending-order");
          })
          .catch(() => {
            setState("pending");
            localStorage.removeItem("cocoon-pending-order");
          });
      } catch {
        localStorage.removeItem("cocoon-pending-order");
        setState("empty");
      }
      return;
    }

    // Check 2: Direct checkout (sandbox)
    const completedRaw = localStorage.getItem("cocoon-completed-order");
    if (completedRaw) {
      try {
        const completed = JSON.parse(completedRaw);
        setOrder({
          orderRef: completed.orderRef,
          invoiceId: completed.invoiceId,
          total: completed.total || 0,
          itemCount: completed.itemCount || 0,
          firstName: completed.firstName || "",
          email: completed.email || "",
          notes: completed.notes || "",
          paid: true,
          steps: completed.steps || [],
        });
        setState("confirmed");
        localStorage.removeItem("cocoon-completed-order");
      } catch {
        localStorage.removeItem("cocoon-completed-order");
        setState("empty");
      }
      return;
    }

    // No order data
    setState("empty");
  }, []);

  if (state === "loading") {
    return (
      <section className="ds-section section-bleed section-mineral-white theme-light">
        <div className="ds-container container-narrow-md confirmation-hero text-center">
          <p className="body-editorial">Verifying your order…</p>
        </div>
      </section>
    );
  }

  if (state === "empty") {
    return (
      <section className="ds-section section-bleed section-mineral-white theme-light">
        <div className="ds-container container-narrow-md confirmation-hero text-center">
          <h1 className="heading-display-lg">No order found</h1>
          <p className="body-editorial confirmation-body-text">
            It looks like you arrived here without placing an order.
          </p>
          <div className="btn-row-center">
          <Link href="/services" className="ds-btn ds-btn-primary">
            Browse Services
          </Link>
          </div>
        </div>
      </section>
    );
  }

  const isConfirmed = state === "confirmed";

  return (
    <>
      {/* Order details — always hardcoded */}
      {order && (
        <section className="section-editorial section-bleed section-mineral-white theme-light">
          <div className="container-wide container-narrow-md confirmation-hero">
            <div className="section-header-center">
              <h1 className="heading-display-lg">
                {order.firstName ? `Thank you, ${order.firstName}` : "Thank you"}
              </h1>
              <p className="body-editorial confirmation-body-text">
                {isConfirmed
                  ? "Your order has been confirmed and payment received."
                  : "Your order has been created. We're confirming your payment."}
              </p>
            </div>
            <div className="basket-summary-card confirmation-order-details">
              <h3 className="basket-summary-title">Order Details</h3>

              <div className="basket-summary-rows">
                <div className="basket-summary-row">
                  <span className="basket-summary-label">Order reference</span>
                  <span className="basket-summary-value"><strong>{order.orderRef}</strong></span>
                </div>
                <div className="basket-summary-row">
                  <span className="basket-summary-label">Payment</span>
                  <span className={isConfirmed ? "confirmation-status-paid" : "confirmation-status-pending"}>
                    {isConfirmed ? "Confirmed" : "Processing"}
                  </span>
                </div>
                {order.total > 0 && (
                  <div className="basket-summary-row">
                    <span className="basket-summary-label">Total</span>
                    <span className="basket-summary-value"><strong>£{order.total}</strong></span>
                  </div>
                )}
                {order.email && (
                  <div className="basket-summary-row">
                    <span className="basket-summary-label">Confirmation sent to</span>
                    <span className="basket-summary-value">{order.email}</span>
                  </div>
                )}
                {order.notes && (
                  <div className="basket-summary-row basket-summary-row-stacked">
                    <span className="basket-summary-label">Your notes</span>
                    <span className="basket-summary-value">{order.notes}</span>
                  </div>
                )}
              </div>

              {order.steps.length > 0 && (
                <details className="confirmation-log">
                  <summary className="eyebrow">
                    Integration log (demo only)
                  </summary>
                  <ul className="included-list confirmation-log-list">
                    {order.steps.map((step, i) => (
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
      )}

      {/* Editable blocks from Tina — skip any hero block (not needed here) */}
      {blocks.length > 0 && (
        <PremiumPageRenderer
          blocks={blocks.filter((b: any) => {
            const name = b.__typename?.split("Blocks")[1];
            return name !== "Hero";
          })}
        />
      )}
    </>
  );
}
