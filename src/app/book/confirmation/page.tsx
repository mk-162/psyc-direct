import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { ConfirmationClient } from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Booking Confirmed | Cocoon Healthcare",
  description: "Your booking has been confirmed at Cocoon Healthcare.",
};

export default async function BookingConfirmationPage() {
  let tinaData = null;

  try {
    const res = await client.queries.pages({ relativePath: "confirmation.json" });
    tinaData = {
      query: res.query,
      variables: res.variables,
      data: res.data,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error("Tina confirmation fetch error:", e);
  }

  return <ConfirmationClient tinaData={tinaData} />;
}
