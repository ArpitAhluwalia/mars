export type LineItem = {
  description: string
  quantity: number | null
  unit: string | null
  unitPrice: number | null
  lineTotal: number | null
}

type DocumentBase = {
  id: string
  vendor: string
  vendorAddress: string
  date: string | null
  poNumber: string
  subtotal: number | null
  tax: number | null
  discount: number | null
  total: number | null
  lines: LineItem[]
}

export type PurchaseOrder = DocumentBase & {
  notes: string
  standing?: { valueCap: number; validFrom: string; validTo: string }
}

export type OcrInvoice = DocumentBase & {
  invoiceNumber: string | null
  sourceFile: string
  sourcePages: string | null
  confidence: Record<string, number>
}

export type InvoiceStatus =
  | "Missing PO"
  | "Confirm PO"
  | "Needs review"
  | "With Sales"
  | "Sales replied"
  | "Correction requested"
  | "Ready to approve"
  | "Approved"

export type LineVerdict = "match" | "price" | "quantity" | "price-quantity" | "not-on-po"

export type LineCheck = {
  key: string
  description: string
  invoice: LineItem
  po: LineItem | null
  verdict: LineVerdict
  // A "match" can still differ by a few cents or units inside the tolerance band.
  exact: boolean
  difference: number
}

export type SalesAnswer = "approve" | "correct"

export type Query = {
  id: string
  invoiceId: string
  ticket: string
  rep: string
  sentAt: string
  message: string
  lineKeys: string[]
  reply?: { action: SalesAnswer; justification: string; at: string }
  applied?: boolean
}

export type AuditEvent = {
  at: string
  title: string
  detail: string
  who: string
  kind: "intake" | "ocr" | "match" | "edit" | "sales" | "approval"
}

export type Email = {
  id: string
  sender: string
  address: string
  subject: string
  preview: string
  body: string[]
  time: string
  received: string
  unread?: boolean
  saved?: boolean
  attachments: {
    name: string
    pages: number
    size: string
    invoiceIds: string[]
    note?: string
  }[]
  duplicateOf?: string
}
