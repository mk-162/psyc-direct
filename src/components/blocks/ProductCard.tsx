"use client";

import React from "react";
import Link from "next/link";

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  slug?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  linkBase?: string;
}

export const ProductCard = ({ product, linkBase = "/book" }: ProductCardProps) => {
  return (
    <div className="card card-mineral">
      <div className="card-content">
        {product.category && (
          <div className="eyebrow">{product.category}</div>
        )}
        <h3 className="card-title">{product.name}</h3>
        {product.description && (
          <p className="card-description">{product.description}</p>
        )}
        <div className="product-card-footer">
          <span className="product-card-price">£{product.price}</span>
          <Link
            href={`${linkBase}/${product.slug || product.id}`}
            className="ds-btn ds-btn-primary"
          >
            Book now
          </Link>
        </div>
      </div>
    </div>
  );
};

interface ProductGridProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  products: ProductCardData[];
  theme?: "off-white" | "green" | "grey" | "terracotta";
  linkBase?: string;
}

export const ProductGrid = ({ eyebrow, heading, description, products, theme = "off-white", linkBase }: ProductGridProps) => {
  const themeClass =
    theme === "green"
      ? "section-deep-green theme-dark"
      : theme === "grey"
        ? "section-warm-stone theme-light"
        : theme === "terracotta"
          ? "section-terracotta theme-dark"
          : "section-mineral-white theme-light";

  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className="ds-container">
        {(eyebrow || heading) && (
          <div className="section-intro">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {heading && <h2 className="heading-display-lg">{heading}</h2>}
            {description && <p className="body-editorial">{description}</p>}
          </div>
        )}
        <div className="cards-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} linkBase={linkBase} />
          ))}
        </div>
      </div>
    </section>
  );
};
