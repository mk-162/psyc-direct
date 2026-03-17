"use client";

import { useState, useEffect } from "react";
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

const TYPE_LABELS: Record<string, string> = {
  appointment: "Consultation",
  lab: "Laboratory Test",
  vaccine: "Vaccination",
  pathway: "Care Pathway",
  other: "Service",
};

const CATEGORY_MAP: Record<string, string> = {
  "Well Person Full check up": "Health Screening",
  "Sexual Health screen (full- incl bloods & PCR)": "Specialist Clinics",
  "Initial consultation": "Consultations",
  "Follow-up": "Consultations",
  "Video Consultation": "Consultations",
  "Telephone consultation": "Consultations",
  "New patient": "Consultations",
  "Children": "Consultations",
  "Family pathway": "Consultations",
  "Electrocardiogram": "Diagnostics",
  "Chest X-ray": "Diagnostics",
  "Pregnancy test": "Diagnostics",
  "Cervical smear\u00a0+ HPV testing": "Women's Health",
  "Hepatitis A": "Vaccinations",
  "Hepatitis B": "Vaccinations",
  "Hepatitis A and B": "Vaccinations",
  "Home visit (day)": "Home Visits",
  "Home visit (night)": "Home Visits",
  "Insurance claim forms, etc.": "Admin",
  "Passport forms": "Admin",
};

const CATEGORY_ORDER = [
  "All",
  "Health Screening",
  "Specialist Clinics",
  "Consultations",
  "Women's Health",
  "Diagnostics",
  "Vaccinations",
  "Home Visits",
  "Admin",
];

export function ServicesGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem, items } = useBasket();

  useEffect(() => {
    fetch("/api/semble/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const categorised = products.map((p) => ({
    ...p,
    category: CATEGORY_MAP[p.name] || "Other",
  }));

  const filtered =
    activeCategory === "All"
      ? categorised
      : categorised.filter((p) => p.category === activeCategory);

  const categories = CATEGORY_ORDER.filter(
    (c) => c === "All" || categorised.some((p) => p.category === c)
  );

  const isInBasket = (id: string) => items.some((i) => i.productId === id);

  return (
    <section className="ds-section section-bleed section-mineral-white theme-light">
      <div className="ds-container">
        <div className="section-intro">
          <div className="eyebrow">Browse Services</div>
          <h2 className="heading-display-lg">What we offer</h2>
        </div>

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="body-editorial">Loading services…</p>}

        {!loading && filtered.length === 0 && (
          <p className="body-editorial">No services found in this category.</p>
        )}

        <div className="cards-grid">
          {filtered
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => {
              const added = addedId === product.id;
              const inBasket = isInBasket(product.id);
              const typeLabel = TYPE_LABELS[product.productType] || "Service";

              return (
                <div key={product.id} className="card card-mineral">
                  <div className="card-content">
                    <div className="eyebrow">{product.category}</div>
                    <h3 className="card-title">{product.name}</h3>

                    {/* Extra details from Semble */}
                    <div className="product-card-meta">
                      <span className="product-card-type">{typeLabel}</span>
                      {product.duration && (
                        <span className="product-card-duration">{product.duration} min</span>
                      )}
                      {product.isVideoConsultation && (
                        <span className="product-card-video">Video</span>
                      )}
                    </div>

                    <div className="product-card-footer">
                      <span className="product-card-price">£{product.price}</span>
                      <button
                        className={`ds-btn ${added || inBasket ? "ds-btn-added" : "ds-btn-primary"}`}
                        onClick={() => handleAdd(product)}
                      >
                        {added ? "Added ✓" : "Add"}
                      </button>
                    </div>

                    {inBasket && !added && (
                      <Link href="/checkout" className="product-card-checkout-link">
                        Proceed to checkout →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
