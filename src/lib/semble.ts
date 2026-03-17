/**
 * Semble GraphQL API client
 */

const SEMBLE_URL = process.env.SEMBLE_API_URL || "https://open.sandbox.semble.io/graphql";
const SEMBLE_TOKEN = process.env.SEMBLE_SANDBOX_TOKEN || "";

// Known IDs from sandbox
export const SEMBLE_IDS = {
  ben: "69a0352b28d4ebeccaefd33a",
  location: "69a0352b28d4ebeccaefd335",
  practice: "69a0352b28d4ebeccaefd2f5",
};

interface GraphQLResponse<T = Record<string, unknown>> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function sembleQuery<T = Record<string, unknown>>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const res = await fetch(SEMBLE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": SEMBLE_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Semble API error: ${res.status}`);
  }

  return res.json();
}

// ── Queries ──

export async function getProducts() {
  const result = await sembleQuery<{
    products: {
      data: Array<{
        id: string;
        name: string;
        price: number;
        productType: string;
        duration: number | null;
        isBookable: boolean;
        isVideoConsultation: boolean | null;
      }>;
    };
  }>("{ products { data { id name price productType duration isBookable isVideoConsultation } } }");
  return result.data?.products.data || [];
}

export async function findPatientByEmail(email: string) {
  // Semble doesn't have a direct email filter, so we fetch all and filter
  // For production, use cursor pagination
  const result = await sembleQuery<{
    patients: { data: Array<{ id: string; firstName: string; lastName: string; email: string | null }> };
  }>("{ patients { data { id firstName lastName email } } }");
  return result.data?.patients.data.find(
    (p) => p.email?.toLowerCase() === email.toLowerCase()
  );
}

// ── Mutations ──

export async function createPatient(data: {
  first: string;
  last: string;
  email: string;
  phone?: string;
  dob?: string;
  address?: string;
  city?: string;
  postcode?: string;
}) {
  const args = [
    `first: "${data.first}"`,
    `last: "${data.last}"`,
    `email: "${data.email}"`,
    data.phone ? `phoneNumber: "${data.phone}"` : "",
    data.dob ? `dob: "${data.dob}"` : "",
    data.address ? `address: "${data.address}"` : "",
    data.city ? `city: "${data.city}"` : "",
    data.postcode ? `postcode: "${data.postcode}"` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const result = await sembleQuery<{
    createPatient: { data: { id: string; firstName: string; lastName: string } | null; error: string | null };
  }>(`mutation { createPatient(${args}) { data { id firstName lastName } error } }`);

  if (result.data?.createPatient.error) {
    throw new Error(result.data.createPatient.error);
  }
  return result.data?.createPatient.data;
}

export async function createTask(data: {
  subject: string;
  comments: string;
  assignedTo: string;
  patientId: string;
}) {
  const result = await sembleQuery<{
    createTask: { data: { id: string; subject: string } | null; error: string | null };
  }>(
    `mutation { createTask(taskData: {
      subject: "${data.subject.replace(/"/g, '\\"')}"
      comments: "${data.comments.replace(/"/g, '\\"')}"
      assignedTo: "${data.assignedTo}"
      patient: "${data.patientId}"
      taskType: lab
      priority: high
      status: open
    }) { data { id subject } error } }`
  );

  if (result.data?.createTask.error) {
    throw new Error(result.data.createTask.error);
  }
  return result.data?.createTask.data;
}

// ── Payment ──

export async function getInvoice(invoiceId: string) {
  const result = await sembleQuery<{
    invoice: {
      id: string;
      total: number;
      status: string;
      outstanding: number;
      paidOrOutstanding: string;
      paymentLinkUrl: string | null;
      payments: Array<{ id: string; paymentAmount: number }> | null;
    } | null;
  }>(`{ invoice(id: "${invoiceId}") { id total status outstanding paidOrOutstanding paymentLinkUrl payments { id paymentAmount } } }`);
  return result.data?.invoice;
}

export async function addInvoicePayment(data: {
  invoiceId: string;
  amount: number;
  paymentTypeId: string;
  comment?: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  const comment = data.comment ? `comment: "${data.comment.replace(/"/g, '\\"')}"` : "";

  const result = await sembleQuery<{
    addInvoicePayment: {
      data: { id: string; total: number; outstanding: number; paidOrOutstanding: string } | null;
      error: string | null;
    };
  }>(
    `mutation { addInvoicePayment(
      invoiceId: "${data.invoiceId}"
      paymentData: {
        paymentAmount: ${data.amount}
        paymentTypeId: "${data.paymentTypeId}"
        paymentDate: "${today}"
        ${comment}
      }
    ) { data { id total outstanding paidOrOutstanding } error } }`
  );

  if (result.data?.addInvoicePayment.error) {
    throw new Error(result.data.addInvoicePayment.error);
  }
  return result.data?.addInvoicePayment.data;
}

// Known payment type IDs (sandbox)
export const PAYMENT_TYPES = {
  debitCard: "69a0352b28d4ebeccaefd30c",
  creditCard: "69a0352b28d4ebeccaefd30d",
  cash: "69a0352b28d4ebeccaefd30e",
  bankTransfer: "69a0352b28d4ebeccaefd30f",
  insurance: "69a0352b28d4ebeccaefd313",
};

// ── Invoices ──

export async function createInvoice(data: {
  patientId: string;
  lineItems: Array<{ date: string; productId: string; quantity: number; price: number }>;
  orderRef: string;
  // Legacy single-item support
  productId?: string;
  price?: number;
}) {
  const today = new Date().toISOString().split("T")[0];

  // Support both multi-item and legacy single-item
  const items = data.lineItems.length > 0
    ? data.lineItems
    : data.productId
      ? [{ date: today, productId: data.productId, quantity: 1, price: data.price || 0 }]
      : [];

  const lineItemsStr = items
    .map(
      (li) =>
        `{ date: "${li.date}", productId: "${li.productId}", quantity: ${li.quantity}, price: ${li.price} }`
    )
    .join(", ");

  const result = await sembleQuery<{
    createInvoice: { data: { id: string; total: number; status: string } | null; error: string | null };
  }>(
    `mutation { createInvoice(invoiceData: {
      date: "${today}"
      patientId: "${data.patientId}"
      doctorId: "${SEMBLE_IDS.ben}"
      locationId: "${SEMBLE_IDS.location}"
      comments: "${data.orderRef.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"
      lineItems: [${lineItemsStr}]
    }) { data { id total status } error } }`
  );

  if (result.data?.createInvoice.error) {
    throw new Error(result.data.createInvoice.error);
  }
  return result.data?.createInvoice.data;
}
