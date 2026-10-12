import type { ReactNode } from "react"
import {
  Bell,
  CalendarDays,
  FileText,
  LayoutGrid,
  Mail,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  ScrollText,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { OWNER } from "../data/scenario"
import { useInvoices, useMars, type View } from "../state/store"
import { Avatar, MarsMark } from "./ui"

function TeamsRail() {
  const items: [LucideIcon, string][] = [
    [Bell, "Activity"],
    [MessageCircle, "Chat"],
    [Users, "Teams"],
    [CalendarDays, "Calendar"],
  ]
  return (
    <aside aria-label="Microsoft Teams" className="teams-rail">
      {items.map(([Icon, label]) => (
        <button className="teams-rail-item" key={label}>
          <Icon size={20} strokeWidth={1.6} />
          <small>{label}</small>
        </button>
      ))}
      <button className="teams-rail-item active">
        <MarsMark size={22} />
        <small>MARS</small>
      </button>
      <span className="teams-rail-spacer" />
      <button className="teams-rail-item">
        <LayoutGrid size={20} strokeWidth={1.6} />
        <small>Apps</small>
      </button>
    </aside>
  )
}

function Sidebar() {
  const { state, go } = useMars()
  const invoices = useInvoices()
  const toReview = invoices.filter((item) => !["With Sales", "Approved"].includes(item.status)).length
  const replies = state.queries.filter((query) => query.reply && !query.applied).length

  const nav: { view: View; label: string; icon: LucideIcon; count?: number }[] = [
    { view: "inbox", label: "Inbox", icon: Mail },
    { view: "invoices", label: "Invoices", icon: FileText, count: toReview },
    { view: "queries", label: "Queries", icon: MessagesSquare, count: replies },
    { view: "audit", label: "Audit", icon: ScrollText },
  ]

  return (
    <aside aria-label="MARS" className="sidebar">
      <nav className="side-nav">
        {nav.map((item) => (
          <button
            aria-current={state.view === item.view ? "page" : undefined}
            className={state.view === item.view ? "active" : ""}
            key={item.view}
            onClick={() => go(item.view)}
          >
            <span className="side-icon">
              <item.icon size={19} strokeWidth={1.6} />
              {!!item.count && <span className="side-count">{item.count}</span>}
            </span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button className="side-utility">
          <span className="side-icon">
            <Settings size={19} strokeWidth={1.6} />
          </span>
          <small>Settings</small>
        </button>
        <span className="side-user" title={`${OWNER.name} · FinOps`}>
          <Avatar name={OWNER.name} size={28} />
        </span>
      </div>
    </aside>
  )
}

export default function Shell({ children }: { children: ReactNode }) {
  const { state } = useMars()
  return (
    <div className="teams-shell">
      <header className="teams-topbar">
        <div aria-hidden className="window-controls">
          <i />
          <i />
          <i />
        </div>
        <label className="teams-search">
          <Search size={14} strokeWidth={1.75} />
          <input aria-label="Search Microsoft Teams" placeholder="Search" />
        </label>
        <div className="teams-me">
          <button aria-label="More">
            <MoreHorizontal size={18} />
          </button>
          <Avatar name={OWNER.name} size={26} />
        </div>
      </header>
      <TeamsRail />
      <section className="teams-stage">
        <header className="teams-appbar">
          <MarsMark size={20} />
          <strong>MARS</strong>
          <nav>
            <button className="active">Home</button>
            <button>About</button>
          </nav>
        </header>
        <div className="mars">
          <Sidebar />
          <main className="mars-main">{children}</main>
        </div>
      </section>
      {state.toast && <div className="toast">{state.toast}</div>}
    </div>
  )
}
