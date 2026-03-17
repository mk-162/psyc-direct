"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBasket } from "@/lib/basket";

interface Product {
  id: string;
  name: string;
  price: number;
  productType: string;
  duration: number | null;
  isBookable: boolean;
  isVideoConsultation: boolean | null;
}

interface ProductBuyButtonData {
  productId?: string;
  buttonText?: string;
  showPrice?: boolean;
  showDetails?: boolean;
  heading?: string;
  description?: string;
  style?: "primary" | "subtle" | "card";
  theme?: "off-white" | "green" | "grey" | "terracotta";
  companionType?: "text" | "image" | "none";
  companionHeading?: string;
  companionText?: string;
  companionImage?: string;
  companionImageAlt?: string;
  cardPosition?: "left" | "right";
}

const TYPE_LABELS: Record<string, string> = {
  appointment: "Consultation",
  lab: "Laboratory Test",
  vaccine: "Vaccination",
  pathway: "Care Pathway",
  other: "Service",
};

export const ProductBuyButton = ({ data }: { data: ProductBuyButtonData }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [hasBeenAdded, setHasBeenAdded] = useState(false);
  const { addItem } = useBasket();

  const {
    productId,
    buttonText,
    showPrice = true,
    showDetails = true,
    heading,
    description,
    style = "card",
    theme = "off-white",
    companionType = "none",
    companionHeading,
    companionText,
    companionImage,
    companionImageAlt,
    cardPosition = "right",
  } = data;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    fetch("/api/semble/products")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.products || []).find((p: Product) => p.id === productId);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (!productId) return null;
  if (loading) return null;
  if (!product) return null;

  const label = buttonText || (showPrice ? `Book now — £${product.price}` : "Book now");
  const typeLabel = TYPE_LABELS[product.productType] || "Service";

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    setAdded(true);
    setHasBeenAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const themeClass =
    theme === "green"
      ? "section-deep-green theme-dark"
      : theme === "grey"
        ? "section-warm-stone theme-light"
        : theme === "terracotta"
          ? "section-terracotta theme-dark"
          : "section-mineral-white theme-light";

  // Inline style — just the button, no wrapper
  if (style === "primary" || style === "subtle") {
    const hasCompanionInline = companionType === "text" || companionType === "image";

    const buttonContent = (
      <div className="buy-button-content">
        {heading && <h2 className="heading-display-lg">{heading}</h2>}
        {description && <p className="body-editorial">{description}</p>}
        <div className={heading || description ? "buy-button-actions" : "buy-button-actions--flush"}>
          <button
            className={`ds-btn ${added ? "ds-btn-added" : style === "subtle" ? "ds-btn-secondary" : "ds-btn-primary"}`}
            onClick={handleAdd}
          >
            {added ? "Added ✓" : label}
          </button>
          {hasBeenAdded && !added && (
            <Link href="/checkout" className="product-card-checkout-link buy-button-checkout-link">
              Proceed to checkout →
            </Link>
          )}
        </div>
      </div>
    );

    const companionPanelInline = hasCompanionInline ? (
      <div className="product-buy-companion">
        {companionType === "image" && companionImage && (
          <img
            src={companionImage}
            alt={companionImageAlt || ""}
            className="product-buy-companion-image"
          />
        )}
        {companionType === "text" && (
          <div className="product-buy-companion-text">
            {companionHeading && <h3 className="heading-display-sm">{companionHeading}</h3>}
            {companionText && <p className="body-editorial">{companionText}</p>}
          </div>
        )}
      </div>
    ) : null;

    return (
      <section className={`ds-section ${themeClass}`}>
        <div className="ds-container buy-button-container">
          {hasCompanionInline ? (
            <div className={`product-buy-split${cardPosition === "left" ? " product-buy-split-reversed" : ""}`}>
              <div className="product-buy-split-companion">
                {companionPanelInline}
              </div>
              <div className="product-buy-split-card">
                {buttonContent}
              </div>
            </div>
          ) : (
            buttonContent
          )}
        </div>
      </section>
    );
  }

  // The product card element
  const productCard = (
    <div className="card card-mineral">
      <div className="card-content">
        {showDetails && (
          <div className="product-card-meta">
            <span className="product-card-type">{typeLabel}</span>
            {product.duration && (
              <span className="product-card-duration">{product.duration} min</span>
            )}
            {product.isVideoConsultation && (
              <span className="product-card-video">Video</span>
            )}
          </div>
        )}
        <h3 className="card-title">{product.name}</h3>
        <div className="product-card-footer">
          {showPrice && <span className="product-card-price">£{product.price}</span>}
          <button
            className={`ds-btn ${added ? "ds-btn-added" : "ds-btn-primary"}`}
            onClick={handleAdd}
          >
            {added ? "Added ✓" : buttonText || "Add"}
          </button>
        </div>
        {hasBeenAdded && !added && (
          <Link href="/checkout" className="product-card-checkout-link">
            Proceed to checkout →
          </Link>
        )}
      </div>
    </div>
  );

  // The companion panel
  const hasCompanion = companionType === "text" || companionType === "image";

  const companionPanel = hasCompanion ? (
    <div className="product-buy-companion">
      {companionType === "image" && companionImage && (
        <img
          src={companionImage}
          alt={companionImageAlt || ""}
          className="product-buy-companion-image"
        />
      )}
      {companionType === "text" && (
        <div className="product-buy-companion-text">
          {companionHeading && <h3 className="heading-display-sm">{companionHeading}</h3>}
          {companionText && <p className="body-editorial">{companionText}</p>}
        </div>
      )}
    </div>
  ) : null;

  // Card style — two-column layout when companion is set
  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className="ds-container">
        {heading && (
          <div className="section-intro">
            <h2 className="heading-display-lg">{heading}</h2>
            {description && <p className="body-editorial">{description}</p>}
          </div>
        )}
        {hasCompanion ? (
          <div className={`product-buy-split${cardPosition === "left" ? " product-buy-split-reversed" : ""}`}>
            <div className="product-buy-split-companion">
              {companionPanel}
            </div>
            <div className="product-buy-split-card">
              {productCard}
            </div>
          </div>
        ) : (
          <div className="cards-grid buy-button-cards">
            {productCard}
          </div>
        )}
      </div>
    </section>
  );
};
