import { useMemo, useState } from "react"
import { ArrowUpRight, Copy, Eye, FileText, FileX, Loader2, RefreshCw, X } from "lucide-react"
import DocumentViewer from "../components/DocumentViewer"
import { Avatar, Button, MarsAvatar, SearchField, StatusPill } from "../components/ui"
import { money } from "../data/reconcile"
import { emails } from "../data/scenario"
import { ocrInvoices } from "../data/source"
import type { Email } from "../data/types"
import { deriveInvoice, useMars } from "../state/store"

type Filter = "all" | "invoices" | "skipped"

const invoiceIdsOf = (email: Email) => email.attachments.flatMap((file) => file.invoiceIds)

function outcome(email: Email) {
  const count = invoiceIdsOf(email).length
  if (email.duplicateOf) return { label: "Duplicate", tone: "neutral" }
  if (!count) return { label: "Not an invoice", tone: "neutral" }
  return { label: `${count} invoice${count > 1 ? "s" : ""}`, tone: "accent" }
}

function ProcessingCard({ email }: { email: Email }) {
  const { state, openInvoice } = useMars()
  const processing = state.processingEmail === email.id
  const ids = invoiceIdsOf(email)
  const duplicate = email.duplicateOf ? deriveInvoice(state, email.duplicateOf) : null
  const skippedNote = email.attachments.map((file) => file.note).find((note) => note?.includes("skipped"))

  if (processing) {
    return (
      <div className="agent-card">
        <div className="agent-card-head">
          <MarsAvatar size={26} />
          <span>
            <strong>MARS</strong> is reading {email.attachments[0].name}
          </span>
          <Loader2 className="spin" size={14} />
        </div>
        <div className="object-row shimmer" style={{ height: 52 }} />
      </div>
    )
  }

  return (
    <div className="agent-card">
      <div className="agent-card-head">
        <MarsAvatar size={26} />
        <span>
          <strong>MARS</strong>{" "}
          {duplicate
            ? "recognised a duplicate and didn't process it again"
            : ids.length
              ? `created ${ids.length} invoice${ids.length > 1 ? "s" : ""} and matched ${ids.length > 1 ? "them" : "it"} to POs`
              : "found no invoice in this email"}
        </span>
        <span className="dot-sep">·</span>
        <time>{email.time}</time>
      </div>
      {ids.map((id) => {
        const view = deriveInvoice(state, id)
        return (
          <button className="object-row" key={id} onClick={() => openInvoice(id)}>
            <span className="object-icon">
              <FileText size={16} strokeWidth={1.6} />
            </span>
            <span className="cell-stack">
              <strong>
                {view.invoice.invoiceNumber} · {money(view.invoice.total)}
              </strong>
              <small>{view.finding}</small>
            </span>
            <StatusPill status={view.status} />
            <ArrowUpRight size={16} strokeWidth={1.6} />
          </button>
        )
      })}
      {duplicate && (
        <button className="object-row" onClick={() => openInvoice(duplicate.id)}>
          <span className="object-icon">
            <Copy size={16} strokeWidth={1.6} />
          </span>
          <span className="cell-stack">
            <strong>Same as {duplicate.invoice.invoiceNumber}</strong>
            <small>Already received {duplicate.meta.received} · prevents a double payment</small>
          </span>
          <StatusPill status={duplicate.status} />
          <ArrowUpRight size={16} strokeWidth={1.6} />
        </button>
      )}
      {!ids.length && !duplicate && (
        <div className="object-row">
          <span className="object-icon">
            <FileX size={16} strokeWidth={1.6} />
          </span>
          <span className="cell-stack">
            <strong>{email.attachments[0].name}</strong>
            <small>Read every page · nothing to reconcile, so nothing was created</small>
          </span>
        </div>
      )}
      {skippedNote && <p className="agent-note">{skippedNote.replace("1 invoice found · ", "")}: packing slips aren't invoices.</p>}
    </div>
  )
}

function PreviewDrawer({ email, index, close }: { email: Email; index: number; close: () => void }) {
  const file = email.attachments[index]
  const invoices = file.invoiceIds.map((id) => ocrInvoices.find((invoice) => invoice.id === id)!)
  return (
    <>
      <button aria-label="Close preview" className="scrim" onClick={close} />
      <aside aria-label="Attachment preview" className="drawer">
        <header className="drawer-head">
          <span className="cell-stack">
            <strong>{file.name}</strong>
            <small>
              {file.pages} page{file.pages === 1 ? "" : "s"} · {file.size}
            </small>
          </span>
          <Button aria-label="Close preview" icon={X} onClick={close} size="sm" variant="ghost" />
        </header>
        <div className="drawer-body">
          {invoices.length ? (
            invoices.map((invoice) => <DocumentViewer invoice={invoice} key={invoice.id} po={null} show="invoice" />)
          ) : (
            <div className="paper paper-empty">{file.note}</div>
          )}
        </div>
      </aside>
    </>
  )
}

export default function Inbox() {
  const { state, syncMailbox } = useMars()
  const [selected, setSelected] = useState(state.inbox[0])
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const [preview, setPreview] = useState<number | null>(null)
  const syncing = !!state.processingEmail

  const inbox = state.inbox.map((id) => emails.find((email) => email.id === id)!)
  const visible = useMemo(
    () =>
      inbox.filter((email) => {
        const isInvoice = invoiceIdsOf(email).length > 0
        const matchesFilter = filter === "all" || (filter === "invoices" ? isInvoice : !isInvoice)
        return matchesFilter && `${email.sender} ${email.subject}`.toLowerCase().includes(query.toLowerCase())
      }),
    [filter, inbox, query],
  )
  const email = inbox.find((item) => item.id === selected) ?? inbox[0]

  return (
    <div className="split">
      <aside className="split-list">
        <header className="split-head">
          <div className="split-title">
            <span className="title-with-status">
              <h1>Inbox</h1>
              <span className="connection">
                <i /> invoices@meriton.com
              </span>
            </span>
            <Button
              aria-label="Sync mailbox"
              icon={RefreshCw}
              onClick={() => {
                syncMailbox()
                setSelected("e-voss")
              }}
              size="sm"
              variant="ghost"
              className={syncing ? "syncing" : ""}
            >
              {syncing ? "Syncing" : "Sync"}
            </Button>
          </div>
          <SearchField onChange={setQuery} placeholder="Search mail" value={query} />
          <div className="segmented">
            {(
              [
                ["all", "All"],
                ["invoices", "Invoices"],
                ["skipped", "Skipped"],
              ] as const
            ).map(([id, label]) => (
              <button className={filter === id ? "active" : ""} key={id} onClick={() => setFilter(id)} type="button">
                {label}
              </button>
            ))}
          </div>
        </header>
        <div className="mail-list">
          {visible.map((item) => {
            const result = outcome(item)
            return (
              <button
                className={`mail-row ${email?.id === item.id ? "selected" : ""} ${item.unread ? "unread" : ""}`}
                key={item.id}
                onClick={() => setSelected(item.id)}
              >
                <Avatar name={item.sender} size={32} />
                <span className="mail-row-body">
                  <span className="mail-row-top">
                    <strong>{item.sender}</strong>
                    <time>{item.time}</time>
                  </span>
                  <span className="mail-row-subject">{item.subject}</span>
                  <span className="mail-row-foot">
                    {state.processingEmail === item.id ? (
                      <span className="pill pill-neutral">
                        <Loader2 className="spin" size={12} /> Processing
                      </span>
                    ) : (
                      <span className={`pill pill-${result.tone}`}>{result.label}</span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      {email && (
        <section className="split-detail" key={email.id}>
          <div className="reading">
            <h2 className="reading-title">{email.subject}</h2>
            <div className="reading-from">
              <Avatar name={email.sender} size={36} />
              <span className="cell-stack">
                <strong>{email.sender}</strong>
                <small>
                  {email.address} · to invoices@meriton.com
                </small>
              </span>
              <time>{email.received}</time>
            </div>

            <ProcessingCard email={email} />

            <div className="reading-body">
              {email.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="attachments">
              {email.attachments.map((file, index) => (
                <button className="attachment" key={file.name} onClick={() => setPreview(index)}>
                  <span className="file-badge">PDF</span>
                  <span className="cell-stack">
                    <strong>{file.name}</strong>
                    <small>
                      {file.pages} page{file.pages === 1 ? "" : "s"} · {file.size}
                    </small>
                  </span>
                  <Eye size={16} strokeWidth={1.6} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      {preview !== null && email && <PreviewDrawer close={() => setPreview(null)} email={email} index={preview} />}
    </div>
  )
}
