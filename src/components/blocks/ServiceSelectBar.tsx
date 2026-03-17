"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBasket } from "@/lib/basket";

interface Product {
  id: string;
  name: string;
  price: number;
}

/**
 * Sticky bottom bar for service pages — matches the service by slug to a Semble product
 * and lets the user select it.
 */
export function ServiceSelectBar({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem, items } = useBasket();

  useEffect(() => {
    // Try to match this service page to a Semble product
    fetch("/api/semble/products")
      .then((r) => r.json())
      .then((d) => {
        const products: Product[] = d.products || [];
        // Match by slugified product name
        const match = products.find((p) => {
          const productSlug = p.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          return productSlug === slug || slug.includes(productSlug) || productSlug.includes(slug);
        });
        if (match) setProduct(match);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) return null;

  const isSelected = items.some((i) => i.productId === product.id);

  const handleSelect = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="service-select-bar">
      <div className="service-select-bar-inner">
        <div className="service-select-bar-info">
          <span className="service-select-bar-name">{product.name}</span>
          <span className="service-select-bar-price">£{product.price}</span>
        </div>
        <div className="service-select-bar-actions">
          {(added || isSelected) && (
            <Link href="/basket" className="ds-btn ds-btn-secondary">
              View order
            </Link>
          )}
          <button
            className="ds-btn ds-btn-primary"
            onClick={handleSelect}
          >
            {added ? "Added ✓" : "Book this service"}
          </button>
        </div>
      </div>
    </div>
  );
}
