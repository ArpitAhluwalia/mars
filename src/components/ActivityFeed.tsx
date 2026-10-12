import { ArrowUpRight, Download, FileText, Mail, MessagesSquare, Quote } from "lucide-react"
import { poLabel } from "../data/reconcile"
import type { AuditEvent } from "../data/types"
import type { InvoiceView } from "../state/store"
import { Avatar, MarsAvatar } from "./ui"

// Who did it, the sentence, and the object it touched — the Ramp activity pattern.
function actor(event: AuditEvent) {
  const name = event.who.split(" · ")[0]
  return name === "System" || name === "MARS" ? "MARS" : name
}

const sentences: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/^Email received$/, () => "received the email"],
  [/^Invoice extracted$/, () => "extracted the invoice"],
  [/^(.+) matched$/, (m) => `matched ${m[1]}`],
  [/^(.+) linked$/, (m) => `linked ${m[1]}`],
  [/^(\d+) likely POs found$/, (m) => `found ${m[1]} likely POs`],
  [/^No PO on file$/, () => "couldn't find the PO on file"],
  [/^Assigned for review$/, () => "routed it for review"],
  [/^OCR value corrected$/, () => "corrected an OCR value"],
  [/^Difference accepted$/, () => "accepted a difference"],
  [/^Sent to Sales in Teams$/, () => "asked Sales in Teams"],
  [/^Reminded Sales in Teams$/, () => "sent Sales a reminder"],
  [/^Sales reply · Approved$/, () => "approved as billed"],
  [/^Sales reply · Needs correction$/, () => "asked for a correction"],
  [/^Sales approval applied$/, () => "applied the Sales approval"],
  [/^Correction request noted$/, () => "noted the correction request"],
  [/^Invoice approved$/, () => "approved the invoice"],
]

export function sentence(title: string) {
  for (const [pattern, phrase] of sentences) {
    const match = title.match(pattern)
    if (match) return phrase(match)
  }
  return title.charAt(0).toLowerCase() + title.slice(1)
}

function Attachment({ event, view, onOpenQuery }: { event: AuditEvent; view: InvoiceView; onOpenQuery?: () => void }) {
  if (event.kind === "intake") {
    return (
      <div className="object-row">
        <span className="object-icon">
          <Mail size={16} strokeWidth={1.6} />
        </span>
        <span className="cell-stack">
          <strong>{event.detail}</strong>
          <small>invoices@meriton.com</small>
        </span>
      </div>
    )
  }
  if (event.kind === "ocr") {
    return (
      <div className="object-row">
        <span className="object-icon">
          <FileText size={16} strokeWidth={1.6} />
        </span>
        <span className="cell-stack">
          <strong>{view.invoice.sourceFile}</strong>
          <small>
            {view.invoice.lines.length} line items{view.invoice.sourcePages ? ` · page ${view.invoice.sourcePages}` : ""}
          </small>
        </span>
        <Download size={16} strokeWidth={1.6} />
      </div>
    )
  }
  if (event.kind === "match" && view.po && event.title.includes(view.po.poNumber)) {
    return (
      <div className="object-row">
        <span className="object-icon">
          <FileText size={16} strokeWidth={1.6} />
        </span>
        <span className="cell-stack">
          <strong>{poLabel(view.po.poNumber)}</strong>
          <small>{event.detail}</small>
        </span>
        <ArrowUpRight size={16} strokeWidth={1.6} />
      </div>
    )
  }
  if (event.kind === "sales" && event.detail.length > 60) {
    return (
      <div className="object-row quote">
        <span className="object-icon">
          <Quote size={15} strokeWidth={1.6} />
        </span>
        <span className="activity-quote">{event.detail}</span>
      </div>
    )
  }
  if (event.kind === "sales" && onOpenQuery) {
    return (
      <button className="object-row" onClick={onOpenQuery}>
        <span className="object-icon sales">
          <MessagesSquare size={16} strokeWidth={1.6} />
        </span>
        <span className="cell-stack">
          <strong>Teams chat · {view.rep.name}</strong>
          <small>{event.detail}</small>
        </span>
        <ArrowUpRight size={16} strokeWidth={1.6} />
      </button>
    )
  }
  return <p className="activity-detail">{event.detail}</p>
}

export default function ActivityFeed({
  events,
  view,
  onOpenQuery,
}: {
  events: AuditEvent[]
  view: InvoiceView
  onOpenQuery?: () => void
}) {
  return (
    <ol className="activity">
      {[...events].reverse().map((event, index) => {
        const who = actor(event)
        return (
          <li className="activity-item" key={`${event.title}-${index}`}>
            <div className="agent-card">
              <div className="agent-card-head">
                {who === "MARS" ? <MarsAvatar size={26} /> : <Avatar name={who} size={26} />}
                <span>
                  <strong>{who}</strong> {sentence(event.title)}
                </span>
                <span className="dot-sep">·</span>
                <time>{event.at}</time>
              </div>
              <Attachment event={event} onOpenQuery={onOpenQuery} view={view} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
