import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { checkLines, money, normPo, poByNumber, poLabel, suggestPos, totalWithinBand, verdictLabel, type PoSuggestion } from "../data/reconcile"
import {
  emails,
  initialQueries,
  initiallyApproved,
  LATE_EMAIL_ID,
  initiallyQueued,
  invoiceMeta,
  OWNER,
  TODAY,
  salesRep,
  seedAudit,
} from "../data/scenario"
import { ocrInvoices, purchaseOrders } from "../data/source"
import type { AuditEvent, InvoiceStatus, LineCheck, OcrInvoice, PurchaseOrder, Query, SalesAnswer } from "../data/types"

export type View = "inbox" | "invoices" | "queries" | "audit"

type LineEdit = { quantity: number; unitPrice: number }

type State = {
  view: View
  openInvoiceId: string | null
  selectedQueryId: string | null
  selectedAuditId: string | null
  queued: string[]
  inbox: string[]
  processingEmail: string | null
  links: Record<string, { poId: string; how: string }>
  edits: Record<string, Record<string, LineEdit>>
  accepted: Record<string, Record<string, string>>
  queries: Query[]
  approved: Record<string, string>
  audit: Record<string, AuditEvent[]>
  toast: string
}

export type InvoiceView = {
  id: string
  invoice: OcrInvoice
  meta: (typeof invoiceMeta)[string]
  po: PurchaseOrder | null
  link: State["links"][string] | null
  checks: LineCheck[]
  openLines: LineCheck[]
  headerIssues: ("vendor" | "ref")[]
  accepted: Record<string, string>
  suggestions: PoSuggestion[]
  query: Query | null
  status: InvoiceStatus
  finding: string
  support: string
  approvedAt: string | null
  rep: (typeof salesRep)[string]
}

// A demo clock: 10:30 AM on the prototype's date, advancing in real time from
// page load, so new events always land after the seeded morning ones.
const DEMO_START = Date.now()
const now = () => {
  const time = new Date(2026, 9, 8, 10, 30).getTime() + (Date.now() - DEMO_START)
  return `${TODAY.split(" ").slice(0, 2).join(" ")}, ${new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
}

const byId = (id: string) => ocrInvoices.find((invoice) => invoice.id === id)!

function applyEdits(invoice: OcrInvoice, edits: Record<string, LineEdit> | undefined): OcrInvoice {
  if (!edits) return invoice
  const lines = invoice.lines.map((line, index) => {
    const edit = edits[String(index)]
    return edit ? { ...line, ...edit, lineTotal: edit.quantity * edit.unitPrice } : line
  })
  const subtotal = lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0)
  const delta = subtotal - (invoice.subtotal ?? subtotal)
  return { ...invoice, lines, subtotal, total: (invoice.total ?? 0) + delta }
}

export function deriveInvoice(state: State, id: string): InvoiceView {
  const invoice = applyEdits(byId(id), state.edits[id])
  const link = state.links[id] ?? null
  const po = link ? purchaseOrders.find((item) => item.id === link.poId) ?? null : poByNumber(invoice.poNumber)
  const checks = po ? checkLines(invoice, po) : []
  const accepted = state.accepted[id] ?? {}
  const openLines = checks.filter((line) => line.verdict !== "match" && !accepted[line.key])
  const headerIssues: InvoiceView["headerIssues"] = []
  if (po && po.vendor !== invoice.vendor && !accepted.vendor) headerIssues.push("vendor")
  if (po && normPo(po.poNumber) !== normPo(invoice.poNumber) && !accepted.ref) headerIssues.push("ref")
  const suggestions = po ? [] : suggestPos(invoice)
  const query = [...state.queries].reverse().find((item) => item.invoiceId === id) ?? null
  const approvedAt = state.approved[id] ?? null
  const rep = salesRep[invoice.vendor] ?? { name: "Sales", initials: "S", title: "Sales" }
  const pending = query && !query.applied

  let status: InvoiceStatus
  let finding: string
  let support: string
  if (approvedAt) {
    status = "Approved"
    finding = `Approved ${approvedAt.split(",")[0]}`
    support = po?.standing ? `Released against ${po.poNumber}` : `Closed against ${po?.poNumber ?? "PO"}`
  } else if (pending && !query.reply) {
    status = "With Sales"
    finding = `Waiting on ${query.rep}`
    support = `Asked ${query.sentAt}`
  } else if (pending && query.reply) {
    status = query.reply.action === "approve" ? "Sales replied" : "Correction requested"
    finding = query.reply.action === "approve" ? `${query.rep} approved as billed` : `${query.rep} asked for a correction`
    support = query.reply.action === "approve" ? "Apply to close flagged lines" : "Read the note before continuing"
  } else if (!po && suggestions.length) {
    status = "Confirm PO"
    finding = `${poLabel(suggestions[0].po.poNumber)} suggested · ${suggestions[0].score}% match`
    support = `Invoice cites ${invoice.poNumber}, which isn't on file`
  } else if (!po) {
    status = "Missing PO"
    finding = `${invoice.poNumber} not on file`
    support = "No close match · search or ask Sales"
  } else if (openLines.length) {
    status = "Needs review"
    const net = openLines.reduce((sum, line) => sum + line.difference, 0)
    finding = `${openLines.length} line${openLines.length > 1 ? "s" : ""} over tolerance · ${money(net, true)}`
    support = openLines
      .slice(0, 2)
      .map((line) => `${line.description.split(",")[0]}: ${verdictLabel[line.verdict].toLowerCase()}`)
      .join(" · ")
  } else if (headerIssues.length) {
    status = "Needs review"
    finding = headerIssues.includes("vendor") ? "Vendor name differs on PO" : `Invoice cites ${invoice.poNumber}`
    support = "Confirm the linked PO"
  } else {
    status = "Ready to approve"
    finding = checks.some((line) => line.verdict !== "match")
      ? "Exceptions resolved"
      : po.standing
        ? "Within standing order balance"
        : checks.every((line) => line.exact) && totalWithinBand(invoice, po)
          ? "Exact match to PO"
          : "Matched within tolerance"
    support = poLabel(po.poNumber)
  }

  return {
    id,
    invoice,
    meta: invoiceMeta[id],
    po,
    link,
    checks,
    openLines,
    headerIssues,
    accepted,
    suggestions,
    query,
    status,
    finding,
    support,
    approvedAt,
    rep,
  }
}

function initialState(): State {
  const base: State = {
    view: "inbox",
    openInvoiceId: null,
    selectedQueryId: null,
    selectedAuditId: null,
    queued: initiallyQueued,
    inbox: emails.filter((email) => email.id !== LATE_EMAIL_ID).map((email) => email.id),
    processingEmail: null,
    links: {},
    edits: {},
    accepted: {},
    queries: [],
    approved: initiallyApproved,
    audit: {},
    toast: "",
  }
  // Seed queries with the lines that are actually flagged.
  base.queries = initialQueries.map((query) => ({
    ...query,
    lineKeys: deriveInvoice(base, query.invoiceId).openLines.map((line) => line.key),
  }))
  for (const id of initiallyQueued) base.audit[id] = initialAudit(base, id)
  return base
}

function matchEvent(state: State, id: string): AuditEvent {
  const view = deriveInvoice({ ...state, queries: [], approved: {} }, id)
  if (view.po) {
    const flagged = view.checks.filter((line) => line.verdict !== "match").length
    return {
      at: view.meta.received,
      title: `${poLabel(view.po.poNumber)} matched`,
      detail: flagged ? `${flagged} of ${view.checks.length} lines outside tolerance` : `All ${view.checks.length} lines within tolerance`,
      who: "MARS",
      kind: "match",
    }
  }
  return {
    at: view.meta.received,
    title: view.suggestions.length ? `${view.suggestions.length} likely POs found` : "No PO on file",
    detail: view.suggestions.length
      ? `${view.invoice.poNumber} not on file · closest ${view.suggestions.map((item) => item.po.poNumber).join(", ")}`
      : `${view.invoice.poNumber} not on file · no close match`,
    who: "MARS",
    kind: "match",
  }
}

function initialAudit(state: State, id: string): AuditEvent[] {
  const extra: AuditEvent[] = [matchEvent(state, id)]
  const query = state.queries.find((item) => item.invoiceId === id)
  if (query) {
    extra.push({ at: query.sentAt, title: "Sent to Sales in Teams", detail: `${query.rep} · ${query.lineKeys.length} flagged lines`, who: `${OWNER.name} · FinOps`, kind: "sales" })
    if (query.reply) {
      extra.push({
        at: query.reply.at,
        title: `Sales reply · ${query.reply.action === "approve" ? "Approved" : "Needs correction"}`,
        detail: query.reply.justification,
        who: `${query.rep} · Sales`,
        kind: "sales",
      })
    }
  }
  if (state.approved[id]) {
    extra.push({ at: state.approved[id], title: "Invoice approved", detail: "Released against the PO and sent for posting", who: `${OWNER.name} · FinOps`, kind: "approval" })
  }
  return seedAudit(id, extra)
}

function useMarsState() {
  const [state, setState] = useState<State>(initialState)

  const log = (draft: State, id: string, event: Omit<AuditEvent, "at" | "who"> & { who?: string }) => {
    draft.audit = {
      ...draft.audit,
      [id]: [...(draft.audit[id] ?? []), { at: now(), who: `${OWNER.name} · FinOps`, ...event }],
    }
  }

  const update = (fn: (draft: State) => void) =>
    setState((current) => {
      const draft = { ...current }
      fn(draft)
      return draft
    })

  const toastTimer = useRef<number | undefined>(undefined)
  const notify = (message: string) => {
    update((draft) => {
      draft.toast = message
    })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => update((draft) => void (draft.toast = "")), 2800)
  }

  return {
    state,
    notify,
    go: (view: View) =>
      update((draft) => {
        draft.view = view
        if (view === "invoices") draft.openInvoiceId = null
      }),
    openInvoice: (id: string | null) =>
      update((draft) => {
        draft.view = "invoices"
        draft.openInvoiceId = id
      }),
    openQuery: (id: string) =>
      update((draft) => {
        draft.view = "queries"
        draft.selectedQueryId = id
      }),
    selectQuery: (id: string) => update((draft) => void (draft.selectedQueryId = id)),
    openAudit: (invoiceId: string) =>
      update((draft) => {
        draft.view = "audit"
        draft.selectedAuditId = invoiceId
      }),
    selectAudit: (invoiceId: string) => update((draft) => void (draft.selectedAuditId = invoiceId)),
    // New mail lands, MARS reads it, and any invoices go straight to Invoices.
    syncMailbox: () => {
      if (state.inbox.includes(LATE_EMAIL_ID)) {
        notify("Mailbox is up to date")
        return
      }
      update((draft) => {
        draft.inbox = [LATE_EMAIL_ID, ...draft.inbox]
        draft.processingEmail = LATE_EMAIL_ID
      })
      window.setTimeout(() => {
        const ids = emails.find((email) => email.id === LATE_EMAIL_ID)!.attachments.flatMap((file) => file.invoiceIds)
        update((draft) => {
          draft.processingEmail = null
          draft.queued = [...draft.queued, ...ids.filter((id) => !draft.queued.includes(id))]
          for (const id of ids) {
            draft.audit = { ...draft.audit, [id]: initialAudit(draft, id) }
            log(draft, id, { title: "Assigned for review", detail: `Routed to ${OWNER.name}`, who: "MARS", kind: "intake" })
          }
        })
        notify("1 new invoice from Voss & Tanner GmbH")
      }, 2200)
    },
    linkPo: (id: string, po: PurchaseOrder, how: string) =>
      update((draft) => {
        draft.links = { ...draft.links, [id]: { poId: po.id, how } }
        // Choosing the PO by hand confirms the reference; vendor spelling still needs a look.
        draft.accepted = { ...draft.accepted, [id]: { ref: `Linked by ${OWNER.name}` } }
        log(draft, id, { title: `${poLabel(po.poNumber)} linked`, detail: how, kind: "match" })
      }),
    editLine: (id: string, key: string, edit: LineEdit, description: string) =>
      update((draft) => {
        draft.edits = { ...draft.edits, [id]: { ...(draft.edits[id] ?? {}), [key]: edit } }
        log(draft, id, {
          title: "OCR value corrected",
          detail: `${description} · ${edit.quantity} × ${money(edit.unitPrice)}`,
          kind: "edit",
        })
      }),
    acceptLine: (id: string, key: string, remark: string, description: string) =>
      update((draft) => {
        draft.accepted = { ...draft.accepted, [id]: { ...(draft.accepted[id] ?? {}), [key]: remark } }
        log(draft, id, { title: "Difference accepted", detail: `${description} · ${remark}`, kind: "edit" })
      }),
    askSales: (id: string, message: string) => {
      const view = deriveInvoice(state, id)
      const query: Query = {
        id: `q-${id}-${Date.now()}`,
        invoiceId: id,
        ticket: view.meta.ticket,
        rep: view.rep.name,
        sentAt: now(),
        message,
        lineKeys: view.openLines.map((line) => line.key),
      }
      update((draft) => {
        draft.queries = [...draft.queries, query]
        log(draft, id, { title: "Sent to Sales in Teams", detail: `${query.rep} · ${query.lineKeys.length || "no"} flagged lines`, kind: "sales" })
      })
      return query
    },
    simulateReply: (queryId: string, action: SalesAnswer, justification: string) =>
      update((draft) => {
        const query = draft.queries.find((item) => item.id === queryId)
        if (!query) return
        draft.queries = draft.queries.map((item) =>
          item.id === queryId ? { ...item, reply: { action, justification, at: now() } } : item,
        )
        draft.audit = {
          ...draft.audit,
          [query.invoiceId]: [
            ...(draft.audit[query.invoiceId] ?? []),
            {
              at: now(),
              title: `Sales reply · ${action === "approve" ? "Approved" : "Needs correction"}`,
              detail: justification,
              who: `${query.rep} · Sales`,
              kind: "sales",
            },
          ],
        }
      }),
    remind: (queryIds: string[]) =>
      update((draft) => {
        for (const query of draft.queries.filter((item) => queryIds.includes(item.id))) {
          log(draft, query.invoiceId, { title: "Reminded Sales in Teams", detail: `Nudged ${query.rep} on the open card`, kind: "sales" })
        }
      }),
    applyReply: (queryId: string) =>
      update((draft) => {
        const query = draft.queries.find((item) => item.id === queryId)
        if (!query?.reply) return
        draft.queries = draft.queries.map((item) => (item.id === queryId ? { ...item, applied: true } : item))
        if (query.reply.action === "approve") {
          const accepted = { ...(draft.accepted[query.invoiceId] ?? {}) }
          for (const key of query.lineKeys) accepted[key] = `Approved by ${query.rep} in Teams`
          draft.accepted = { ...draft.accepted, [query.invoiceId]: accepted }
        }
        log(draft, query.invoiceId, {
          title: query.reply.action === "approve" ? "Sales approval applied" : "Correction request noted",
          detail: query.reply.action === "approve" ? `${query.lineKeys.length} flagged lines closed` : "Lines stay open until corrected",
          kind: "sales",
        })
      }),
    approve: (ids: string | string[]) =>
      update((draft) => {
        for (const id of Array.isArray(ids) ? ids : [ids]) {
          draft.approved = { ...draft.approved, [id]: now() }
          log(draft, id, { title: "Invoice approved", detail: "Released against the PO and sent for posting", kind: "approval" })
        }
      }),
  }
}

type Mars = ReturnType<typeof useMarsState>

const MarsContext = createContext<Mars | null>(null)

export function MarsProvider({ children }: { children: ReactNode }) {
  const mars = useMarsState()
  return <MarsContext.Provider value={mars}>{children}</MarsContext.Provider>
}

export function useMars() {
  const mars = useContext(MarsContext)
  if (!mars) throw new Error("useMars must be used inside MarsProvider")
  return mars
}

export function useInvoices() {
  const { state } = useMars()
  return useMemo(() => state.queued.map((id) => deriveInvoice(state, id)), [state])
}

export function useInvoice(id: string) {
  const { state } = useMars()
  return useMemo(() => deriveInvoice(state, id), [state, id])
}
