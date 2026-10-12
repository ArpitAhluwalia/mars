import { useMemo, useState } from "react"
import {
  ArrowRight,
  BellRing,
  Check,
  CheckCheck,
  CircleDashed,
  Link2,
  MessagesSquare,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { Avatar, Button, EmptyState, SearchField, StatusPill, Tabs } from "../../components/ui"
import { money, poLabel } from "../../data/reconcile"
import type { InvoiceStatus } from "../../data/types"
import { useInvoices, useMars, type InvoiceView } from "../../state/store"

type GroupId = "review" | "sales" | "ready" | "approved"

export const groups: {
  id: GroupId
  label: string
  icon: LucideIcon
  statuses: InvoiceStatus[]
}[] = [
  {
    id: "review",
    label: "Needs review",
    icon: CircleDashed,
    statuses: [
      "Sales replied",
      "Correction requested",
      "Needs review",
      "Confirm PO",
      "Missing PO",
    ],
  },
  {
    id: "ready",
    label: "Ready to approve",
    icon: Check,
    statuses: ["Ready to approve"],
  },
  {
    id: "sales",
    label: "With Sales",
    icon: MessagesSquare,
    statuses: ["With Sales"],
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCheck,
    statuses: ["Approved"],
  },
]

export const groupOf = (status: InvoiceStatus) =>
  groups.find((group) => group.statuses.includes(status))!

// Inside a group, the most actionable first.
export const byPriority = (a: InvoiceView, b: InvoiceView) => {
  const ga = groupOf(a.status)
  const gb = groupOf(b.status)
  if (ga !== gb) return groups.indexOf(ga) - groups.indexOf(gb)
  return ga.statuses.indexOf(a.status) - gb.statuses.indexOf(b.status)
}

const sum = (items: InvoiceView[]) =>
  items.reduce((total, item) => total + (item.invoice.total ?? 0), 0)

function Due({ due }: { due: string }) {
  if (due.startsWith("Overdue")) {
    return (
      <span className="cell-stack">
        <strong>7 Oct</strong>
        <small className="overdue">Overdue</small>
      </span>
    )
  }
  return <span className={due === "Paid" ? "muted" : ""}>{due}</span>
}

// One obvious next action per row, so easy cases close without opening the invoice.
function QuickAction({ item }: { item: InvoiceView }) {
  const { approve, applyReply, linkPo, remind, notify, openInvoice } = useMars()
  const stop = (fn: () => void) => (event: React.MouseEvent) => {
    event.stopPropagation()
    fn()
  }
  const best = item.suggestions[0]
  switch (item.status) {
    case "Ready to approve":
      return (
        <Button
          icon={Check}
          onClick={stop(() => {
            approve(item.id)
            notify(`${item.invoice.invoiceNumber} approved`)
          })}
          size="sm"
          variant="primary"
        >
          Approve
        </Button>
      )
    case "Sales replied":
      return (
        <Button
          onClick={stop(() => {
            applyReply(item.query!.id)
            notify("Sales approval applied")
          })}
          size="sm"
        >
          Apply reply
        </Button>
      )
    case "Confirm PO":
      return (
        <Button
          icon={Link2}
          onClick={stop(() => {
            linkPo(item.id, best.po, `AI match · ${best.score}%`)
            notify(`${poLabel(best.po.poNumber)} linked`)
          })}
          size="sm"
        >
          Link {poLabel(best.po.poNumber)}
        </Button>
      )
    case "With Sales":
      return (
        <Button
          icon={BellRing}
          onClick={stop(() => {
            remind([item.query!.id])
            notify(`Reminder sent to ${item.query!.rep}`)
          })}
          size="sm"
        >
          Remind
        </Button>
      )
    case "Approved":
      return null
    default:
      return (
        <Button iconRight={ArrowRight} onClick={stop(() => openInvoice(item.id))} size="sm">
          Review
        </Button>
      )
  }
}

// Bulk actions only where they're safe: approving clean invoices, and nudging Sales.
function GroupAction({ group, items }: { group: (typeof groups)[number]; items: InvoiceView[] }) {
  const { approve, remind, notify } = useMars()
  if (group.id === "ready" && items.length > 1) {
    return (
      <Button
        icon={CheckCheck}
        onClick={() => {
          approve(items.map((item) => item.id))
          notify(`${items.length} invoices approved · ${money(sum(items))}`)
        }}
        size="sm"
        variant="primary"
      >
        Approve all
      </Button>
    )
  }
  if (group.id === "sales" && items.length > 1) {
    return (
      <Button
        icon={BellRing}
        onClick={() => {
          remind(items.map((item) => item.query!.id))
          notify(`Reminders sent to ${items.length} reps`)
        }}
        size="sm"
      >
        Remind all
      </Button>
    )
  }
  return null
}

function GroupRow({ group, items }: { group: (typeof groups)[number]; items: InvoiceView[] }) {
  return (
    <tr className="group">
      <td colSpan={3}>
        <span className="group-label">
          <group.icon size={16} strokeWidth={1.75} />
          {group.label}
          <span className="tab-count">{items.length}</span>
        </span>
      </td>
      <td className="right num muted">{money(sum(items))}</td>
      <td />
      <td className="right">
        <GroupAction group={group} items={items} />
      </td>
    </tr>
  )
}

export default function InvoiceList() {
  const { openInvoice, openQuery, notify } = useMars()
  const invoices = useInvoices()
  const [tab, setTab] = useState<"all" | GroupId>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(
    () =>
      invoices
        .filter((item) =>
          `${item.invoice.vendor} ${item.invoice.invoiceNumber} ${item.invoice.poNumber} ${item.po?.poNumber ?? ""} ${item.meta.ticket}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort(byPriority),
    [invoices, query],
  )

  const inGroup = (id: GroupId) => filtered.filter((item) => groupOf(item.status).id === id)
  const shownGroups = groups.filter((group) => (tab === "all" ? group.id !== "approved" : group.id === tab))

  return (
    <div className="page page-flush">
      <div>
        <header className="flush-head">
          <h1>Invoices</h1>
          <Button icon={Upload} onClick={() => notify("Drop a PDF to upload an invoice")} size="sm" variant="ghost">
            Upload
          </Button>
        </header>

        <div className="tabs-row">
          <Tabs
            onChange={setTab}
            tabs={[
              { id: "all", label: "All open" },
              ...groups.map((group) => ({ id: group.id, label: group.label, count: inGroup(group.id).length })),
            ]}
            value={tab}
          />
          <SearchField onChange={setQuery} placeholder="Search vendor, invoice, PO or ticket" value={query} />
        </div>

        <table className="table invoices-table">
          <thead>
            <tr>
              <th>Vendor / invoice</th>
              <th>Status</th>
              <th>Next step</th>
              <th className="right">Amount</th>
              <th>Due</th>
              <th className="col-action" />
            </tr>
          </thead>
          <tbody>
            {shownGroups.map((group) => {
              const items = inGroup(group.id)
              if (!items.length) return null
              return [
                <GroupRow group={group} items={items} key={group.id} />,
                ...items.map((item) => (
                  <tr
                    className="row"
                    key={item.id}
                    onClick={() => (item.status === "With Sales" && item.query ? openQuery(item.query.id) : openInvoice(item.id))}
                  >
                    <td>
                      <span className="vendor-cell">
                        <Avatar name={item.invoice.vendor} size={34} />
                        <span className="cell-stack">
                          <strong>{item.invoice.vendor}</strong>
                          <small>
                            {item.invoice.invoiceNumber} · {item.meta.ticket}
                          </small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <StatusPill status={item.status} />
                    </td>
                    <td>
                      <span className="cell-stack">
                        <strong>{item.finding}</strong>
                        <small>{item.support}</small>
                      </span>
                    </td>
                    <td className="right num">{money(item.invoice.total)}</td>
                    <td>
                      <Due due={item.meta.due} />
                    </td>
                    <td className="right col-action">
                      <span className="row-action">
                        <QuickAction item={item} />
                      </span>
                    </td>
                  </tr>
                )),
              ]
            })}
          </tbody>
        </table>
        {!shownGroups.some((group) => inGroup(group.id).length) && (
          <EmptyState title="Nothing here">Try another tab or search.</EmptyState>
        )}
      </div>
    </div>
  )
}
