import { useMemo, useState } from "react"

const asset = (name: string) => `/assets/${name}`

type Mail = {
  id: number
  sender: string
  count?: number
  subject: string
  preview: string
  time: string
  unread?: boolean
  saved?: boolean
  attachments?: number
}

const initialMail: Mail[] = [
  {
    id: 1,
    sender: "Maya Chen",
    count: 3,
    subject: "Northstar · Enterprise renewal",
    preview: "The revised terms look good. Can we…",
    time: "10:42 AM",
    unread: true,
    saved: true,
    attachments: 2,
  },
  {
    id: 2,
    sender: "Alex Rivera",
    subject: "Invoice INV-10482",
    preview: "SSO is live for all 48 team members.",
    time: "10:18 AM",
    unread: true,
    attachments: 1,
  },
  {
    id: 3,
    sender: "Emma Wilson",
    subject: "Feedback on the new dashboard",
    preview: "Our team loves the saved views. One idea…",
    time: "8:47 AM",
    saved: true,
  },
  {
    id: 4,
    sender: "Daniel Kim",
    subject: "Q4 rollout · next steps",
    preview: "Sharing the timeline ahead of our call.",
    time: "8:12 AM",
  },
  {
    id: 5,
    sender: "Liam Brooks",
    subject: "API integration check-in",
    preview: "The webhook events are coming through.",
    time: "Yesterday",
  },
  {
    id: 6,
    sender: "Nina Patel",
    subject: "Customer council · October",
    preview: "We’d love to hear what you’re building.",
    time: "Yesterday",
  },
]

const files = [
  { name: "TR-48291.pdf", details: "4 pages  ·  286 KB" },
  { name: "TR-48292.pdf", details: "2 pages  ·  164 KB" },
]

function Icon({
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

function PlanetMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`planet-mark ${compact ? "planet-mark-compact" : ""}`}
    >
      <i />
    </span>
  )
}

function TeamsRail() {
  return (
    <aside aria-label="Microsoft Teams navigation" className="teams-rail">
      <button aria-label="Activity" className="teams-rail-item">
        <span className="rail-glyph rail-activity" />
        <small>Activity</small>
      </button>
      <button aria-label="Chat" className="teams-rail-item">
        <span className="rail-glyph rail-chat" />
        <small>Chat</small>
      </button>
      <button aria-label="Teams" className="teams-rail-item">
        <span className="rail-glyph rail-people" />
        <small>Teams</small>
      </button>
      <button aria-label="Calendar" className="teams-rail-item">
        <span className="rail-glyph rail-calendar" />
        <small>Calendar</small>
      </button>
      <button aria-label="MARS" className="teams-rail-item active">
        <PlanetMark compact />
        <small>MARS</small>
      </button>
      <span className="teams-rail-spacer" />
      <button aria-label="Apps" className="teams-rail-item">
        <span className="rail-glyph rail-apps" />
        <small>Apps</small>
      </button>
    </aside>
  )
}

function ProductNav() {
  return (
    <aside aria-label="MARS navigation" className="product-nav">
      <div className="product-brand">
        <PlanetMark />
        <span>
          <strong>MARS</strong>
          <small>Meriton Agentic Reconciliation System</small>
        </span>
      </div>
      <button className="organization-switcher">
        <span className="organization-mark">M</span>
        <span>Meriton</span>
        <span className="nav-chevron">⌄</span>
      </button>
      <nav aria-label="Workspace">
        <small className="nav-label">WORKSPACE</small>
        <button aria-current="page" className="product-nav-item active">
          <span className="nav-icon">
            <Icon name="9fca5.svg" size={18} />
          </span>
          <span>
            <strong>Inbox</strong>
            <small>Email intake</small>
          </span>
          <i>6</i>
        </button>
      </nav>
      <div className="product-nav-footer">
        <button className="product-nav-item utility">
          <span className="settings-glyph" />
          <span>
            <strong>Settings</strong>
            <small>Workspace preferences</small>
          </span>
        </button>
        <button className="account-switcher">
          <span className="account-avatar">AP</span>
          <span>
            <strong>Accounts Payable</strong>
            <small>Meriton</small>
          </span>
          <span className="nav-chevron">⌄</span>
        </button>
      </div>
    </aside>
  )
}

function PdfBadge() {
  return (
    <span className="pdf-badge">
      <Icon name="790e9.svg" size={20} />
      <span>PDF</span>
    </span>
  )
}

function InvoicePreview() {
  return (
    <div className="invoice-sheet">
      <div className="invoice-sheet-header">
        <div className="invoice-brand-row">
          <div className="invoice-brand">
            <span className="brand-mark">T</span>
            <span>
              <strong>TRANE BILLING</strong>
              <small>Dallas branch · October 2026</small>
            </span>
          </div>
          <span className="pill pill-orange">INVOICE</span>
        </div>
        <div className="invoice-meta">
          <span>
            <small>Invoice number</small>
            <strong>TR-48291</strong>
          </span>
          <span>
            <small>Invoice date</small>
            <strong>08 Oct 2026</strong>
          </span>
          <span>
            <small>Due date</small>
            <strong>22 Oct 2026</strong>
          </span>
        </div>
      </div>
      <div className="invoice-sheet-body">
        <div className="bill-to">
          <strong>Bill to</strong>
          <span>
            Meriton Accounts Payable 1200 Main Street, Suite 400 Dallas, TX
            75202
          </span>
        </div>
        <div className="invoice-table">
          <div className="invoice-row invoice-table-head">
            <span>Description</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
          </div>
          {[
            ["HVAC maintenance · Dallas branch", "1", "$1,250.00", "$1,250.00"],
            ["Filter replacement · 4 units", "4", "$85.00", "$340.00"],
            ["Emergency service call", "1", "$195.00", "$195.00"],
          ].map((row) => (
            <div className="invoice-row" key={row[0]}>
              {row.map((cell, index) => (
                <span className={index === 3 ? "amount" : ""} key={cell}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="totals">
          <span>
            <small>Subtotal</small>
            <span>$1,785.00</span>
          </span>
          <span>
            <small>Tax</small>
            <span>$178.50</span>
          </span>
          <span>
            <small>Total</small>
            <strong>$1,963.50</strong>
          </span>
        </div>
        <div className="payment-note">
          Payment is due within 14 days. ACH and credit card are accepted.
        </div>
      </div>
    </div>
  )
}

function AttachmentDrawer({ close }: { close: () => void }) {
  return (
    <>
      <button
        aria-label="Close attachment preview"
        className="scrim"
        onClick={close}
      />
      <aside aria-label="Attachment preview" className="drawer">
        <div className="drawer-header">
          <div className="drawer-title-row">
            <div>
              <h2>Preview attachment</h2>
              <p>TR-48291.pdf · 4 pages</p>
            </div>
            <button
              aria-label="Close preview"
              className="icon-button"
              onClick={close}
            >
              <Icon name="fab07.svg" size={16} />
            </button>
          </div>
          <div className="pills">
            <span className="pill pill-orange">PDF</span>
            <span className="pill">286 KB</span>
            <span className="pill">Dallas branch</span>
          </div>
        </div>
        <div className="drawer-canvas">
          <InvoicePreview />
        </div>
      </aside>
    </>
  )
}

function Mailbox({
  mail,
  selected,
  setSelected,
}: {
  mail: Mail[]
  selected: number
  setSelected: (id: number) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"All mail" | "Unread" | "Saved">(
    "All mail",
  )
  const [newest, setNewest] = useState(true)
  const [sortOpen, setSortOpen] = useState(false)
  const [saved, setSaved] = useState(
    () => new Set(mail.filter((item) => item.saved).map((item) => item.id)),
  )

  const visibleMail = useMemo(() => {
    const normalized = query.toLowerCase()
    const filtered = mail.filter((item) => {
      const matchesSearch = `${item.sender} ${item.subject}`
        .toLowerCase()
        .includes(normalized)
      const matchesFilter =
        filter === "All mail" ||
        (filter === "Unread" && item.unread) ||
        (filter === "Saved" && saved.has(item.id))
      return matchesSearch && matchesFilter
    })
    return newest ? filtered : [...filtered].reverse()
  }, [filter, mail, newest, query, saved])

  const toggleSaved = (id: number) => {
    setSaved((current) => {
      const next = new Set(current)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <aside className="mailbox">
      <div className="mailbox-controls">
        <div className="search-sort">
          <label className="search-field">
            <Icon name="e324f.svg" size={20} />
            <input
              aria-label="Search sender or subject"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sender or subject"
              value={query}
            />
          </label>
          <div className="sort-wrap">
            <button
              className="secondary-button sort-button"
              onClick={() => setSortOpen(!sortOpen)}
            >
              {newest ? "Newest first" : "Oldest first"}
              <Icon name="7c11a.svg" size={20} />
            </button>
            {sortOpen && (
              <div className="menu sort-menu">
                {["Newest first", "Oldest first"].map((label) => (
                  <button
                    className={
                      newest === (label === "Newest first")
                        ? "selected-option"
                        : ""
                    }
                    key={label}
                    onClick={() => {
                      setNewest(label === "Newest first")
                      setSortOpen(false)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="filters" role="tablist">
          {[
            ["All mail", 6],
            ["Unread", 2],
            ["Saved", saved.size],
          ].map(([name, count]) => (
            <button
              className={filter === name ? "active" : ""}
              key={name}
              onClick={() => setFilter(name as typeof filter)}
              role="tab"
            >
              {name} <span>{count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mail-list">
        {visibleMail.map((item) => (
          <button
            className={`mail-row ${selected === item.id ? "selected" : ""}`}
            key={item.id}
            onClick={() => setSelected(item.id)}
          >
            <span className="mail-topline">
              <span className="sender">
                {item.unread && <i />}
                {item.sender}
                {item.count && `  ·  ${item.count}`}
              </span>
              <span className={item.unread ? "orange-time" : ""}>
                {item.time}
              </span>
              <span
                aria-label={saved.has(item.id) ? "Remove from saved" : "Save"}
                className="star-control"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleSaved(item.id)
                }}
                role="button"
                tabIndex={0}
              >
                <Icon
                  name={saved.has(item.id) ? "adccc.svg" : "bbbac.svg"}
                  size={13}
                />
              </span>
            </span>
            <strong className={item.unread ? "unread-subject" : ""}>
              {item.subject}
            </strong>
            <span className="mail-preview">
              <span>{item.preview}</span>
              {!!item.attachments && (
                <span className="attachment-count">
                  <Icon name="c758f.svg" size={14} />
                  {item.attachments}
                </span>
              )}
            </span>
          </button>
        ))}
        {!visibleMail.length && (
          <p className="empty-state">No conversations found.</p>
        )}
      </div>
      <div className="pagination">
        <span>1–9 of 128 conversations</span>
        <span>
          <button aria-label="Previous page">
            <Icon name="bb26a.svg" size={14} />
          </button>
          <button aria-label="Next page">
            <Icon name="73734.svg" size={14} />
          </button>
        </span>
      </div>
    </aside>
  )
}

function Detail({
  selectedMail,
  openPreview,
  notify,
}: {
  selectedMail: Mail
  openPreview: () => void
  notify: (message: string) => void
}) {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [moreOpen, setMoreOpen] = useState(false)

  const toggleFile = (index: number) =>
    setSelectedFiles((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )

  const isPrimary = selectedMail.id === 1

  return (
    <main className="detail">
      <div className="email-heading">
        <div className="subject-row">
          <h1>
            {isPrimary
              ? "October invoices · Dallas branch"
              : selectedMail.subject}
          </h1>
          <span className="review-status">
            <i />
            Ready for review
          </span>
          <div className="more-wrap">
            <button
              aria-label="Email actions"
              className="bare-icon-button"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <Icon name="5cc03.svg" size={18} />
            </button>
            {moreOpen && (
              <div className="menu action-menu">
                <button onClick={() => notify("Conversation marked unread")}>
                  Mark unread
                </button>
                <button onClick={() => notify("Conversation archived")}>
                  Archive
                </button>
                <button onClick={() => notify("Link copied")}>Copy link</button>
              </div>
            )}
          </div>
        </div>
        <div className="metadata">
          <span>
            <small>From</small>
            <span>
              {isPrimary
                ? "Trane Billing <billing@trane.example>"
                : selectedMail.sender}
            </span>
          </span>
          <span>
            <small>To</small>
            <span>invoices@meriton.com</span>
          </span>
          <span>
            <small>Received</small>
            <span>8 Oct 2026, 10:24 AM</span>
          </span>
        </div>
      </div>
      <div className="email-body">
        <p>Hi team,</p>
        <p>
          {isPrimary
            ? "Please find the two October invoices attached for the Dallas branch."
            : selectedMail.preview}
        </p>
        <p>
          Thank you,
          <br />
          {isPrimary ? "Trane Billing" : selectedMail.sender}
        </p>
      </div>
      <section className="attachments-section">
        <div className="section-heading">
          <span>
            <h2>Attachments</h2>
            <small>
              {isPrimary ? "2 files" : `${selectedMail.attachments ?? 0} files`}
            </small>
          </span>
          <button
            className="primary-button"
            onClick={() =>
              notify(
                selectedFiles.length
                  ? `${selectedFiles.length} attachment${
                      selectedFiles.length > 1 ? "s" : ""
                    } added to queue`
                  : "2 attachments added to queue",
              )
            }
          >
            Add to Queue
          </button>
        </div>
        <div className="attachment-list">
          {files.map((file, index) => (
            <div className="attachment-row" key={file.name}>
              <button
                aria-label={`${
                  selectedFiles.includes(index) ? "Deselect" : "Select"
                } ${file.name}`}
                className={`checkbox ${
                  selectedFiles.includes(index) ? "checked" : ""
                }`}
                onClick={() => toggleFile(index)}
              >
                {selectedFiles.includes(index) && "✓"}
              </button>
              <button className="file-main" onClick={openPreview}>
                <PdfBadge />
                <span className="file-details">
                  <strong>{file.name}</strong>
                  <small>{file.details}</small>
                </span>
              </button>
              <span className="file-divider" />
              <button
                aria-label={`Actions for ${file.name}`}
                className="bare-icon-button"
              >
                <Icon name="4f232.svg" size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="activity-section">
        <h2>Intake activity</h2>
        <div className="timeline">
          {[
            [
              "Email received",
              "From Trane Billing <billing@trane.example>",
              "8 Oct 2026, 10:24:02 AM",
            ],
            [
              "TR-48291.pdf saved",
              "4 pages  ·  286 KB",
              "8 Oct 2026, 10:24:04 AM",
            ],
            [
              "TR-48292.pdf saved",
              "4 pages  ·  226 KB",
              "8 Oct 2026, 10:24:04 AM",
            ],
          ].map((event, index) => (
            <div className="event" key={event[0]}>
              <span className="marker">
                <span>
                  <Icon name="f6fe7.svg" size={15} />
                </span>
                {index < 2 && <i />}
              </span>
              <span className="event-copy">
                <span>
                  <strong>{event[0]}</strong>
                  <time>{event[2]}</time>
                </span>
                <small>{event[1]}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [selected, setSelected] = useState(1)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [toast, setToast] = useState("")
  const selectedMail =
    initialMail.find((item) => item.id === selected) ?? initialMail[0]

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2600)
  }

  const sync = () => {
    if (syncing) return
    setSyncing(true)
    window.setTimeout(() => {
      setSyncing(false)
      notify("Mailbox is up to date")
    }, 900)
  }

  return (
    <div className="teams-shell">
      <header className="teams-topbar">
        <div aria-hidden="true" className="window-controls">
          <i />
          <i />
          <i />
        </div>
        <div aria-hidden="true" className="teams-history">
          <span>‹</span>
          <span>›</span>
        </div>
        <label className="teams-search">
          <Icon name="e324f.svg" size={16} />
          <input aria-label="Search Microsoft Teams" placeholder="Search" />
          <kbd>Ctrl E</kbd>
        </label>
        <div className="teams-profile">
          <button aria-label="More Teams options">•••</button>
          <span>AP</span>
        </div>
      </header>
      <TeamsRail />
      <section className="teams-stage">
        <header className="teams-appbar">
          <span className="teams-app-identity">
            <PlanetMark compact />
            <strong>MARS</strong>
          </span>
          <nav aria-label="MARS tabs">
            <button className="active">MARS</button>
          </nav>
          <button aria-label="More MARS options" className="teams-app-more">
            •••
          </button>
        </header>
        <div className="mars-layout">
          <ProductNav />
          <div className="app-shell">
            <header className="toolbar">
              <div className="mailbox-identity">
                <span className="page-title">
                  <small>EMAIL INTAKE</small>
                  <strong>Inbox</strong>
                </span>
                <span className="vertical-divider" />
                <span className="connection-details">
                  <span>
                    Mailbox connected
                    <Icon name="d2eff.svg" size={8} />
                  </span>
                  <small>invoices@meriton.com</small>
                </span>
              </div>
              <div className="sync-block">
                <button className="secondary-button" onClick={sync}>
                  <span className={syncing ? "spin" : ""}>
                    <Icon name="1538a.svg" size={20} />
                  </span>
                  {syncing ? "Syncing…" : "Sync mailbox"}
                </button>
                <small>Last sync: 8 Oct 2026, 10:24 AM</small>
              </div>
            </header>
            <div className="workspace">
              <Mailbox
                mail={initialMail}
                selected={selected}
                setSelected={setSelected}
              />
              <Detail
                notify={notify}
                openPreview={() => setPreviewOpen(true)}
                selectedMail={selectedMail}
              />
            </div>
            {previewOpen && (
              <AttachmentDrawer close={() => setPreviewOpen(false)} />
            )}
            {toast && <div className="toast">{toast}</div>}
          </div>
        </div>
      </section>
    </div>
  )
}
