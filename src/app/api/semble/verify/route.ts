import { NextRequest, NextResponse } from "next/server";
import { getInvoice } from "@/lib/semble";

// Called when customer returns from Semble Pay to verify payment went through
export async function GET(req: NextRequest) {
  const invoiceId = req.nextUrl.searchParams.get("invoiceId");

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
  }

  try {
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({
      invoiceId: invoice.id,
      total: invoice.total,
      outstanding: invoice.outstanding,
      status: invoice.paidOrOutstanding,
      paid: invoice.paidOrOutstanding === "Paid",
    });
  } catch (err) {
    console.error("Semble verify error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
