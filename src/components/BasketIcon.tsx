"use client";

import Link from "next/link";
import { useBasket } from "@/lib/basket";

export function BasketIcon() {
  const { itemCount } = useBasket();

  if (itemCount === 0) return null;

  return (
    <Link href="/checkout" className="nav-basket" aria-label={`Basket (${itemCount} items)`}>
      <svg className="nav-basket-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      <span className="nav-basket-count">{itemCount}</span>
    </Link>
  );
}
