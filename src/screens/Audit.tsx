import { useState } from "react"
import { ArrowUpRight, Check, Download } from "lucide-react"
import ActivityFeed from "../components/ActivityFeed"
import { Avatar, Button, SearchField, StatusPill } from "../components/ui"
import { money, poLabel } from "../data/reconcile"
import type { AuditEvent } from "../data/types"
import { useInvoices, useMars, type InvoiceView } from "../state/store"

const stages: { label: string; kinds: AuditEvent["kind"][] }[] = [
  { label: "Received", kinds: ["intake"] },
  { label: "Extracted", kinds: ["ocr"] },
  { label: "Matched", kinds: ["match"] },
  { label: "Resolved", kinds: ["edit", "sales"] },
  { label: "Approved", kinds: ["approval"] },
]

function reached(view: InvoiceView, events: AuditEvent[], index: number) {
  if (index === 2) return !!view.po
  if (index === 3) return !!view.po && !view.openLines.length && !view.headerIssues.length
  return events.some((event) => stages[index].kinds.includes(event.kind))
}

export default function Audit() {
  const { state, selectAudit, openInvoice, openQuery, notify } = useMars()
  const invoices = useInvoices()
  const [search, setSearch] = useState("")
  const visible = invoices
    .filter((view) => `${view.meta.ticket} ${view.invoice.invoiceNumber} ${view.invoice.vendor}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.meta.ticket.localeCompare(a.meta.ticket))
  const selected = invoices.find((view) => view.id === state.selectedAuditId) ?? visible[0]
  const events = selected ? (state.audit[selected.id] ?? []) : []

  return (
    <div className="split">
      <aside className="split-list">
        <header className="split-head">
          <div className="split-title">
            <h1>Audit</h1>
            <Button icon={Download} onClick={() => notify("Audit log exported as CSV")} size="sm" variant="ghost">
              Export
            </Button>
          </div>
          <SearchField onChange={setSearch} placeholder="Search ticket, invoice or vendor" value={search} />
        </header>
        <div className="mail-list">
          {visible.map((view) => {
            const log = state.audit[view.id] ?? []
            return (
              <button
                className={`mail-row ${selected?.id === view.id ? "selected" : ""}`}
                key={view.id}
                onClick={() => selectAudit(view.id)}
              >
                <Avatar name={view.invoice.vendor} size={32} />
                <span className="mail-row-body">
                  <span className="mail-row-top">
                    <strong>{view.meta.ticket}</strong>
                    <time>{log[log.length - 1]?.at.split(", ")[0]}</time>
                  </span>
                  <span className="mail-row-subject">
                    {view.invoice.invoiceNumber} · {view.invoice.vendor}
                  </span>
                  <span className="mail-row-foot">
                    <StatusPill status={view.status} />
                    <span className="muted">{log.length} events</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      {selected && (
        <section className="split-detail" key={selected.id}>
          <div className="reading">
            <div className="query-head">
              <div>
                <p className="eyebrow">
                  {selected.meta.ticket} · {selected.invoice.vendor}
                </p>
                <h2 className="reading-title">{selected.invoice.invoiceNumber}</h2>
              </div>
              <StatusPill status={selected.status} />
              <Button iconRight={ArrowUpRight} onClick={() => openInvoice(selected.id)} size="sm">
                Open invoice
              </Button>
            </div>

            <dl className="facts">
              <div>
                <dt>Amount</dt>
                <dd className="num">{money(selected.invoice.total)}</dd>
              </div>
              <div>
                <dt>Purchase order</dt>
                <dd>{selected.po ? poLabel(selected.po.poNumber) : `${selected.invoice.poNumber} (not on file)`}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{selected.meta.source}</dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd>{selected.meta.received}</dd>
              </div>
            </dl>

            <ol className="stages">
              {stages.map((stage, index) => {
                const done = reached(selected, events, index)
                return (
                  <li className={done ? "done" : ""} key={stage.label}>
                    <i>{done ? <Check size={12} strokeWidth={3} /> : index + 1}</i>
                    <span>{stage.label}</span>
                  </li>
                )
              })}
            </ol>

            <ActivityFeed events={events} onOpenQuery={selected.query ? () => openQuery(selected.query!.id) : undefined} view={selected} />
          </div>
        </section>
      )}
    </div>
  )
}
