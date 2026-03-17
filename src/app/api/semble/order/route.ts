import { NextRequest, NextResponse } from "next/server";
import {
  findPatientByEmail,
  createPatient,
  createInvoice,
  SEMBLE_IDS,
} from "@/lib/semble";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, dob, productId, productName, price } = body;

    if (!firstName || !lastName || !email || !productId || !productName || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderRef = `WEB-${Date.now().toString(36).toUpperCase()}`;
    const steps: string[] = [];

    // Step 1: Find or create patient
    let patientId: string;
    const existing = await findPatientByEmail(email);
    if (existing) {
      patientId = existing.id;
      steps.push(`Found existing patient: ${existing.firstName} ${existing.lastName} (${existing.id})`);
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
      steps.push(`Created patient: ${patient.firstName} ${patient.lastName} (${patient.id})`);
    }

    // Step 2: Create invoice
    const today = new Date().toISOString().split("T")[0];
    const invoice = await createInvoice({
      patientId,
      lineItems: [{ date: today, productId, quantity: 1, price: parseFloat(price) }],
      orderRef,
    });
    steps.push(`Created invoice: £${invoice?.total} — ${invoice?.status} (${invoice?.id})`);

    return NextResponse.json({
      success: true,
      orderRef,
      steps,
      summary: {
        patientId,
        invoiceId: invoice?.id,
        total: invoice?.total,
      },
    });
  } catch (err) {
    console.error("Semble order error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Order failed" },
      { status: 500 }
    );
  }
}
