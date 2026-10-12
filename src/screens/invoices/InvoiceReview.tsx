import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  FileQuestion,
  FileText,
  Info,
  Link2,
  MessageSquareReply,
  MessagesSquare,
  PackageCheck,
  PackageX,
  Pencil,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import ActivityFeed from "../../components/ActivityFeed"
import DocumentViewer, { EmailPaper } from "../../components/DocumentViewer"
import TeamsThread from "../../components/TeamsThread"
import { Avatar, Button, MarsAvatar, Pill, SearchField, StatusPill, Tabs, type Tone } from "../../components/ui"
import { drawdown, money, poLabel, qty, receiptFor, scorePo, searchPos, shortDate, toleranceNote, verdictLabel, type PoSuggestion } from "../../data/reconcile"
import { emails, OWNER } from "../../data/scenario"
import { purchaseOrders } from "../../data/source"
import type { LineCheck, Tolerance } from "../../data/types"
import { useInvoice, useInvoices, useMars, type InvoiceView } from "../../state/store"
import { byPriority, groupOf, groups } from "./InvoiceList"

type Panel = "invoice" | "po" | "email" | "teams"

type Finding = {
  key: string
  tone: Tone | "info"
  icon: LucideIcon
  title: string
  detail: ReactNode
  actions?: ReactNode
  blocking: boolean
}

/* ---------------- left rail ---------------- */

function QueueRail({ currentId }: { currentId: string }) {
  const { openInvoice } = useMars()
  const all = useInvoices()
  const items = all.filter((item) => item.status !== "Approved" || item.id === currentId).sort(byPriority)
  const index = items.findIndex((item) => item.id === currentId)

  return (
    <aside className="rail">
      <button className="rail-back" onClick={() => openInvoice(null)}>
        <ArrowLeft size={15} /> Invoices
      </button>
      <div className="rail-list">
        {groups.map((group) => {
          const groupItems = items.filter((item) => groupOf(item.status) === group)
          if (!groupItems.length) return null
          return (
            <div key={group.id}>
              <p className="rail-group">{group.label}</p>
              {groupItems.map((item) => (
                <button
                  className={`rail-item ${item.id === currentId ? "active" : ""}`}
                  key={item.id}
                  onClick={() => openInvoice(item.id)}
                >
                  <Avatar name={item.invoice.vendor} size={28} />
                  <span className="cell-stack">
                    <strong>{item.invoice.vendor}</strong>
                    <small>
                      {item.invoice.invoiceNumber} · {money(item.invoice.total)}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </div>
      <footer className="rail-foot">
        <button disabled={index <= 0} onClick={() => openInvoice(items[index - 1].id)}>
          Prev
        </button>
        <span>
          {index + 1} of {items.length}
        </span>
        <button disabled={index >= items.length - 1} onClick={() => openInvoice(items[index + 1].id)}>
          Next
        </button>
      </footer>
    </aside>
  )
}

/* ---------------- MARS review ---------------- */

function useFindings(view: InvoiceView, actions: { openTeams: () => void; focusSearch: () => void; toLines: () => void }) {
  const { state, linkPo, acceptLine, applyReply, notify } = useMars()
  const note = toleranceNote(state.tolerance)
  const findings: Finding[] = []
  const { po, invoice, query } = view
  const pending = query && !query.applied ? query : null

  if (view.approvedAt) {
    findings.push({
      key: "approved",
      tone: "success",
      icon: CheckCircle2,
      title: `Approved ${view.approvedAt}`,
      detail: `Released against ${po ? poLabel(po.poNumber) : "the PO"} and sent for posting.`,
      blocking: false,
    })
    return findings
  }

  if (pending && !pending.reply) {
    findings.push({
      key: "waiting",
      tone: "sales",
      icon: MessagesSquare,
      title: `Waiting on ${pending.rep} in Teams`,
      detail: `Asked ${pending.sentAt} about ${pending.lineKeys.length || "the missing PO"}${pending.lineKeys.length ? " flagged lines" : ""}.`,
      actions: (
        <Button onClick={actions.openTeams} size="sm">
          Open thread
        </Button>
      ),
      blocking: true,
    })
  }

  if (pending?.reply) {
    const approved = pending.reply.action === "approve"
    findings.push({
      key: "reply",
      tone: approved ? "sales" : "danger",
      icon: MessageSquareReply,
      title: approved ? `${pending.rep} approved as billed` : `${pending.rep} asked for a correction`,
      detail: <q>{pending.reply.justification}</q>,
      actions: (
        <Button
          onClick={() => {
            applyReply(pending.id)
            notify(approved ? "Sales approval applied" : "Correction noted")
          }}
          size="sm"
          variant="primary"
        >
          {approved ? "Apply approval" : "Acknowledge"}
        </Button>
      ),
      blocking: true,
    })
  }

  if (!po && view.suggestions.length) {
    const best = view.suggestions[0]
    findings.push({
      key: "suggest",
      tone: "warn",
      icon: Sparkles,
      title: `${invoice.poNumber} isn't on file. ${poLabel(best.po.poNumber)} looks right.`,
      detail: `${best.score}% match · ${best.reasons.slice(0, 3).join(" · ")}`,
      actions: (
        <>
          <Button
            icon={Link2}
            onClick={() => {
              linkPo(view.id, best.po, `AI match · ${best.score}%`)
              notify(`${poLabel(best.po.poNumber)} linked`)
            }}
            size="sm"
            variant="primary"
          >
            Link {poLabel(best.po.poNumber)}
          </Button>
          {view.suggestions.length > 1 && (
            <Button onClick={actions.focusSearch} size="sm">
              {view.suggestions.length - 1} other match{view.suggestions.length > 2 ? "es" : ""}
            </Button>
          )}
        </>
      ),
      blocking: true,
    })
  }

  if (!po && !view.suggestions.length) {
    findings.push({
      key: "nopo",
      tone: "danger",
      icon: FileQuestion,
      title: `No purchase order found for ${invoice.poNumber}`,
      detail: "Nothing on file is close. Search by number or vendor, or ask Sales which order this is.",
      actions: (
        <>
          <Button icon={Search} onClick={actions.focusSearch} size="sm" variant="primary">
            Search POs
          </Button>
          {!pending && (
            <Button onClick={actions.openTeams} size="sm">
              Ask Sales
            </Button>
          )}
        </>
      ),
      blocking: true,
    })
  }

  if (view.headerIssues.includes("vendor") && po) {
    findings.push({
      key: "vendor",
      tone: "warn",
      icon: AlertCircle,
      title: "Vendor name is spelled differently on the PO",
      detail: `Invoice “${invoice.vendor}” · PO “${po.vendor}”`,
      actions: (
        <Button onClick={() => acceptLine(view.id, "vendor", "Same supplier, spelling differs", "Vendor")} size="sm">
          Same vendor
        </Button>
      ),
      blocking: true,
    })
  }

  if (view.headerIssues.includes("ref") && po) {
    findings.push({
      key: "ref",
      tone: "warn",
      icon: AlertCircle,
      title: `Invoice cites ${invoice.poNumber}, linked to ${poLabel(po.poNumber)}`,
      detail: "Confirm this is the right order.",
      actions: (
        <Button onClick={() => acceptLine(view.id, "ref", "Reference confirmed", "PO reference")} size="sm">
          Confirm
        </Button>
      ),
      blocking: true,
    })
  }

  const withSales = new Set(pending?.lineKeys ?? [])
  const open = view.openLines.filter((line) => !withSales.has(line.key))
  if (open.length) {
    const net = open.reduce((total, line) => total + line.difference, 0)
    findings.push({
      key: "lines",
      tone: "danger",
      icon: AlertCircle,
      title: `${open.length} line${open.length > 1 ? "s" : ""} over tolerance · ${money(net, true)}`,
      detail: open.map((line) => `${line.description.split(",")[0]} ${money(line.difference, true)}`).join(" · "),
      actions: (
        <>
          {!pending && (
            <Button icon={MessagesSquare} onClick={actions.openTeams} size="sm" variant="primary">
              Ask Sales
            </Button>
          )}
          <Button onClick={actions.toLines} size="sm">
            Resolve lines
          </Button>
        </>
      ),
      blocking: true,
    })
  }

  const warn = view.warnLines.filter((line) => !withSales.has(line.key))
  if (warn.length) {
    const net = warn.reduce((total, line) => total + line.difference, 0)
    findings.push({
      key: "warn",
      tone: "warn",
      icon: AlertCircle,
      title: `${warn.length} line${warn.length > 1 ? "s" : ""} over tolerance · ${money(net, true)}`,
      detail: "Approval isn't blocked because overbilling protection is off in matching rules.",
      actions: (
        <Button onClick={actions.toLines} size="sm">
          Review lines
        </Button>
      ),
      blocking: false,
    })
  }

  const short = view.receiptLines.filter((line) => !withSales.has(line.key))
  if (short.length) {
    const units = short.reduce((total, line) => total + line.unreceived, 0)
    findings.push({
      key: "receipt",
      tone: "danger",
      icon: PackageX,
      title: `${units} unit${units > 1 ? "s" : ""} billed but not received`,
      detail: short
        .map((line) => `${line.description.split(",")[0]}: ${line.received} of ${line.invoice.quantity} on ${line.receiptId}`)
        .join(" · "),
      actions: (
        <>
          {!pending && (
            <Button icon={MessagesSquare} onClick={actions.openTeams} size="sm" variant="primary">
              Ask Sales
            </Button>
          )}
          <Button onClick={actions.toLines} size="sm">
            Resolve lines
          </Button>
        </>
      ),
      blocking: true,
    })
  }

  if (view.receiptWarnLines.length) {
    const units = view.receiptWarnLines.reduce((total, line) => total + line.unreceived, 0)
    findings.push({
      key: "receipt-warn",
      tone: "info",
      icon: PackageX,
      title: `${units} billed unit${units > 1 ? "s" : ""} not on the goods receipt yet`,
      detail: "3-way match is off in matching rules, so this doesn't block approval.",
      blocking: false,
    })
  }

  const tolerance = view.checks.filter((line) => line.verdict === "match" && !line.exact)
  if (tolerance.length) {
    const net = tolerance.reduce((total, line) => total + line.difference, 0)
    findings.push({
      key: "tolerance",
      tone: "info",
      icon: Info,
      title: `${tolerance.length} line${tolerance.length > 1 ? "s" : ""} differ within tolerance · ${money(net, true)}`,
      detail: `${tolerance.map((line) => line.description.split(",")[0]).join(" · ")}. No action needed.`,
      blocking: false,
    })
  }

  if (!findings.some((finding) => finding.blocking) && po) {
    const exact = view.checks.filter((line) => line.exact).length
    const receipt = receiptFor(po)
    findings.unshift({
      key: "ready",
      tone: "success",
      icon: CheckCircle2,
      title: po.standing ? `Release fits within ${poLabel(po.poNumber)}` : `Everything matches ${poLabel(po.poNumber)}`,
      detail: `${exact} of ${view.checks.length} lines exact${view.checks.some((line) => line.verdict !== "match") ? " · exceptions resolved" : ""} · ${receipt ? `billed units received on ${receipt.id}` : "services, matched 2-way"} · ${note.toLowerCase()}`,
      blocking: false,
    })
  }
  return findings
}

function ReviewCard({ findings }: { findings: Finding[] }) {
  const blocking = findings.filter((finding) => finding.blocking).length
  return (
    <div className="agent-card review-card">
      <div className="agent-card-head">
        <MarsAvatar size={26} />
        <span>
          <strong>MARS review</strong> ·{" "}
          {blocking ? `${blocking} thing${blocking > 1 ? "s" : ""} need${blocking > 1 ? "" : "s"} your attention` : "nothing blocking approval"}
        </span>
      </div>
      {findings.map((finding) => (
        <div className={`finding finding-${finding.tone}`} key={finding.key}>
          <span className="finding-icon">
            <finding.icon size={16} strokeWidth={1.75} />
          </span>
          <span className="cell-stack finding-copy">
            <strong>{finding.title}</strong>
            <small>{finding.detail}</small>
          </span>
          {finding.actions && <span className="finding-actions">{finding.actions}</span>}
        </div>
      ))}
    </div>
  )
}

/* ---------------- purchase order ---------------- */

function SuggestionRow({ suggestion, onLink, best }: { suggestion: PoSuggestion; onLink: () => void; best?: boolean }) {
  return (
    <div className="po-option">
      <span className="object-icon">
        <FileText size={16} strokeWidth={1.6} />
      </span>
      <span className="cell-stack">
        <strong>
          {poLabel(suggestion.po.poNumber)} <span className="muted">· {suggestion.po.vendor}</span>
        </strong>
        <small>{suggestion.reasons.join(" · ")}</small>
      </span>
      <span className="num muted">{money(suggestion.po.total)}</span>
      <Pill tone={suggestion.score >= 85 ? "success" : suggestion.score >= 70 ? "warn" : "neutral"}>{suggestion.score}%</Pill>
      <Button onClick={onLink} size="sm" variant={best ? "primary" : "secondary"}>
        Link
      </Button>
    </div>
  )
}

function PoSection({ view, searchRef }: { view: InvoiceView; searchRef: React.RefObject<HTMLDivElement | null> }) {
  const { linkPo, notify } = useMars()
  const all = useInvoices()
  const [changing, setChanging] = useState(false)
  const [query, setQuery] = useState("")
  const { po } = view

  const options = useMemo(() => {
    if (query) return searchPos(view.invoice, query)
    if (!po) return view.suggestions
    return purchaseOrders
      .filter((item) => item.id !== po.id && item.vendor.split(" ")[0] === view.invoice.vendor.split(" ")[0])
      .map((item) => scorePo(view.invoice, item))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [po, query, view.invoice, view.suggestions])

  const link = (suggestion: PoSuggestion, how: string) => {
    linkPo(view.id, suggestion.po, how)
    notify(`${poLabel(suggestion.po.poNumber)} linked`)
    setChanging(false)
    setQuery("")
  }

  const approved = all.filter((item) => item.approvedAt && item.id !== view.id).map((item) => item.invoice)
  const balance = po?.standing ? drawdown(po, approved) : null
  const thisInvoice = view.invoice.subtotal ?? 0

  return (
    <section className="section" ref={searchRef}>
      <header className="section-head">
        <h2>Purchase order</h2>
        {po && view.status !== "Approved" && (
          <Button onClick={() => setChanging(!changing)} size="sm" variant="ghost">
            {changing ? "Cancel" : "Change"}
          </Button>
        )}
      </header>

      {po && (
        <div className="card po-card">
          <div className="po-card-main">
            <span className="object-icon">
              <FileText size={16} strokeWidth={1.6} />
            </span>
            <span className="cell-stack">
              <strong>
                {poLabel(po.poNumber)} {po.standing && <Pill tone="neutral">Standing order</Pill>}
              </strong>
              <small>
                {po.vendor} · ordered {shortDate(po.date)} · {po.lines.length} lines
              </small>
            </span>
            <span className="num">{money(po.total)}</span>
            <Pill icon={view.link ? Sparkles : Check} tone={view.link ? "accent" : "success"}>
              {view.link ? view.link.how.replace(/^Found by search for .*/, "Found by search").replace(/^Changed from .*/, "Changed manually") : "PO number matches"}
            </Pill>
            <Pill icon={receiptFor(po) ? PackageCheck : undefined} tone="neutral">
              {receiptFor(po) ? `3-way · ${receiptFor(po)!.id}` : "2-way · services"}
            </Pill>
          </div>
          {balance && (
            <div className="drawdown">
              <div className="drawdown-bar">
                <i style={{ width: `${Math.min(100, (balance.billed / balance.cap) * 100)}%` }} />
                <i className="this" style={{ width: `${Math.min(100, (thisInvoice / balance.cap) * 100)}%` }} />
              </div>
              <div className="drawdown-legend">
                <span>
                  <i /> Billed {money(balance.billed)}
                </span>
                <span>
                  <i className="this" /> This invoice {money(thisInvoice)}
                </span>
                <span className="muted">
                  {money(balance.remaining - (view.approvedAt ? 0 : thisInvoice))} left of {money(balance.cap)} · valid to {shortDate(po.standing?.validTo)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {(!po || changing) && (
        <div className="card po-picker">
          <div className="po-picker-search">
            <SearchField autoFocus={changing} onChange={setQuery} placeholder="Search PO number or vendor" value={query} />
          </div>
          {!query && !po && options.length > 0 && <p className="po-picker-label">Suggested by MARS</p>}
          {options.map((suggestion, index) => (
            <SuggestionRow
              best={!query && !po && index === 0}
              key={suggestion.po.id}
              onLink={() => link(suggestion, query ? `Found by search for “${query}”` : po ? `Changed from ${po.poNumber}` : `AI match · ${suggestion.score}%`)}
              suggestion={suggestion}
            />
          ))}
          {query && !options.length && <p className="po-picker-empty">No purchase orders match “{query}”.</p>}
          {!query && !options.length && <p className="po-picker-empty">No close matches. Try a PO number, e.g. 40141.</p>}
        </div>
      )}
    </section>
  )
}

/* ---------------- line matching ---------------- */

// A line can be off against the PO (2-way) or short against the goods receipt (3-way).
const isShort = (line: LineCheck) => line.unreceived > 0 && !["quantity", "price-quantity"].includes(line.verdict)

const lineTone = (line: LineCheck, tol: Tolerance, accepted?: string, withSales?: boolean): [Tone, string] => {
  if (accepted) return ["neutral", "Accepted"]
  if (withSales && (line.verdict !== "match" || isShort(line))) return ["sales", "With Sales"]
  if (line.verdict !== "match") return [tol.block ? "danger" : "warn", verdictLabel[line.verdict]]
  if (isShort(line)) return [tol.threeWay ? "danger" : "warn", "Not received"]
  return line.exact ? ["success", "Matched"] : ["warn", "Within tolerance"]
}

function ReceivedCell({ line }: { line: LineCheck }) {
  if (line.received === null) return <span className="muted">Service</span>
  if (line.unreceived > 0) {
    return (
      <span className="cell-stack">
        <strong className="variance">
          {qty(line.received)} of {qty(line.invoice.quantity)}
        </strong>
        <small>{qty(line.unreceived)} short</small>
      </span>
    )
  }
  return <span>{qty(line.received)}</span>
}

function LineResolver({ view, line, onAskSales, close }: { view: InvoiceView; line: LineCheck; onAskSales: () => void; close: () => void }) {
  const { editLine, acceptLine, notify } = useMars()
  const [mode, setMode] = useState<"edit" | "accept" | null>(null)
  const [quantity, setQuantity] = useState(String(line.invoice.quantity ?? ""))
  const [unitPrice, setUnitPrice] = useState(String(line.invoice.unitPrice ?? ""))
  const [remark, setRemark] = useState("")

  return (
    <tr className="resolver-row">
      <td colSpan={5}>
        <div className="resolver">
          {!mode && (
            <div className="resolver-options">
              <button onClick={onAskSales}>
                <MessagesSquare size={16} />
                <span className="cell-stack">
                  <strong>Ask Sales</strong>
                  <small>Confirm it was agreed with the vendor</small>
                </span>
              </button>
              <button onClick={() => setMode("edit")}>
                <Pencil size={16} />
                <span className="cell-stack">
                  <strong>Correct OCR value</strong>
                  <small>The invoice was misread</small>
                </span>
              </button>
              <button onClick={() => setMode("accept")}>
                <Check size={16} />
                <span className="cell-stack">
                  <strong>Accept difference</strong>
                  <small>Approve with a note for audit</small>
                </span>
              </button>
            </div>
          )}
          {mode === "edit" && (
            <form
              className="resolver-form"
              onSubmit={(event) => {
                event.preventDefault()
                editLine(view.id, line.key, { quantity: Number(quantity), unitPrice: Number(unitPrice) }, line.description)
                notify("OCR value corrected")
                close()
              }}
            >
              <label className="field">
                <span>Quantity</span>
                <input inputMode="decimal" onChange={(event) => setQuantity(event.target.value)} value={quantity} />
              </label>
              <label className="field">
                <span>Unit price</span>
                <input inputMode="decimal" onChange={(event) => setUnitPrice(event.target.value)} value={unitPrice} />
              </label>
              <Button onClick={() => setMode(null)} size="sm" variant="ghost">
                Back
              </Button>
              <Button size="sm" type="submit" variant="dark">
                Save correction
              </Button>
            </form>
          )}
          {mode === "accept" && (
            <form
              className="resolver-form"
              onSubmit={(event) => {
                event.preventDefault()
                if (!remark.trim()) return
                acceptLine(view.id, line.key, remark.trim(), line.description)
                notify("Difference accepted")
                close()
              }}
            >
              <label className="field grow">
                <span>Note for the audit trail</span>
                <input autoFocus onChange={(event) => setRemark(event.target.value)} placeholder="e.g. Price rise agreed in contract amendment 4" value={remark} />
              </label>
              <Button onClick={() => setMode(null)} size="sm" variant="ghost">
                Back
              </Button>
              <Button disabled={!remark.trim()} size="sm" type="submit" variant="dark">
                Accept
              </Button>
            </form>
          )}
        </div>
      </td>
    </tr>
  )
}

function LineMatching({
  view,
  linesRef,
  expanded,
  setExpanded,
  onAskSales,
}: {
  view: InvoiceView
  linesRef: React.RefObject<HTMLDivElement | null>
  expanded: string | null
  setExpanded: (key: string | null) => void
  onAskSales: () => void
}) {
  const { state, openPanel } = useMars()
  const [exceptionsOnly, setExceptionsOnly] = useState(false)
  const { po, invoice } = view
  if (!po) return null
  const withSales = new Set(view.query && !view.query.applied ? view.query.lineKeys : [])
  const rows = view.checks.filter((line) => !exceptionsOnly || line.verdict !== "match" || !line.exact || line.unreceived > 0)
  const poSubtotal = po.standing
    ? view.checks.reduce((total, line) => total + (line.invoice.quantity ?? 0) * (line.po?.unitPrice ?? 0), 0)
    : (po.subtotal ?? 0)
  const exact = view.checks.filter((line) => line.exact).length

  return (
    <section className="section" ref={linesRef}>
      <header className="section-head">
        <h2>Line matching</h2>
        <div className="section-aside">
          <span title={`Tolerance: ${toleranceNote(state.tolerance)}`}>
            {exact} of {view.checks.length} exact
          </span>
          <button className="link" onClick={() => openPanel("settings")} type="button">
            Rules
          </button>
          <label className="toggle">
            <input checked={exceptionsOnly} onChange={(event) => setExceptionsOnly(event.target.checked)} type="checkbox" />
            <i />
            Differences only
          </label>
        </div>
      </header>
      <div className="card table-card">
        <table className="table lines-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="right">Invoiced</th>
              <th className="right">{po.standing ? "PO price" : "Ordered"}</th>
              <th className="right">Received</th>
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((line) => {
              const accepted = view.accepted[line.key]
              const sales = withSales.has(line.key)
              const [tone, label] = lineTone(line, state.tolerance, accepted, sales)
              const actionable = (line.verdict !== "match" || isShort(line)) && !accepted && !sales && view.status !== "Approved"
              const isOpen = expanded === line.key
              return [
                <tr className={`line ${tone === "danger" ? "exception" : ""} ${isOpen ? "open" : ""}`} key={line.key}>
                  <td>
                    <span className="cell-stack">
                      <strong>{line.description}</strong>
                      {accepted && <small>{accepted}</small>}
                    </span>
                  </td>
                  <td className="right num">
                    <span className="cell-stack">
                      <strong>{money(line.invoice.lineTotal)}</strong>
                      <small>
                        {qty(line.invoice.quantity)} × {money(line.invoice.unitPrice)}
                      </small>
                    </span>
                  </td>
                  <td className="right num">
                    {line.po ? (
                      <span className="cell-stack">
                        <strong>
                          {po.standing ? money((line.invoice.quantity ?? 0) * (line.po.unitPrice ?? 0)) : money(line.po.lineTotal)}
                        </strong>
                        <small>
                          {po.standing ? `${qty(line.po.quantity)} on order` : `${qty(line.po.quantity)} ×`} {po.standing ? "" : money(line.po.unitPrice)}
                        </small>
                      </span>
                    ) : (
                      <span className="muted">Not on PO</span>
                    )}
                  </td>
                  <td className="right num">
                    <ReceivedCell line={line} />
                  </td>
                  <td className="match-cell">
                    {actionable ? (
                      <button
                        aria-expanded={isOpen}
                        className={`pill pill-${tone} pill-button`}
                        onClick={() => setExpanded(isOpen ? null : line.key)}
                        type="button"
                      >
                        {label}
                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    ) : (
                      <Pill tone={tone}>{label}</Pill>
                    )}
                    {Math.abs(line.difference) >= 0.005 && (
                      <small className={`num ${tone === "danger" && line.verdict !== "match" ? "variance" : "muted"}`}>
                        {money(line.difference, true)}
                      </small>
                    )}
                  </td>
                </tr>,
                isOpen && (
                  <LineResolver
                    close={() => setExpanded(null)}
                    key={`${line.key}-resolver`}
                    line={line}
                    onAskSales={onAskSales}
                    view={view}
                  />
                ),
              ]
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Subtotal</td>
              <td className="right num">{money(invoice.subtotal)}</td>
              <td className="right num">{money(poSubtotal)}</td>
              <td />
              <td className={`num ${view.openLines.length ? "variance" : "muted"}`}>{money((invoice.subtotal ?? 0) - poSubtotal, true)}</td>
            </tr>
            <tr>
              <td>
                Tax <span className="muted">· tolerance {toleranceNote(state.tolerance)}</span>
              </td>
              <td className="right num">{money(invoice.tax)}</td>
              <td className="right num muted">{po.standing ? "—" : money(po.tax)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

/* ---------------- page ---------------- */

export default function InvoiceReview({ id }: { id: string }) {
  const { state, approve, notify, openInvoice, openQuery } = useMars()
  const view = useInvoice(id)
  const all = useInvoices()
  const [tab, setTab] = useState<"overview" | "activity">("overview")
  const [panel, setPanel] = useState<Panel>("invoice")
  const [expanded, setExpanded] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const email = emails.find((item) => item.id === view.meta.emailId)

  useEffect(() => {
    setTab("overview")
    setExpanded(null)
    setPanel(view.query && !view.query.applied ? "teams" : "invoice")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const openTeams = () => {
    setExpanded(null)
    setPanel("teams")
  }
  const findings = useFindings(view, {
    openTeams,
    focusSearch: () => {
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      window.setTimeout(() => searchRef.current?.querySelector("input")?.focus(), 300)
    },
    toLines: () => {
      setTab("overview")
      linesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      const first = [...view.openLines, ...view.receiptLines, ...view.warnLines].find((line) => !(view.query && !view.query.applied && view.query.lineKeys.includes(line.key)))
      if (first) setExpanded(first.key)
    },
  })

  const { invoice, po } = view
  const canApprove = view.status === "Ready to approve"
  const blocking = findings.filter((finding) => finding.blocking).length
  const net = view.openLines.reduce((total, line) => total + line.difference, 0)
  const events = state.audit[id] ?? []

  const approveAndNext = () => {
    approve(id)
    const next = all
      .filter((item) => item.id !== id && item.status !== "Approved" && item.status !== "With Sales")
      .sort(byPriority)[0]
    notify(`${invoice.invoiceNumber} approved${next ? ` · next: ${next.invoice.vendor}` : ""}`)
    if (next) openInvoice(next.id)
  }

  return (
    <div className="review">
      <QueueRail currentId={id} />

      <section className="review-center">
        <div className="review-scroll">
          <header className="review-head">
            <div className="review-meta">
              <StatusPill status={view.status} />
              <span className="muted">
                {view.meta.ticket} · {view.meta.source} · Owner {OWNER.name}
              </span>
            </div>
            <h1 className="page-title">{invoice.vendor}</h1>
            <p className="review-sub">
              Invoice {invoice.invoiceNumber} · issued {shortDate(invoice.date)} · cites {invoice.poNumber}
            </p>
            <div className="figure-strip">
              <span>
                <small>Invoice total</small>
                <strong className="num">{money(invoice.total)}</strong>
              </span>
              <span>
                <small>{po?.standing ? "Released at PO price" : "PO total"}</small>
                <strong className="num">{po ? money(po.standing ? null : po.total) : "—"}</strong>
              </span>
              <span>
                <small>Open variance</small>
                <strong className={`num ${view.openLines.length ? "variance" : ""}`}>{po ? money(net, true) : "—"}</strong>
              </span>
              <span>
                <small>Due</small>
                <strong className={view.meta.due.startsWith("Overdue") ? "variance" : ""}>{view.meta.due}</strong>
              </span>
            </div>
          </header>

          <Tabs
            onChange={setTab}
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "activity", label: "Activity", count: events.length },
            ]}
            value={tab}
          />

          {tab === "overview" ? (
            <div className="review-body">
              <ReviewCard findings={findings} />
              <PoSection searchRef={searchRef} view={view} />
              <LineMatching expanded={expanded} linesRef={linesRef} onAskSales={openTeams} setExpanded={setExpanded} view={view} />
            </div>
          ) : (
            <div className="review-body">
              <ActivityFeed events={events} onOpenQuery={view.query ? () => openQuery(view.query!.id) : undefined} view={view} />
            </div>
          )}
        </div>

        <footer className="action-bar">
          <span className={`action-state ${canApprove || view.approvedAt ? "ok" : ""}`}>
            {canApprove || view.approvedAt ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />}
            {view.approvedAt
              ? `Approved ${view.approvedAt}`
              : canApprove
                ? "Ready to approve"
                : `${blocking} item${blocking > 1 ? "s" : ""} blocking approval`}
          </span>
          {!view.approvedAt && (
            <>
              <Button icon={MessagesSquare} onClick={openTeams}>
                {view.query && !view.query.applied ? "View thread" : "Ask Sales"}
              </Button>
              <Button disabled={!canApprove} iconRight={ArrowRight} onClick={approveAndNext} variant="primary">
                Approve
              </Button>
            </>
          )}
          {view.approvedAt && (
            <Button iconRight={ArrowRight} onClick={() => openInvoice(null)}>
              Back to invoices
            </Button>
          )}
        </footer>
      </section>

      <aside className="doc-panel">
        <div className="doc-tabs" role="tablist">
          {(
            [
              ["invoice", "Invoice"],
              ["po", "PO"],
              ["email", "Email"],
              ["teams", "Teams"],
            ] as const
          ).map(([key, label]) => (
            <button className={panel === key ? "active" : ""} key={key} onClick={() => setPanel(key)} role="tab">
              {label}
              {key === "teams" && view.query && !view.query.applied && <i className={`doc-dot ${view.query.reply ? "hot" : ""}`} />}
            </button>
          ))}
        </div>
        <div className="doc-body">
          {panel === "invoice" && <DocumentViewer checks={view.checks} invoice={invoice} po={po} show="invoice" />}
          {panel === "po" && <DocumentViewer checks={view.checks} invoice={invoice} po={po} show="po" />}
          {panel === "email" &&
            (email ? (
              <div className="viewer">
                <div className="viewer-canvas">
                  <EmailPaper email={email} />
                </div>
              </div>
            ) : (
              <div className="viewer">
                <div className="viewer-canvas">
                  <div className="paper paper-empty">Received before this mailbox was connected.</div>
                </div>
              </div>
            ))}
          {panel === "teams" && <TeamsThread key={view.query?.id ?? "new"} view={view} />}
        </div>
      </aside>
    </div>
  )
}
