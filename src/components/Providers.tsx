"use client";

import { BasketProvider } from "@/lib/basket";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <BasketProvider>{children}</BasketProvider>;
}
