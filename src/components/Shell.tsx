import type { ReactNode } from "react"
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FileText,
  Mail,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  PanelLeft,
  Phone,
  Plus,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  UserCog,
  type LucideIcon,
} from "lucide-react"
import { OWNER } from "../data/scenario"
import { useInvoices, useMars, type View } from "../state/store"
import SettingsPanel from "./SettingsPanel"
import { Avatar, MarsMark } from "./ui"
import UploadPanel from "./UploadPanel"

// New Teams (2025): icon-only rail, app pinned with a purple indicator.
function TeamsRail() {
  const top: [LucideIcon, string][] = [
    [Bell, "Activity"],
    [MessageCircle, "Chat"],
    [Calendar, "Calendar"],
    [Phone, "Calls"],
    [Cloud, "OneDrive"],
    [Sparkles, "Copilot"],
  ]
  return (
    <aside aria-label="Microsoft Teams" className="teams-rail">
      {top.map(([Icon, label]) => (
        <button aria-label={label} className="teams-rail-item" key={label} title={label}>
          <Icon size={22} strokeWidth={1.5} />
        </button>
      ))}
      <button aria-label="MARS" className="teams-rail-item active" title="MARS">
        <MarsMark size={24} />
      </button>
      <button aria-label="Apps" className="teams-rail-item" title="Apps">
        <Plus size={22} strokeWidth={1.5} />
      </button>
      <button aria-label="More apps" className="teams-rail-item" title="More apps">
        <MoreHorizontal size={22} strokeWidth={1.5} />
      </button>
      <span className="teams-rail-spacer" />
      <button aria-label="Admin" className="teams-rail-item" title="Admin">
        <UserCog size={22} strokeWidth={1.5} />
      </button>
    </aside>
  )
}

function Sidebar() {
  const { state, go, openPanel } = useMars()
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
        <button className={`side-utility ${state.panel === "settings" ? "active" : ""}`} onClick={() => openPanel("settings")}>
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
        <div className="topbar-left">
          <div aria-hidden className="window-controls">
            <i />
            <i />
            <i />
          </div>
          <button aria-label="Toggle sidebar" className="topbar-icon">
            <PanelLeft size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="topbar-center">
          <button aria-label="Back" className="topbar-icon">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Forward" className="topbar-icon dim">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
          <label className="teams-search">
            <Search size={16} strokeWidth={1.75} />
            <input aria-label="Search Microsoft Teams" placeholder="Search (⌘ E)" />
          </label>
        </div>
        <div className="teams-me">
          <button className="teams-update">
            Update <MoreHorizontal size={16} />
          </button>
          <span className="presence">
            <Avatar name={OWNER.name} size={30} />
            <i />
          </span>
        </div>
      </header>
      <TeamsRail />
      <section className="teams-stage">
        <header className="teams-appbar">
          <span className="app-tile">
            <MarsMark size={22} />
          </span>
          <strong>MARS</strong>
          <nav>
            <button className="active">MARS</button>
            <button>Chat</button>
          </nav>
          <button aria-label="More options" className="appbar-more">
            <MoreHorizontal size={18} />
          </button>
        </header>
        <div className="mars">
          <Sidebar />
          <main className="mars-main">{children}</main>
        </div>
      </section>
      {state.panel === "settings" && <SettingsPanel />}
      {state.panel === "upload" && <UploadPanel />}
      {state.toast && <div className="toast">{state.toast}</div>}
    </div>
  )
}
