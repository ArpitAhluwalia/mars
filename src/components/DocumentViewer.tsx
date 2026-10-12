import { useState } from "react"
import { Minus, Plus, RotateCw } from "lucide-react"
import { money, poLabel, qty } from "../data/reconcile"
import type { Email, LineCheck, OcrInvoice, PurchaseOrder } from "../data/types"

const date = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"

type Highlight = Record<string, "exception" | "tolerance">

function Paper({
  kind,
  doc,
  title,
  number,
  highlight,
}: {
  kind: "invoice" | "po"
  doc: OcrInvoice | PurchaseOrder
  title: string
  number: string
  highlight: Highlight
}) {
  const isInvoice = kind === "invoice"
  return (
    <article className="paper">
      <header className="paper-head">
        <div>
          <h3>{title}</h3>
          <small>{isInvoice ? doc.vendorAddress : "Meriton Procurement · 1200 Main Street, Dallas TX"}</small>
        </div>
        <span className="paper-kind">{isInvoice ? "Invoice" : "Purchase order"}</span>
      </header>
      <div className="paper-meta">
        <span>
          <small>{isInvoice ? "Invoice total" : "Order total"}</small>
          <strong className="paper-total">{money(doc.total)}</strong>
        </span>
        <span>
          <small>{isInvoice ? "Invoice number" : "PO number"}</small>
          {number}
        </span>
        <span>
          <small>{isInvoice ? "Issued" : "Ordered"}</small>
          {date(doc.date)}
        </span>
        <span>
          <small>{isInvoice ? "PO reference" : "Supplier"}</small>
          {isInvoice ? doc.poNumber : doc.vendor}
        </span>
      </div>
      <div className="paper-lines">
        <div className="paper-line paper-line-head">
          <span>Item</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Total</span>
        </div>
        {doc.lines.map((line, index) => (
          <div className={`paper-line ${highlight[line.description] ?? ""}`} key={index}>
            <span>{line.description}</span>
            <span>{qty(line.quantity)}</span>
            <span>{money(line.unitPrice)}</span>
            <span>{money(line.lineTotal)}</span>
          </div>
        ))}
      </div>
      <div className="paper-totals">
        <span>
          Subtotal <b>{money(doc.subtotal)}</b>
        </span>
        {!!doc.discount && (
          <span>
            Discount <b>-{money(doc.discount)}</b>
          </span>
        )}
        <span>
          Tax <b>{money(doc.tax)}</b>
        </span>
        <span className="grand">
          Total <b>{money(doc.total)}</b>
        </span>
      </div>
    </article>
  )
}

export function EmailPaper({ email }: { email: Email }) {
  return (
    <article className="paper paper-email">
      <h3>{email.subject}</h3>
      <dl>
        <dt>From</dt>
        <dd>
          {email.sender} &lt;{email.address}&gt;
        </dd>
        <dt>To</dt>
        <dd>invoices@meriton.com</dd>
        <dt>Received</dt>
        <dd>{email.received}</dd>
      </dl>
      {email.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <div className="paper-attachments">
        {email.attachments.map((file) => (
          <span key={file.name}>
            <b>PDF</b> {file.name} · {file.pages} page{file.pages === 1 ? "" : "s"}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function DocumentViewer({
  invoice,
  po,
  checks = [],
  show,
}: {
  invoice: OcrInvoice
  po: PurchaseOrder | null
  checks?: LineCheck[]
  show: "invoice" | "po"
}) {
  const [zoom, setZoom] = useState(1)
  const invoiceHighlight: Highlight = {}
  const poHighlight: Highlight = {}
  for (const line of checks) {
    const tone = line.verdict !== "match" ? "exception" : !line.exact ? "tolerance" : null
    if (!tone) continue
    invoiceHighlight[line.invoice.description] = tone
    if (line.po) poHighlight[line.po.description] = tone
  }

  return (
    <div className="viewer">
      <div className="viewer-canvas">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
          {show === "invoice" ? (
            <Paper doc={invoice} highlight={invoiceHighlight} kind="invoice" number={invoice.invoiceNumber ?? "—"} title={invoice.vendor} />
          ) : po ? (
            <Paper doc={po} highlight={poHighlight} kind="po" number={poLabel(po.poNumber)} title="Meriton" />
          ) : (
            <div className="paper paper-empty">No purchase order linked yet.</div>
          )}
        </div>
      </div>
      <div className="viewer-controls">
        <button aria-label="Zoom in" onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}>
          <Plus size={15} />
        </button>
        <button aria-label="Zoom out" onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}>
          <Minus size={15} />
        </button>
        <button aria-label="Reset zoom" onClick={() => setZoom(1)}>
          <RotateCw size={14} />
        </button>
      </div>
    </div>
  )
}
