import { useState } from "react"
import { Check, Send } from "lucide-react"
import { money, poLabel, qty, verdictLabel } from "../data/reconcile"
import type { Query, SalesAnswer } from "../data/types"
import { useMars, type InvoiceView } from "../state/store"
import { Avatar, Button, MarsAvatar } from "./ui"

export function draftQuestion(view: InvoiceView) {
  if (!view.po) {
    return `${view.invoice.invoiceNumber} references ${view.invoice.poNumber}, which isn't on file. Which PO should it be billed against?`
  }
  const lines = view.openLines
    .map((line) => `• ${line.description}: ${verdictLabel[line.verdict].toLowerCase()} (${money(line.difference, true)})`)
    .join("\n")
  return `Were these differences on ${view.invoice.invoiceNumber} agreed with ${view.invoice.vendor}?\n${lines}`
}

const suggestedReply = (view: InvoiceView, action: SalesAnswer) =>
  action === "approve"
    ? `${poLabel(view.po?.poNumber ?? view.invoice.poNumber)}: agreed with ${view.invoice.vendor}. OK to pay as billed.`
    : `${poLabel(view.po?.poNumber ?? view.invoice.poNumber)}: not agreed. Vendor to reissue at PO price.`

function TeamsCard({ query, view }: { query: Query; view: InvoiceView }) {
  const lines = view.checks.filter((line) => query.lineKeys.includes(line.key))
  return (
    <div className="tm-message">
      <MarsAvatar size={28} />
      <div className="tm-body">
        <span className="tm-meta">
          <strong>MARS</strong>
          <time>{query.sentAt}</time>
        </span>
        <div className="tm-card">
          <div className="tm-card-title">
            <strong>{lines.length ? "Approval needed" : "PO needed"}</strong>
            <small>
              {view.invoice.vendor} · {view.invoice.invoiceNumber} · {query.ticket}
            </small>
          </div>
          <p className="tm-card-text">{query.message.split("\n")[0]}</p>
          {lines.length > 0 && (
            <div className="tm-lines">
              {lines.map((line) => (
                <div className="tm-line" key={line.key}>
                  <span className="cell-stack">
                    <strong>{line.description}</strong>
                    <small>
                      Billed {qty(line.invoice.quantity)} × {money(line.invoice.unitPrice)} · PO{" "}
                      {line.po ? `${qty(line.po.quantity)} × ${money(line.po.unitPrice)}` : "—"}
                    </small>
                  </span>
                  <b>{money(line.difference, true)}</b>
                </div>
              ))}
            </div>
          )}
          <div className="tm-card-actions">
            <span className={query.reply?.action === "approve" ? "chosen" : ""}>Approve</span>
            <span className={query.reply?.action === "correct" ? "chosen" : ""}>Correct</span>
            <span>Open in MARS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplySimulator({ query, view }: { query: Query; view: InvoiceView }) {
  const { simulateReply, notify } = useMars()
  const [action, setAction] = useState<SalesAnswer>("approve")
  const [text, setText] = useState(() => suggestedReply(view, "approve"))
  return (
    <div className="simulator">
      <span className="simulator-label">Prototype · reply as {query.rep}</span>
      <div className="segmented">
        {(["approve", "correct"] as const).map((option) => (
          <button
            className={action === option ? "active" : ""}
            key={option}
            onClick={() => {
              setAction(option)
              setText(suggestedReply(view, option))
            }}
            type="button"
          >
            {option === "approve" ? "Approve" : "Needs correction"}
          </button>
        ))}
      </div>
      <label className="field">
        <textarea aria-label="Sales justification" onChange={(event) => setText(event.target.value)} rows={2} value={text} />
      </label>
      <Button
        disabled={!text.trim()}
        onClick={() => {
          simulateReply(query.id, action, text.trim())
          notify(`${query.rep} replied in Teams`)
        }}
        size="sm"
        variant="dark"
      >
        Send reply
      </Button>
    </div>
  )
}

export default function TeamsThread({ view, showSimulator = true }: { view: InvoiceView; showSimulator?: boolean }) {
  const { askSales, applyReply, notify } = useMars()
  const [message, setMessage] = useState(() => draftQuestion(view))
  const query = view.query
  const pending = query && !query.applied
  const canAsk = !pending && view.status !== "Approved" && (view.openLines.length > 0 || !view.po)

  return (
    <div className="thread">
      <div className="thread-to">
        <Avatar name={view.rep.name} size={32} />
        <span className="cell-stack">
          <strong>{view.rep.name}</strong>
          <small>{view.rep.title}</small>
        </span>
      </div>

      {query && (
        <div className="thread-messages">
          <TeamsCard query={query} view={view} />
          {query.reply ? (
            <div className="tm-message">
              <Avatar name={query.rep} size={28} />
              <div className="tm-body">
                <span className="tm-meta">
                  <strong>{query.rep}</strong>
                  <time>{query.reply.at}</time>
                </span>
                <div className={`tm-bubble ${query.reply.action}`}>
                  <b>{query.reply.action === "approve" ? "Approved" : "Needs correction"}</b>
                  <p>{query.reply.justification}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="tm-waiting">
              <span className="pulse" />
              Delivered · waiting for {query.rep}
            </div>
          )}
          {query.applied && (
            <div className="tm-applied">
              <Check size={14} /> Applied to {view.invoice.invoiceNumber}
            </div>
          )}
        </div>
      )}

      {pending && query.reply && (
        <div className="thread-action">
          <span>
            {query.reply.action === "approve"
              ? `Closes ${query.lineKeys.length} flagged line${query.lineKeys.length === 1 ? "" : "s"} on the invoice.`
              : "Lines stay open until the PO or invoice is corrected."}
          </span>
          <Button
            onClick={() => {
              applyReply(query.id)
              notify(query.reply?.action === "approve" ? "Sales approval applied" : "Correction noted")
            }}
            variant="primary"
          >
            {query.reply.action === "approve" ? "Apply approval" : "Acknowledge"}
          </Button>
        </div>
      )}

      {pending && !query.reply && showSimulator && <ReplySimulator query={query} view={view} />}

      {canAsk && (
        <div className="composer">
          <label className="field">
            <span>{query ? "Ask a follow-up" : "Message"}</span>
            <textarea onChange={(event) => setMessage(event.target.value)} rows={6} value={message} />
          </label>
          <div className="composer-foot">
            <small>Sent as a Teams card with the flagged lines attached.</small>
            <Button
              icon={Send}
              onClick={() => {
                askSales(view.id, message)
                notify(`Sent to ${view.rep.name} in Teams`)
              }}
              variant="primary"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
