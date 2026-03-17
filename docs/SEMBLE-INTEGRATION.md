# Semble API Integration — Cocoon

## What is Semble?
Cocoon's clinical management system (patient records, lab ordering, consultations, invoicing). Semble is the backend that staff use day-to-day.

## The Goal
Connect the Cocoon ecommerce website to Semble so that when a customer buys a blood test online, it flows into Semble with minimal manual intervention.

## Sandbox Access
- **URL:** https://app.sandbox.semble.io/login
- **Username:** Ben
- **Email:** ben@cocoon-hgt.com
- **Password:** CocoonHarrogate1#
- **Expires:** 25 March 2026
- **Practice ID:** 6938093a328ca7aee9a5b19e
- **Account name:** Cocoon - Sam Naughton

## API Docs
- https://docs.semble.io/docs/API/overview/

## Sandbox API Token
Stored in `.env` as `SEMBLE_SANDBOX_TOKEN`
- Practice (from JWT): `69a0352b28d4ebeccaefd2f5`

## What the API CAN Do
- **Create/update patient profiles** — name, DOB, email, address, contacts
- **Query lab product catalogs** — view available lab products and pricing (read-only)
- **Query lab orders and status** — view existing orders (read-only)
- **Create invoices with product lines** — `createInvoice` mutation with line items/product IDs
- **Create tasks** — `createTask` mutation, assign to staff, link to patient
- **Create bookings** — `createBooking` (requires start/end time)

## What the API CANNOT Do (as of Feb 2026)
- ❌ **Add a lab product to a patient record** — no endpoint exists
- ❌ **Trigger lab order submission** — must be done manually in Semble UI
- ❌ **Create/update consultation notes** — query only, not mutable
- ❌ **Pre-generate a lab order number** — only created when "Order labs" button is pressed in Semble
- ❌ **Create bookings without time slots** — start/end times required

## Recommended Workflow (from Semble support)
When an ecommerce order comes in:
1. **Create/update patient profile** via API
2. **Create a Task** via API → assign to staff member, link to patient
3. Staff sees task → manually creates consultation → adds lab product → orders labs

## Open Problem: Lab Result Matching
- Nationwide (lab partner) needs a unique reference to upload results back into Semble
- The lab order number only exists after manual "Order labs" step in Semble
- No API-accessible identifier exists before that point
- **This is currently unsolved**

## Semble Connect
Semble's built-in automation layer. Won't help here because the underlying API endpoints for adding products and triggering lab orders don't exist yet.

## Key Contacts
- **Maurine Aguié** — Semble Customer Support (support@semble.io)
- **Ben Naughton** — Cocoon (ben@cocoon-hgt.com), leading the integration effort

## Status
- Sandbox provisioned 26 Feb 2026
- No development started yet
- Booking section on website parked (Phase 2)
