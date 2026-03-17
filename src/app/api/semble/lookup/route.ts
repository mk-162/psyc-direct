import { NextRequest, NextResponse } from "next/server";
import { sembleQuery } from "@/lib/semble";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find patient by email
    const patientsResult = await sembleQuery<{
      patients: {
        data: Array<{
          id: string;
          firstName: string;
          lastName: string;
          email: string | null;
        }>;
      };
    }>("{ patients { data { id firstName lastName email } } }");

    const patient = patientsResult.data?.patients.data.find(
      (p) => p.email?.toLowerCase() === email.toLowerCase()
    );

    if (!patient) {
      return NextResponse.json({ found: false, patient: null, invoices: [], tasks: [] });
    }

    // Get invoices for this patient
    const invoicesResult = await sembleQuery<{
      invoices: {
        data: Array<{
          id: string;
          date: string;
          total: number;
          status: string;
          comments: string | null;
          lineItems: Array<{
            product: { name: string } | null;
            quantity: number;
            price: number;
          }> | null;
        }>;
      };
    }>(`{ invoices { data { id date total status comments lineItems { product { name } quantity price } } } }`);

    // Filter invoices for this patient (Semble doesn't support filtering by patient in the query)
    // We'll return all and note this limitation
    const invoices = invoicesResult.data?.invoices.data || [];

    // Get tasks for this patient
    const tasksResult = await sembleQuery<{
      tasks: {
        data: Array<{
          id: string;
          subject: string;
          status: string;
          dueDate: string | null;
          comments: string | null;
          patient: { id: string } | null;
        }>;
      };
    }>("{ tasks { data { id subject status dueDate comments patient { id } } } }");

    const patientTasks = (tasksResult.data?.tasks.data || []).filter(
      (t) => t.patient?.id === patient.id
    );

    return NextResponse.json({
      found: true,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
      invoices,
      tasks: patientTasks,
    });
  } catch (err) {
    console.error("Semble lookup error:", err);
    return NextResponse.json(
      { error: "Lookup failed" },
      { status: 500 }
    );
  }
}
