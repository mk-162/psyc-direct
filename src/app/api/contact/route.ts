import { NextRequest, NextResponse } from "next/server";

const VALID_ENQUIRY_TYPES = ['expert-witness', 'education-assessment', 'join-network', 'general'];
const MAX_FIELD_LENGTH = { name: 200, email: 254, phone: 30, organisation: 200, message: 10000 };

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const { name, email, phone, organisation, enquiryType, message } = body as Record<string, string>;

  // Required fields
  if (!name?.trim() || !email?.trim() || !enquiryType || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Whitelist enquiry type
  if (!VALID_ENQUIRY_TYPES.includes(enquiryType)) {
    return NextResponse.json({ error: "Invalid enquiry type" }, { status: 400 });
  }

  // Length limits
  if (name.length > MAX_FIELD_LENGTH.name || email.length > MAX_FIELD_LENGTH.email || message.length > MAX_FIELD_LENGTH.message) {
    return NextResponse.json({ error: "Field exceeds maximum length" }, { status: 400 });
  }

  try {
    // Log the submission (visible in Vercel runtime logs)
    console.log("[contact-form] New enquiry:", {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "(not provided)",
      organisation: organisation?.trim() || "(not provided)",
      enquiryType,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // TODO: Connect to email service (Resend, SendGrid, etc.)
    // When no email service is configured, submissions are logged to
    // Vercel runtime logs. Set up Resend integration to deliver emails.

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[contact-form] Submission error:", e);
    return NextResponse.json({ error: "Failed to process enquiry" }, { status: 500 });
  }
}
