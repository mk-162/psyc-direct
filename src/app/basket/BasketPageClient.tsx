"use client";

import Link from "next/link";
import { useBasket } from "@/lib/basket";
import { useEffect } from "react";

export function BasketPageClient() {
  useEffect(() => {
    document.body.classList.add("page-basket");
    return () => document.body.classList.remove("page-basket");
  }, []);
  const { items, removeItem, updateQuantity, total, itemCount, clearBasket } = useBasket();

  return (
    <>
      <section className="section-editorial section-bleed section-mineral-white theme-light">
        <div className="basket-container">
          <h1 className="basket-page-title">Basket</h1>
          {items.length === 0 ? (
            <div className="section-header-center">
              <p className="body-editorial">
                You haven&apos;t added any services yet. Browse our services to get started.
              </p>
              <div
                className="btn-row-center"

              >
                <Link href="/services" className="ds-btn ds-btn-primary">
                  Browse Services
                </Link>
              </div>
            </div>
          ) : (
            <div className="basket-layout">
              {/* Items */}
              <div className="basket-items">
                {items.map((item) => (
                  <div key={item.productId} className="basket-item">
                    <div className="basket-item-info">
                      <h3 className="basket-item-name">{item.name}</h3>
                      <div className="basket-item-price">
                        £{item.price}
                        {item.quantity > 1 && (
                          <span className="basket-item-each"> each</span>
                        )}
                      </div>
                    </div>

                    <div className="basket-item-actions">
                      <div className="basket-quantity">
                        <button
                          className="basket-quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="basket-quantity-value">
                          {item.quantity}
                        </span>
                        <button
                          className="basket-quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="basket-item-subtotal">
                        £{item.price * item.quantity}
                      </div>

                      <button
                        className="basket-remove-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="basket-summary">
                <div className="basket-summary-card">
                  <h3 className="basket-summary-title">Order Summary</h3>

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

                  <Link href="/checkout" className="ds-btn ds-btn-primary basket-checkout-btn">
                    Proceed to Checkout
                  </Link>

                  <button
                    className="basket-clear-btn"
                    onClick={clearBasket}
                  >
                    Clear all
                  </button>
                </div>

                <Link href="/services" className="basket-continue-link">
                  ← Continue browsing
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
