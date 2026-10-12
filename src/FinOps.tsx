import { useEffect, useMemo, useState } from "react"

const asset = (name: string) => `/assets/${name}`

function FIcon({
  name,
  size,
  alt = "",
}: {
  name: string
  size: number
  alt?: string
}) {
  return <img alt={alt} height={size} src={asset(name)} width={size} />
}

type QueueStatus =
  | "Needs review"
  | "Ready for approval"
  | "Waiting on Sales"
  | "No PO match found"

type QueueItem = {
  vendor: string
  invoice: string
  source: string
  amount: string
  due: string
  status: QueueStatus
  finding: string
  support: string
}

const queueItems: QueueItem[] = [
  {
    vendor: "Nortek Air Solutions #1",
    invoice: "NTK-77413",
    source: "Email intake",
    amount: "$9,180.50",
    due: "Today",
    status: "Needs review",
    finding: "Freight is $270 above the PO",
    support: "Compare the freight charge with the linked PO",
  },
  {
    vendor: "Nortek Air Solutions #2",
    invoice: "NTK-77413",
    source: "Email intake",
    amount: "$3,213.50",
    due: "Today",
    status: "Needs review",
    finding: "Freight is $190 above the PO",
    support: "Compare the freight charge with the linked PO",
  },
  {
    vendor: "Atlas Mechanical",
    invoice: "ATL-20816",
    source: "Email intake",
    amount: "$4,260.00",
    due: "Today",
    status: "Ready for approval",
    finding: "All lines match; checks passed",
    support: "Review the reconciliation before approving",
  },
  {
    vendor: "Summit Controls",
    invoice: "SUM-10382",
    source: "Email intake",
    amount: "$12,480.00",
    due: "Tomorrow",
    status: "Needs review",
    finding: "Two possible PO matches",
    support: "Select the correct purchase order",
  },
  {
    vendor: "Harbor Equipment",
    invoice: "HBR-59014",
    source: "Email intake",
    amount: "$6,725.00",
    due: "Tomorrow",
    status: "Waiting on Sales",
    finding: "Charge clarification requested from Sales",
    support: "Awaiting a response from the PO owner",
  },
  {
    vendor: "Cedar Industrial",
    invoice: "CED-88210",
    source: "Email intake",
    amount: "$3,150.00",
    due: "In 2 days",
    status: "Needs review",
    finding: "Invoice quantity exceeds PO quantity",
    support: "Check the invoiced quantity against the order",
  },
  {
    vendor: "Westbrook Supply",
    invoice: "WBS-32067",
    source: "Email intake",
    amount: "$2,840.00",
    due: "In 3 days",
    status: "Ready for approval",
    finding: "All lines match; checks passed",
    support: "Review the reconciliation before approving",
  },
  {
    vendor: "Northstar Office Supplies",
    invoice: "NS-TEST-3004",
    source: "Manual upload",
    amount: "$3,090.54",
    due: "In 4 days",
    status: "No PO match found",
    finding: "No matching purchase order found",
    support: "Link a PO to continue reconciliation · In queue for 3.8h",
  },
]

function Status({ children }: { children: QueueStatus | string }) {
  const className =
    children === "Ready for approval" || children === "Matched" || children === "Linked"
      ? "status-badge success"
      : children === "Waiting on Sales"
        ? "status-badge neutral"
        : "status-badge warning"
  return <span className={className}>{children}</span>
}

function QueueView({
  onOpenReview,
  notify,
}: {
  onOpenReview: () => void
  notify: (message: string) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All invoices")
  const [issueFilterOpen, setIssueFilterOpen] = useState(false)

  const visibleItems = useMemo(() => {
    const normalized = query.toLowerCase()
    return queueItems.filter((item) => {
      const matchesQuery = `${item.vendor} ${item.invoice} ${item.finding}`
        .toLowerCase()
        .includes(normalized)
      const matchesFilter =
        filter === "All invoices" ||
        (filter === "Needs review" && item.status.includes("review")) ||
        item.status === filter
      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  return (
    <div className="queue-page">
      <header className="queue-toolbar">
        <h1>Work queue</h1>
        <div className="queue-owner">
          <button className="fin-secondary">
            Assigned to me
            <FIcon name="0c0d8.svg" size={20} />
          </button>
          <span className="reviewer-avatar">AR</span>
          <span>Alex Rivera</span>
        </div>
      </header>
      <div className="queue-content">
        <div className="queue-search-row">
          <label className="fin-search">
            <FIcon name="53aa0.svg" size={20} />
            <input
              aria-label="Search work queue"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vendor, invoice, PO, or ticket"
              value={query}
            />
          </label>
          <button
            className="fin-secondary orange"
            onClick={() => notify("Invoice uploader opened")}
          >
            <FIcon name="609a9.svg" size={16} />
            Upload invoice
          </button>
          <div className="fin-menu-wrap">
            <button
              className="fin-secondary"
              onClick={() => setIssueFilterOpen(!issueFilterOpen)}
            >
              All issues
              <FIcon name="0c0d8.svg" size={20} />
            </button>
            {issueFilterOpen && (
              <div className="fin-popover">
                <button onClick={() => setIssueFilterOpen(false)}>All issues</button>
                <button onClick={() => setIssueFilterOpen(false)}>PO mismatch</button>
                <button onClick={() => setIssueFilterOpen(false)}>Amount variance</button>
                <button onClick={() => setIssueFilterOpen(false)}>Missing PO</button>
              </div>
            )}
          </div>
        </div>
        <div className="queue-tabs">
          <div role="tablist">
            {[
              ["All invoices", 12],
              ["Needs review", 5],
              ["Ready for approval", 3],
              ["Waiting on Sales", 4],
            ].map(([label, count]) => (
              <button
                className={filter === label ? "active" : ""}
                key={label}
                onClick={() => setFilter(String(label))}
                role="tab"
              >
                {label} <span>{count}</span>
              </button>
            ))}
          </div>
          <small>Last updated: 8 Oct 2026, 10:24 AM</small>
        </div>
        <div className="queue-table-wrap">
          <div className="queue-table">
            <div className="queue-table-head">
              <span>Vendor / Invoice</span>
              <span>Amount</span>
              <span>Due ↑</span>
              <span>Status</span>
              <span>What needs attention</span>
              <span>Action</span>
            </div>
            {visibleItems.map((item) => (
              <button
                className="queue-row"
                key={`${item.vendor}-${item.amount}`}
                onClick={onOpenReview}
              >
                <span className="queue-vendor">
                  <strong>{item.vendor}</strong>
                  <small>
                    {item.invoice} · {item.source}
                  </small>
                </span>
                <span className="queue-amount">{item.amount}</span>
                <span>{item.due}</span>
                <span>
                  <Status>{item.status}</Status>
                </span>
                <span className="queue-finding">
                  <span>{item.finding}</span>
                  <small>{item.support}</small>
                </span>
                <span className={item.status === "Waiting on Sales" ? "review-link muted" : "review-link"}>
                  {item.status === "Waiting on Sales" ? "View request" : "Review"}
                </span>
              </button>
            ))}
            {!visibleItems.length && (
              <div className="queue-empty">No invoices match your filters.</div>
            )}
          </div>
        </div>
        <footer className="queue-pagination">
          <span>
            Showing 1–8 of 12 invoices
            <small>Each invoice opens with its evidence, ownership, and history.</small>
          </span>
          <span>
            <button disabled>Previous</button>
            <small>1 / 2</small>
            <button onClick={() => notify("Next queue page loaded")}>Next</button>
          </span>
        </footer>
      </div>
    </div>
  )
}

function SourceDocument({
  type,
  zoom,
}: {
  type: "invoice" | "po"
  zoom: number
}) {
  const isInvoice = type === "invoice"
  return (
    <div className={`source-invoice source-document-${type} zoom-${zoom}`}>
      <small>{isInvoice ? "INVOICE" : "PURCHASE ORDER"}</small>
      <h3>{isInvoice ? "Nortek Air Solutions" : "Meriton Procurement"}</h3>
      <p>{isInvoice ? "NTK-77413" : "PO 4482210"}</p>
      <div className="source-fields">
        <span>
          <small>{isInvoice ? "Bill to" : "Supplier"}</small>
          {isInvoice ? "Meriton Finance" : "Nortek Air Solutions"}
        </span>
        <span>
          <small>Ship to</small>
          100 Smith Street, Collingwood VIC 3066 AU
        </span>
        <div>
          <span>
            <small>{isInvoice ? "Terms" : "Order date"}</small>
            {isInvoice ? "Net 30 days" : "01 Oct 2026"}
          </span>
          <span>
            <small>{isInvoice ? "PO reference" : "Status"}</small>
            {isInvoice ? "4482201" : "Approved"}
          </span>
        </div>
      </div>
      <div className="source-lines">
        <span className="source-line-head">
          <small>Description</small>
          <small>Amount</small>
        </span>
        <span>
          Rooftop unit RTU-40 <b>$7,700.00</b>
        </span>
        <span>
          Curb adapter kit <b>$940.50</b>
        </span>
        <span className="source-variance">
          Freight surcharge <b>{isInvoice ? "$540.00" : "$270.00"}</b>
        </span>
      </div>
      <strong className="source-total">
        {isInvoice ? "Total due" : "PO total"}
        <span>{isInvoice ? "$9,180.50" : "$8,910.50"}</span>
      </strong>
    </div>
  )
}

function EvidencePanel() {
  const [tab, setTab] = useState<"Invoice" | "Purchase order" | "Compare">("Invoice")
  const [zoom, setZoom] = useState(100)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [expanded])

  return (
    <>
      {expanded && (
        <button
          aria-label="Close source document viewer"
          className="evidence-dismiss"
          onClick={() => setExpanded(false)}
        />
      )}
      <aside className={`evidence-panel ${expanded ? "expanded" : ""}`}>
        <div className="evidence-title">
          <span>
            <strong>Source documents</strong>
            <small>Original records</small>
          </span>
          <span className="evidence-title-actions">
            {!expanded && (
              <button
                aria-label="Open full evidence view"
                onClick={() => setExpanded(true)}
              >
                <FIcon name="43f13.svg" size={16} />
              </button>
            )}
            {expanded && (
              <button
                aria-label="Close source document viewer"
                className="evidence-close"
                onClick={() => setExpanded(false)}
              >
                ×
              </button>
            )}
          </span>
        </div>
        <div className="evidence-tabs" role="tablist">
          {(["Invoice", "Purchase order", "Compare"] as const).map((label) => (
            <button
              className={tab === label ? "active" : ""}
              key={label}
              onClick={() => {
                setTab(label)
                if (label === "Compare") setExpanded(true)
              }}
              role="tab"
            >
              {label}
            </button>
          ))}
        </div>
        <div className={`document-preview ${tab === "Compare" ? "comparing" : ""}`}>
          <div className="document-controls">
            <span>{tab === "Compare" ? "Aligned source view" : "Page 1 of 2"}</span>
            <span>
              <button onClick={() => setZoom(Math.max(80, zoom - 10))}>
                <FIcon name="b7f84.svg" size={12} />
              </button>
              {zoom}%
              <button onClick={() => setZoom(Math.min(120, zoom + 10))}>
                <FIcon name="4dcfa.svg" size={12} />
              </button>
            </span>
          </div>
          {tab === "Compare" ? (
            <div className="source-documents-compare">
              <div>
                <span className="source-document-label">
                  Original invoice <strong>$9,180.50</strong>
                </span>
                <SourceDocument type="invoice" zoom={zoom} />
              </div>
              <div>
                <span className="source-document-label">
                  Original PO <strong>$8,910.50</strong>
                </span>
                <SourceDocument type="po" zoom={zoom} />
              </div>
            </div>
          ) : (
            <SourceDocument type={tab === "Invoice" ? "invoice" : "po"} zoom={zoom} />
          )}
          <small>Original source values · Freight variance highlighted.</small>
        </div>
        <div className="evidence-action">
          <span>
            {tab === "Invoice"
              ? "Invoice PO reference: 4482201"
              : tab === "Purchase order"
                ? "Approved PO: 4482210"
                : "$270 freight difference"}
          </span>
          <button
            className="fin-secondary"
            onClick={() => {
              setTab("Compare")
              setExpanded(true)
            }}
          >
            Compare originals
          </button>
        </div>
        <div className="evidence-note">
          <strong>Source discrepancy</strong>
          <p>
            The invoice contains $540 freight and references 4482201. The approved
            PO allows $270 freight under PO 4482210.
          </p>
        </div>
      </aside>
    </>
  )
}

function TeamsSalesDialog({
  close,
  onResolve,
  onSend,
  sent,
}: {
  close: () => void
  onResolve: () => void
  onSend: () => void
  sent: boolean
}) {
  return (
    <div className="sales-dialog-backdrop">
      <section aria-label="Microsoft Teams chat with Sales" className="sales-dialog">
        <header>
          <span className="sales-teams-mark">T</span>
          <span>
            <strong>Microsoft Teams · Sales</strong>
            <small>J. Alvarez · Available</small>
          </span>
          <button aria-label="Close Sales chat" onClick={close}>
            ×
          </button>
        </header>
        <div className="sales-chat">
          <div className="chat-context">
            <strong>Nortek Air Solutions · NTK-77413</strong>
            <span>Freight variance · $270.00</span>
          </div>
          {sent && (
            <>
              <div className="chat-bubble outgoing">
                Was the additional $270 freight charge agreed with Nortek?
                Please share the reason or supporting evidence.
              </div>
              <div className="chat-bubble incoming">
                Confirmed. The additional freight was approved for expedited
                delivery. I’ve attached the customer approval to the Sales record.
              </div>
            </>
          )}
        </div>
        {!sent ? (
          <div className="sales-compose">
            <textarea
              aria-label="Message to Sales"
              defaultValue="Was the additional $270 freight charge agreed with Nortek? Please share the reason or supporting evidence. If the PO needs updating, make the correction in the source system and let us know."
            />
            <button className="fin-primary" onClick={onSend}>
              Send in Teams
            </button>
          </div>
        ) : (
          <div className="sales-compose resolved">
            <span>Sales confirmation received</span>
            <button className="fin-primary" onClick={onResolve}>
              Apply confirmation
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function ReviewView({
  back,
  notify,
}: {
  back: () => void
  notify: (message: string) => void
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false)
  const [poQuery, setPoQuery] = useState("")
  const [poResults, setPoResults] = useState(false)
  const [linkedPo, setLinkedPo] = useState("4482210")
  const [referenceConfirmed, setReferenceConfirmed] = useState(false)
  const [salesOpen, setSalesOpen] = useState(false)
  const [salesSent, setSalesSent] = useState(false)
  const [freightResolved, setFreightResolved] = useState(false)

  const canApprove = referenceConfirmed && freightResolved

  useEffect(() => {
    if (!poResults) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPoResults(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [poResults])

  const lineItems = [
    {
      name: "Rooftop unit RTU-40",
      note: "Quantity and unit price match",
      invoice: "$7,700.00",
      invoiceQty: "2 × $3,850.00",
      po: "$7,700.00",
      poQty: "2 × $3,850.00",
      difference: "$0.00",
      matched: true,
    },
    {
      name: "Curb adapter kit",
      note: "Quantity and unit price match",
      invoice: "$940.50",
      invoiceQty: "1 × $940.50",
      po: "$940.50",
      poQty: "1 × $940.50",
      difference: "$0.00",
      matched: true,
    },
    {
      name: "Freight surcharge",
      note: freightResolved ? "Sales confirmation applied" : "Quantity matches · Charge differs",
      invoice: "$540.00",
      invoiceQty: "1 × $540.00",
      po: freightResolved ? "$540.00" : "$270.00",
      poQty: freightResolved ? "Approved exception" : "1 × $270.00",
      difference: freightResolved ? "$0.00" : "+$270.00",
      matched: freightResolved,
    },
  ]

  return (
    <div className="review-page">
      <header className="review-toolbar">
        <div>
          <button onClick={back}>
            <FIcon name="4311b.svg" size={16} />
            Work queue
          </button>
          <span>/</span>
          <h1>Invoice review</h1>
        </div>
        <div>
          <small>1 of 12 invoices</small>
          <button className="fin-secondary" disabled>
            Previous
          </button>
          <button className="fin-secondary">Next</button>
          <span className="reviewer-avatar">AR</span>
          <span>Alex Rivera</span>
        </div>
      </header>
      <section className="record-summary">
        <div>
          <span>
            <h2>Nortek Air Solutions</h2>
            <Status>Needs review</Status>
          </span>
          <small>Invoice NTK-77413 · Email intake · Finance owner: Alex Rivera</small>
        </div>
        <div className="financial-summary">
          <span>
            <small>Invoice total</small>
            <strong>$9,180.50</strong>
          </span>
          <span>
            <small>Linked PO total</small>
            <strong>{freightResolved ? "$9,180.50" : "$8,910.50"}</strong>
          </span>
          <span>
            <small>Difference</small>
            <strong className={freightResolved ? "resolved-amount" : "variance-amount"}>
              {freightResolved ? "$0.00" : "+$270.00"}
            </strong>
          </span>
          <span>
            <small>Due</small>
            <strong>Today</strong>
          </span>
        </div>
      </section>
      <div className="review-scroll">
        <div className="review-workbench">
          <main className="match-console">
            <header className="match-console-header">
              <div>
                <span className="match-score">
                  <strong>{canApprove ? "4/4" : `${2 + Number(referenceConfirmed) + Number(freightResolved)}/4`}</strong>
                  checks passed
                </span>
                <span className="match-progress">
                  {[true, true, referenceConfirmed, freightResolved].map((complete, index) => (
                    <i className={complete ? "complete" : ""} key={index} />
                  ))}
                </span>
              </div>
              <label className="difference-toggle">
                Show differences only
                <input
                  checked={differencesOnly}
                  onChange={(event) => setDifferencesOnly(event.target.checked)}
                  type="checkbox"
                />
                <img
                  alt=""
                  height={20}
                  src={asset(differencesOnly ? "e2b5f.svg" : "b370e.svg")}
                  width={36}
                />
              </label>
            </header>
            <section className="linked-po-bar">
              <span className="linked-po-ai">
                <FIcon name="7e9bc.svg" size={18} />
              </span>
              <span>
                <small>Linked purchase order</small>
                <strong>PO {linkedPo}</strong>
              </span>
              <span className="confidence-chip">98% match</span>
              <Status>Linked</Status>
              <button className="fin-secondary" onClick={() => setPoResults(!poResults)}>
                Change PO
              </button>
            </section>
            {poResults && (
              <>
                <button
                  aria-label="Close purchase order selector"
                  className="po-finder-dismiss"
                  onClick={() => setPoResults(false)}
                />
                <div aria-label="Select a purchase order" className="po-finder" role="dialog">
                  <div className="po-finder-header">
                    <span>
                      <strong>Select purchase order</strong>
                      <small>3 suggested matches</small>
                    </span>
                    <button
                      aria-label="Close purchase order selector"
                      onClick={() => setPoResults(false)}
                    >
                      ×
                    </button>
                  </div>
                  <label className="fin-search">
                    <FIcon name="79676.svg" size={20} />
                    <input
                      aria-label="Search purchase orders"
                      autoFocus
                      onChange={(event) => setPoQuery(event.target.value)}
                      placeholder="Search PO number or vendor"
                      value={poQuery}
                    />
                  </label>
                  <div className="po-results">
                    {["4482210", "4482201", "4481942"]
                      .filter((po) => !poQuery || po.includes(poQuery))
                      .map((po, index) => (
                        <button
                          key={po}
                          onClick={() => {
                            setLinkedPo(po)
                            setPoResults(false)
                            notify(`PO ${po} linked`)
                          }}
                        >
                          <span>
                            <strong>PO {po}</strong>
                            <small>
                              Nortek Air Solutions · {index === 0 ? "98%" : "74%"} match
                            </small>
                          </span>
                          <span>{po === linkedPo ? "Linked" : "Select"}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
            <section className="visual-compare">
              <div className="visual-compare-head">
                <span>What we’re matching</span>
                <span>
                  <small>INVOICE</small>
                  NTK-77413
                </span>
                <span>
                  <small>PURCHASE ORDER</small>
                  {linkedPo}
                </span>
                <span>Variance</span>
              </div>
              {!differencesOnly && (
                <div className="visual-compare-row matched">
                  <span className="compare-label">
                    <i />
                    <span>
                      <strong>Vendor</strong>
                      <small>Supplier identity</small>
                    </span>
                  </span>
                  <span>Nortek Air Solutions</span>
                  <span>Nortek Air Solutions</span>
                  <span className="zero-difference">Matched</span>
                </div>
              )}
              <div className={`visual-compare-row ${referenceConfirmed ? "matched" : "attention"}`}>
                <span className="compare-label">
                  <i />
                  <span>
                    <strong>PO reference</strong>
                    <small>Header reference</small>
                  </span>
                </span>
                <span className="compare-value">4482201</span>
                <span className="compare-value">{linkedPo}</span>
                <span className={referenceConfirmed ? "zero-difference" : "reference-difference"}>
                  {referenceConfirmed ? "Confirmed" : "Mismatch"}
                </span>
              </div>
              {lineItems
                .filter((item) => !differencesOnly || !item.matched)
                .map((item) => (
                  <div
                    className={`visual-compare-row ${item.matched ? "matched" : "attention"}`}
                    key={item.name}
                  >
                    <span className="compare-label">
                      <i />
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.note}</small>
                      </span>
                    </span>
                    <span className="compare-money">
                      <strong>{item.invoice}</strong>
                      <small>{item.invoiceQty}</small>
                    </span>
                    <span className="compare-money">
                      <strong>{item.po}</strong>
                      <small>{item.poQty}</small>
                    </span>
                    <span className={item.matched ? "zero-difference" : "reference-difference"}>
                      {item.matched ? "Matched" : item.difference}
                    </span>
                  </div>
                ))}
              <div className="visual-compare-total">
                <strong>Total</strong>
                <strong>$9,180.50</strong>
                <strong>{freightResolved ? "$9,180.50" : "$8,910.50"}</strong>
                <strong className={freightResolved ? "zero-difference" : "reference-difference"}>
                  {freightResolved ? "$0.00" : "+$270.00"}
                </strong>
              </div>
            </section>
          </main>
          <aside className="resolution-rail">
            <section className="resolution-summary">
              <span className={canApprove ? "ready-ring complete" : "ready-ring"}>
                {canApprove ? "100%" : `${50 + Number(referenceConfirmed) * 25 + Number(freightResolved) * 25}%`}
              </span>
              <span>
                <strong>{canApprove ? "Ready to approve" : "Action required"}</strong>
                <small>
                  {canApprove ? "All checks completed" : `${2 - Number(referenceConfirmed) - Number(freightResolved)} issues remaining`}
                </small>
              </span>
              {!canApprove && <FIcon name="e0d08.svg" size={20} />}
            </section>
            <section className={`resolution-card ${referenceConfirmed ? "resolved" : ""}`}>
              <span className="resolution-number">{referenceConfirmed ? "✓" : "1"}</span>
              <div>
                <strong>Confirm PO reference</strong>
                <small>Invoice says 4482201; linked PO is {linkedPo}</small>
              </div>
              {!referenceConfirmed && (
                <button onClick={() => setReferenceConfirmed(true)}>Confirm match</button>
              )}
            </section>
            <section className={`resolution-card ${freightResolved ? "resolved" : ""}`}>
              <span className="resolution-number">{freightResolved ? "✓" : "2"}</span>
              <div>
                <strong>Resolve $270 freight variance</strong>
                <small>
                  {freightResolved ? "Sales approval applied" : "Owner confirmation required"}
                </small>
              </div>
              {!freightResolved && (
                <button onClick={() => setSalesOpen(true)}>
                  {salesSent ? "View Teams reply" : "Ask in Teams"}
                </button>
              )}
            </section>
            <EvidencePanel />
          </aside>
        </div>
      </div>
      <footer className="review-footer">
        <div>
          <FIcon name={canApprove ? "d1f1f.svg" : "0a7bd.svg"} size={20} />
          <span>
            <strong>
              {canApprove
                ? "All exceptions are resolved."
                : "Approval blocked until the exception is resolved."}
            </strong>
            <small>
              {canApprove
                ? "The invoice is ready for approval."
                : "Resolve the freight discrepancy and confirm the invoice PO reference before approval."}
            </small>
          </span>
        </div>
        <div>
          <button className="fin-secondary" onClick={back}>
            Save and close
          </button>
          <button
            className="fin-primary"
            disabled={!canApprove}
            onClick={() => notify("Invoice approved and removed from the queue")}
          >
            Approve invoice
          </button>
        </div>
      </footer>
      {salesOpen && (
        <TeamsSalesDialog
          close={() => setSalesOpen(false)}
          onResolve={() => {
            setFreightResolved(true)
            setSalesOpen(false)
            notify("Sales confirmation applied")
          }}
          onSend={() => setSalesSent(true)}
          sent={salesSent}
        />
      )}
    </div>
  )
}

export default function FinOps({
  detailOpen,
  notify,
  openDetail,
  closeDetail,
}: {
  detailOpen: boolean
  notify: (message: string) => void
  openDetail: () => void
  closeDetail: () => void
}) {
  return detailOpen ? (
    <ReviewView back={closeDetail} notify={notify} />
  ) : (
    <QueueView notify={notify} onOpenReview={openDetail} />
  )
}
