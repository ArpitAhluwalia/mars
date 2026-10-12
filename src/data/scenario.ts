import type { AuditEvent, Email, Query } from "./types"

// The prototype's "now". Everything relative (due dates, ages) reads from here.
export const TODAY = "8 Oct 2026"
export const OWNER = { name: "Alex Rivera", initials: "AR", team: "FinOps" }

// Per-invoice details the OCR output doesn't carry.
export const invoiceMeta: Record<
  string,
  { ticket: string; due: string; received: string; emailId: string; source: "Email intake" | "Manual upload" }
> = {
  "ns-3001": { ticket: "TCK-4471", due: "Today", received: "8 Oct, 10:24 AM", emailId: "e-northstar", source: "Email intake" },
  "ns-3002": { ticket: "TCK-4472", due: "Today", received: "8 Oct, 10:24 AM", emailId: "e-northstar", source: "Email intake" },
  "ns-3003": { ticket: "TCK-4473", due: "Tomorrow", received: "8 Oct, 10:24 AM", emailId: "e-northstar", source: "Email intake" },
  "ns-3004": { ticket: "TCK-4474", due: "In 3 days", received: "8 Oct, 10:24 AM", emailId: "e-northstar", source: "Email intake" },
  "vt-0745": { ticket: "TCK-4478", due: "In 2 days", received: "8 Oct, 10:31 AM", emailId: "e-voss", source: "Email intake" },
  "ns-5001": { ticket: "TCK-4466", due: "Overdue 1d", received: "7 Oct, 4:12 PM", emailId: "e-northstar-5001", source: "Email intake" },
  "sol-100482": { ticket: "TCK-4463", due: "Today", received: "7 Oct, 11:40 AM", emailId: "e-solstice", source: "Email intake" },
  "cmc-88213": { ticket: "TCK-4469", due: "Tomorrow", received: "8 Oct, 8:47 AM", emailId: "e-cascade", source: "Manual upload" },
  "sol-100731": { ticket: "TCK-4302", due: "Paid", received: "12 Aug, 9:05 AM", emailId: "", source: "Email intake" },
  "sol-100892": { ticket: "TCK-4388", due: "Paid", received: "15 Sep, 2:31 PM", emailId: "", source: "Email intake" },
  "sol-101044": { ticket: "TCK-4467", due: "In 4 days", received: "7 Oct, 3:02 PM", emailId: "e-solstice-alpha", source: "Email intake" },
}

// Who in Sales owns the relationship, and so receives the Teams card.
export const salesRep: Record<string, { name: string; initials: string; title: string }> = {
  "Northstar Office Supplies": { name: "J. Alvarez", initials: "JA", title: "Account manager · Office supplies" },
  "Solstice Industrial Supply": { name: "Priya Raman", initials: "PR", title: "Account manager · Industrial" },
  "Cascade Materials Co.": { name: "Marcus Webb", initials: "MW", title: "Account manager · Materials" },
  "Voss & Tanner GmbH": { name: "Lena Hoffmann", initials: "LH", title: "Account manager · EMEA" },
}

export const emails: Email[] = [
  {
    id: "e-northstar",
    sender: "Northstar Billing",
    address: "billing@northstar-office.example",
    subject: "September invoices · NS-TEST-3001 to 3004",
    preview: "Four invoices for September deliveries, one PDF.",
    body: [
      "Hello Meriton AP,",
      "Please find our four September invoices attached as a single PDF, one invoice per page. PO references are printed on each invoice.",
      "Kind regards,\nNorthstar Office Supplies · Accounts receivable",
    ],
    time: "10:24 AM",
    received: "8 Oct 2026, 10:24 AM",
    unread: true,
    saved: true,
    attachments: [
      { name: "CU-003_four_single_page_invoices.pdf", pages: 4, size: "412 KB", invoiceIds: ["ns-3001", "ns-3002", "ns-3003", "ns-3004"], note: "Split into 4 invoices" },
    ],
  },
  {
    id: "e-voss",
    sender: "Voss & Tanner GmbH",
    address: "rechnungen@vosstanner.example",
    subject: "Rechnung VT-2026-0745",
    preview: "Invoice for March order, VAT at multiple rates.",
    body: [
      "Dear Meriton team,",
      "Attached is invoice VT-2026-0745 for the March order. VAT is itemised at both applicable rates.",
      "Mit freundlichen Grüßen,\nVoss & Tanner GmbH · Buchhaltung",
    ],
    time: "10:31 AM",
    received: "8 Oct 2026, 10:31 AM",
    unread: true,
    attachments: [{ name: "invoice_07_international_vat_multirate.pdf", pages: 1, size: "188 KB", invoiceIds: ["vt-0745"] }],
  },
  {
    id: "e-cascade",
    sender: "Cascade Materials Co.",
    address: "ar@cascadematerials.example",
    subject: "Invoice CMC-88213 · May deliveries",
    preview: "Multi-page invoice, totals carried across pages.",
    body: [
      "Hi,",
      "Our invoice CMC-88213 for May deliveries is attached. It runs to three pages with subtotals carried forward.",
      "Thanks,\nCascade Materials Co.",
    ],
    time: "8:47 AM",
    received: "8 Oct 2026, 8:47 AM",
    attachments: [{ name: "invoice_03_multipage_split_totals.pdf", pages: 3, size: "356 KB", invoiceIds: ["cmc-88213"] }],
  },
  {
    id: "e-northstar-dup",
    sender: "Northstar Billing",
    address: "billing@northstar-office.example",
    subject: "Re: NS-TEST-3002 · resending",
    preview: "Resending NS-TEST-3002 in case it was missed.",
    body: [
      "Hello again,",
      "Resending NS-TEST-3002 on its own in case it was missed in the batch.",
      "Northstar Office Supplies",
    ],
    time: "8:12 AM",
    received: "8 Oct 2026, 8:12 AM",
    duplicateOf: "ns-3002",
    attachments: [{ name: "sample_single_page_invoice_02.pdf", pages: 1, size: "164 KB", invoiceIds: [], note: "Duplicate of NS-TEST-3002" }],
  },
  {
    id: "e-northstar-5001",
    sender: "Northstar Billing",
    address: "billing@northstar-office.example",
    subject: "Invoice NS-TEST-5001 with delivery notes",
    preview: "Invoice plus packing slips in one file.",
    body: [
      "Hello,",
      "Attached is NS-TEST-5001 together with the packing slips for the same delivery.",
      "Northstar Office Supplies",
    ],
    time: "Yesterday",
    received: "7 Oct 2026, 4:12 PM",
    attachments: [{ name: "CU-005_noninvoice_sandwich.pdf", pages: 7, size: "1.1 MB", invoiceIds: ["ns-5001"], note: "1 invoice found · 4 non-invoice pages skipped" }],
  },
  {
    id: "e-solstice-alpha",
    sender: "Solstice Industrial Supply",
    address: "invoices@solstice-industrial.example",
    subject: "PO-44100 · release 3 of standing order",
    preview: "Third release against the annual mesh and angle order.",
    body: [
      "Hello Meriton AP,",
      "Invoice INV-101044 is the third release against standing order PO-44100.",
      "Best,\nSolstice Industrial Supply",
    ],
    time: "Yesterday",
    received: "7 Oct 2026, 3:02 PM",
    attachments: [{ name: "invoice_13_alpha_release_3.pdf", pages: 1, size: "142 KB", invoiceIds: ["sol-101044"] }],
  },
  {
    id: "e-solstice",
    sender: "Solstice Industrial Supply",
    address: "invoices@solstice-industrial.example",
    subject: "Invoice INV-100482",
    preview: "Brackets, bolts and freight for June.",
    body: ["Hello,", "Please see invoice INV-100482 attached.", "Best,\nSolstice Industrial Supply"],
    time: "Yesterday",
    received: "7 Oct 2026, 11:40 AM",
    attachments: [{ name: "sample_single_page_invoice.pdf", pages: 1, size: "131 KB", invoiceIds: ["sol-100482"] }],
  },
  {
    id: "e-wellness",
    sender: "People Team",
    address: "people@meriton.example",
    subject: "October Wellness Calendar",
    preview: "This month's sessions and drop-in times.",
    body: ["Hi all,", "Attached is the October wellness calendar.", "People Team"],
    time: "Yesterday",
    received: "7 Oct 2026, 9:15 AM",
    attachments: [{ name: "October Wellness Calendar.pdf", pages: 1, size: "96 KB", invoiceIds: [], note: "No invoice found" }],
  },
]

// Emails arrive and are processed automatically. Voss & Tanner is held back
// until "Sync mailbox" so intake can be shown live.
export const LATE_EMAIL_ID = "e-voss"

// Invoices already processed when the prototype opens.
export const initiallyQueued = [
  "ns-3001",
  "ns-3002",
  "ns-3003",
  "ns-3004",
  "ns-5001",
  "sol-100482",
  "cmc-88213",
  "sol-100731",
  "sol-100892",
  "sol-101044",
]

export const initiallyApproved: Record<string, string> = {
  "sol-100731": "14 Aug 2026, 3:20 PM",
  "sol-100892": "17 Sep 2026, 11:05 AM",
}

export const initialQueries: Query[] = [
  {
    id: "q-5001",
    invoiceId: "ns-5001",
    ticket: "TCK-4466",
    rep: "J. Alvarez",
    sentAt: "7 Oct, 4:40 PM",
    message:
      "Four lines on NS-TEST-5001 differ from PO-55104: shredder price, task chair price, desk converter quantity and barcode scanner quantity. Please confirm what was agreed, or correct the PO.",
    lineKeys: [],
  },
  {
    id: "q-100482",
    invoiceId: "sol-100482",
    ticket: "TCK-4463",
    rep: "Priya Raman",
    sentAt: "7 Oct, 12:05 PM",
    message:
      "INV-100482 bills 12 boxes of hex bolts against 10 on the PO, and freight at $85.00 against $45.00. Were these agreed with Solstice?",
    lineKeys: [],
    reply: {
      action: "approve",
      justification:
        "PO-55321: customer added 2 boxes of M8 bolts by phone on 10 June; freight raised to $85 for the expedited lift-gate delivery. Both agreed, OK to pay as billed.",
      at: "8 Oct, 9:12 AM",
    },
  },
]

// Line keys are filled in at start-up from the actual flagged lines.
export const seedAudit = (
  id: string,
  extra: AuditEvent[] = [],
): AuditEvent[] => {
  const meta = invoiceMeta[id]
  return [
    { at: meta.received, title: "Email received", detail: meta.source === "Manual upload" ? "Uploaded to MARS by Alex Rivera" : "Delivered to invoices@meriton.com", who: "System", kind: "intake" },
    { at: meta.received, title: "Invoice extracted", detail: "OCR read header, totals and line items", who: "MARS", kind: "ocr" },
    ...extra,
  ]
}
