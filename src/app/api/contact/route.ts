import { NextRequest, NextResponse } from "next/server";

const VALID_SECTORS = ['expert-witness', 'education', 'other'];
const VALID_SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];
const VALID_LEAD_SOURCES = [
  'repeat', 'google', 'recommendation', 'web-form', 'social-media',
  'bps', 'professional-directory', 'mailshot', 'exhibition',
  'advertisement', 'network-event', 'referral',
];
const MAX_FIELD_LENGTH = {
  firstName: 200, lastName: 200, email: 254, phone: 30,
  company: 200, message: 10000,
};

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const {
    sector, salutation, firstName, lastName, company,
    email, phone, leadSource, message,
    updatesExpertWitness, updatesEducation, privacyAccepted,
  } = body as Record<string, string | boolean>;

  // Required fields
  if (
    !sector || !salutation ||
    !(firstName as string)?.trim() || !(lastName as string)?.trim() ||
    !(company as string)?.trim() || !(email as string)?.trim() ||
    !(phone as string)?.trim() || !leadSource
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!privacyAccepted) {
    return NextResponse.json({ error: "Privacy policy must be accepted" }, { status: 400 });
  }

  // Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Whitelist checks
  if (!VALID_SECTORS.includes(sector as string)) {
    return NextResponse.json({ error: "Invalid sector" }, { status: 400 });
  }
  if (!VALID_SALUTATIONS.includes(salutation as string)) {
    return NextResponse.json({ error: "Invalid salutation" }, { status: 400 });
  }
  if (!VALID_LEAD_SOURCES.includes(leadSource as string)) {
    return NextResponse.json({ error: "Invalid lead source" }, { status: 400 });
  }

  // Length limits
  const f = firstName as string, l = lastName as string, e = email as string;
  const p = phone as string, c = company as string, m = (message as string) || '';
  if (
    f.length > MAX_FIELD_LENGTH.firstName ||
    l.length > MAX_FIELD_LENGTH.lastName ||
    e.length > MAX_FIELD_LENGTH.email ||
    m.length > MAX_FIELD_LENGTH.message
  ) {
    return NextResponse.json({ error: "Field exceeds maximum length" }, { status: 400 });
  }

  try {
    console.log("[contact-form] New enquiry:", {
      sector, salutation,
      name: `${f.trim()} ${l.trim()}`,
      company: c.trim(),
      email: e.trim(),
      phone: p.trim(),
      leadSource,
      messageLength: m.length,
      updates: {
        expertWitness: !!updatesExpertWitness,
        education: !!updatesEducation,
      },
      timestamp: new Date().toISOString(),
    });

    // TODO: Connect to email service (Resend, SendGrid, etc.)

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact-form] Submission error:", err);
    return NextResponse.json({ error: "Failed to process enquiry" }, { status: 500 });
  }
}
