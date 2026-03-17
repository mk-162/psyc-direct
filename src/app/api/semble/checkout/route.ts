import { NextRequest, NextResponse } from "next/server";
import {
  findPatientByEmail,
  createPatient,
  createInvoice,
  getInvoice,
  addInvoicePayment,
  PAYMENT_TYPES,
} from "@/lib/semble";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, dob, notes, items } = body;

    if (!firstName || !lastName || !email || !dob || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, dob, items)" },
        { status: 400 }
      );
    }

    const orderRef = `WEB-${Date.now().toString(36).toUpperCase()}`;
    const steps: string[] = [];

    // Step 1: Find or create patient
    let patientId: string;
    const existing = await findPatientByEmail(email);
    if (existing) {
      patientId = existing.id;
      steps.push(`✅ Found existing patient: ${existing.firstName} ${existing.lastName}`);
    } else {
      const patient = await createPatient({
        first: firstName,
        last: lastName,
        email,
        phone,
        dob,
      });
      if (!patient) throw new Error("Failed to create patient");
      patientId = patient.id;
      steps.push(`✅ Created patient: ${patient.firstName} ${patient.lastName}`);
    }

    // Step 2: Create invoice with all line items
    const today = new Date().toISOString().split("T")[0];
    const totalAmount = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + i.price * i.quantity,
      0
    );

    const lineItems = items.map(
      (item: { productId: string; price: number; quantity: number }) => ({
        date: today,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
    );

    const sanitisedNotes = notes
      ? notes.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")
      : "";
    const invoiceComment = sanitisedNotes
      ? `Online order ${orderRef} — Patient notes: ${sanitisedNotes}`
      : `Online order ${orderRef}`;

    const invoice = await createInvoice({
      patientId,
      lineItems,
      orderRef: invoiceComment,
    });

    if (!invoice) throw new Error("Failed to create invoice");
    steps.push(`✅ Created invoice: £${invoice.total} (${invoice.id})`);

    // Step 3: Check for Semble Pay payment link
    const fullInvoice = await getInvoice(invoice.id);
    const paymentLinkUrl = fullInvoice?.paymentLinkUrl;

    if (paymentLinkUrl) {
      // Production path: Semble Pay is connected — redirect to payment link
      steps.push(`✅ Semble Pay link available — redirecting to payment`);
      return NextResponse.json({
        success: true,
        orderRef,
        steps,
        paymentMode: "semble-pay",
        paymentUrl: paymentLinkUrl,
        summary: {
          patientId,
          invoiceId: invoice.id,
          total: invoice.total,
          itemCount: items.length,
        },
      });
    }

    // Sandbox/fallback path: Record payment directly
    const payment = await addInvoicePayment({
      invoiceId: invoice.id,
      amount: totalAmount,
      paymentTypeId: PAYMENT_TYPES.debitCard,
      comment: `Online payment — ${orderRef}`,
    });
    steps.push(
      `✅ Payment recorded: £${totalAmount} — invoice ${payment?.paidOrOutstanding || "paid"}`
    );

    return NextResponse.json({
      success: true,
      orderRef,
      steps,
      paymentMode: "direct",
      summary: {
        patientId,
        invoiceId: invoice.id,
        total: invoice.total,
        outstanding: payment?.outstanding ?? 0,
        paidOrOutstanding: payment?.paidOrOutstanding || "Paid",
        itemCount: items.length,
      },
    });
  } catch (err) {
    console.error("Semble checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
