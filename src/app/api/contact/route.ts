import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, organisation, enquiryType, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !enquiryType || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Log the submission (visible in Vercel runtime logs)
    console.log("[contact-form] New enquiry:", {
      name,
      email,
      phone: phone || "(not provided)",
      organisation: organisation || "(not provided)",
      enquiryType,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // TODO: Connect to email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'Psychology Direct <noreply@psychologydirect.co.uk>',
    //   to: 'enquiries@psychologydirect.co.uk',
    //   subject: `New ${enquiryType} enquiry from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nOrganisation: ${organisation}\nType: ${enquiryType}\n\nMessage:\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[contact-form] Submission error:", e);
    return NextResponse.json({ error: "Failed to process enquiry" }, { status: 500 });
  }
}
