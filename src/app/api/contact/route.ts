import { NextRequest, NextResponse } from "next/server";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ─── EMAIL PROVIDER ───────────────────────────────────────────────
    // Set CONTACT_EMAIL_PROVIDER in .env.local to activate delivery.
    //
    // Option A — Resend (recommended):
    //   CONTACT_EMAIL_PROVIDER=resend
    //   RESEND_API_KEY=re_...
    //   CONTACT_TO_EMAIL=hello@cocoonwellness.com
    //   CONTACT_FROM_EMAIL=noreply@cocoonwellness.com
    //
    // Option B — SMTP via nodemailer:
    //   CONTACT_EMAIL_PROVIDER=smtp
    //   (add nodemailer to package.json and implement below)
    // ─────────────────────────────────────────────────────────────────

    const provider = process.env.CONTACT_EMAIL_PROVIDER;

    if (provider === "resend") {
      const apiKey = process.env.RESEND_API_KEY;
      const toEmail = process.env.CONTACT_TO_EMAIL || "hello@cocoonwellness.com";
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@cocoonwellness.com";

      const emailBody = [
        `New enquiry from the Cocoon website`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        ``,
        `Message:`,
        message,
      ].filter(Boolean).join("\n");

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New enquiry from ${name}`,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Contact Form] Resend error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } else {
      // No provider configured — log in dev
      if (process.env.NODE_ENV === "development") {
        console.log("[Contact Form] Submission (no email provider configured):", {
          name, email, phone, message,
        });
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[Contact Form] Error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
