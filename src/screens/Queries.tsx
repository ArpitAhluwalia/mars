import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import TeamsThread from "../components/TeamsThread"
import { Avatar, Button, EmptyState, Pill, SearchField, StatusPill } from "../components/ui"
import { money } from "../data/reconcile"
import type { Query } from "../data/types"
import { deriveInvoice, useMars } from "../state/store"

const sections: { id: string; label: string; test: (query: Query) => boolean }[] = [
  { id: "reply", label: "Replies to apply", test: (query) => !!query.reply && !query.applied },
  { id: "waiting", label: "Waiting on Sales", test: (query) => !query.reply && !query.applied },
  { id: "closed", label: "Closed", test: (query) => !!query.applied },
]

export default function Queries() {
  const { state, selectQuery, openInvoice } = useMars()
  const [search, setSearch] = useState("")
  const queries = useMemo(() => [...state.queries].reverse(), [state.queries])
  const visible = queries.filter((query) => {
    const view = deriveInvoice(state, query.invoiceId)
    return `${view.invoice.vendor} ${view.invoice.invoiceNumber} ${query.rep} ${query.ticket}`.toLowerCase().includes(search.toLowerCase())
  })
  const ordered = sections.flatMap((section) => visible.filter(section.test))
  const selected = queries.find((query) => query.id === state.selectedQueryId) ?? ordered[0] ?? null
  const view = selected ? deriveInvoice(state, selected.invoiceId) : null

  return (
    <div className="split">
      <aside className="split-list">
        <header className="split-head">
          <div className="split-title">
            <h1>Queries</h1>
          </div>
          <SearchField onChange={setSearch} placeholder="Search vendor, invoice or rep" value={search} />
        </header>
        <div className="mail-list">
          {sections.map((section) => {
            const items = visible.filter(section.test)
            if (!items.length) return null
            return (
              <div key={section.id}>
                <p className="list-group">
                  {section.label} <span className="tab-count">{items.length}</span>
                </p>
                {items.map((query) => {
                  const item = deriveInvoice(state, query.invoiceId)
                  return (
                    <button
                      className={`mail-row ${selected?.id === query.id ? "selected" : ""} ${section.id === "reply" ? "unread" : ""}`}
                      key={query.id}
                      onClick={() => selectQuery(query.id)}
                    >
                      <Avatar name={query.rep} size={32} />
                      <span className="mail-row-body">
                        <span className="mail-row-top">
                          <strong>{query.rep}</strong>
                          <time>{(query.reply?.at ?? query.sentAt).split(", ")[1]}</time>
                        </span>
                        <span className="mail-row-subject">
                          {item.invoice.invoiceNumber} · {item.invoice.vendor}
                        </span>
                        <span className="mail-row-preview">
                          {query.reply ? query.reply.justification : `${query.lineKeys.length || "No"} flagged lines · ${query.ticket}`}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
          {!visible.length && <EmptyState title="No queries">Ask Sales from any invoice and it lands here.</EmptyState>}
        </div>
      </aside>

      {selected && view ? (
        <section className="split-detail" key={selected.id}>
          <div className="reading">
            <div className="query-head">
              <div>
                <p className="eyebrow">
                  {selected.ticket} · {view.invoice.vendor}
                </p>
                <h2 className="reading-title">
                  {view.invoice.invoiceNumber} <span className="muted">· {money(view.invoice.total)}</span>
                </h2>
              </div>
              <StatusPill status={view.status} />
              <Button iconRight={ArrowUpRight} onClick={() => openInvoice(view.id)} size="sm">
                Open invoice
              </Button>
            </div>
            <TeamsThread key={selected.id} view={{ ...view, query: selected }} />
            {selected.reply && (
              <div className="recorded">
                <h3>Recorded on {selected.ticket}</h3>
                <dl>
                  <dt>Answer</dt>
                  <dd>
                    <Pill tone={selected.reply.action === "approve" ? "success" : "danger"}>
                      {selected.reply.action === "approve" ? "Approved as billed" : "Needs correction"}
                    </Pill>
                  </dd>
                  <dt>Justification</dt>
                  <dd>{selected.reply.justification}</dd>
                  <dt>By</dt>
                  <dd>
                    {selected.rep} · {selected.reply.at}
                  </dd>
                </dl>
              </div>
            )}
            <p className="footnote">
              Reps with fewer than 3 open items get a card right away. At 3 or more, MARS sends one digest at 09:00 and 15:00.
            </p>
          </div>
        </section>
      ) : (
        <section className="split-detail">
          <EmptyState title="No query selected" />
        </section>
      )}
    </div>
  )
}
