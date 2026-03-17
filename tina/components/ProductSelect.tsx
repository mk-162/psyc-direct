import React, { useState, useEffect } from "react";
import { wrapFieldsWithMeta } from "tinacms";

interface Product {
  id: string;
  name: string;
  price: number;
  productType: string;
}

const ProductSelectComponent = wrapFieldsWithMeta(({ input }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/semble/products")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setProducts(
          (d.products || []).sort((a: Product, b: Product) =>
            a.name.localeCompare(b.name)
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "8px 0", color: "#666", fontSize: "14px" }}>
        Loading products…
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ padding: "8px 0", color: "#c00", fontSize: "14px" }}>
          {error}
        </div>
        <input
          type="text"
          value={input.value || ""}
          onChange={(e) => input.onChange(e.target.value)}
          placeholder="Enter product ID manually"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #e1ddec",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <select
        value={input.value || ""}
        onChange={(e) => input.onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #e1ddec",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        <option value="">— Select a product —</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — £{p.price}
          </option>
        ))}
      </select>
      {input.value && (
        <div
          style={{
            marginTop: "4px",
            fontSize: "12px",
            color: "#888",
            fontFamily: "monospace",
          }}
        >
          ID: {input.value}
        </div>
      )}
    </div>
  );
});

export default ProductSelectComponent;
