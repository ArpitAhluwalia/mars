import type { ButtonHTMLAttributes, ReactNode } from "react"
import {
  Check,
  CheckCheck,
  CircleDashed,
  CircleSlash,
  FileQuestion,
  MessageSquareReply,
  MessagesSquare,
  Search,
  type LucideIcon,
} from "lucide-react"
import type { InvoiceStatus } from "../data/types"

export type Tone = "neutral" | "success" | "warn" | "danger" | "sales" | "accent"

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark"
  size?: "sm" | "md"
  icon?: LucideIcon
  iconRight?: LucideIcon
}) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} type="button" {...props}>
      {Icon && <Icon aria-hidden size={size === "sm" ? 14 : 16} strokeWidth={1.75} />}
      {children}
      {IconRight && <IconRight aria-hidden size={size === "sm" ? 14 : 16} strokeWidth={1.75} />}
    </button>
  )
}

export function Pill({ tone = "neutral", icon: Icon, children }: { tone?: Tone; icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={`pill pill-${tone}`}>
      {Icon && <Icon aria-hidden size={13} strokeWidth={2} />}
      {children}
    </span>
  )
}

export const statusMeta: Record<InvoiceStatus, { tone: Tone; icon: LucideIcon }> = {
  "Missing PO": { tone: "danger", icon: FileQuestion },
  "Confirm PO": { tone: "warn", icon: CircleDashed },
  "Needs review": { tone: "warn", icon: CircleDashed },
  "Correction requested": { tone: "danger", icon: CircleSlash },
  "With Sales": { tone: "sales", icon: MessagesSquare },
  "Sales replied": { tone: "sales", icon: MessageSquareReply },
  "Ready to approve": { tone: "neutral", icon: Check },
  Approved: { tone: "success", icon: CheckCheck },
}

export function StatusPill({ status }: { status: InvoiceStatus }) {
  const meta = statusMeta[status]
  return (
    <Pill icon={meta.icon} tone={meta.tone}>
      {status}
    </Pill>
  )
}

const avatarPalette = [
  ["#ece4f2", "#664a80"],
  ["#e2eee6", "#3d6a4c"],
  ["#f4e8dc", "#86562a"],
  ["#e2eaf4", "#3c5d84"],
  ["#f3e3e1", "#8a4038"],
  ["#eae8df", "#5d5a48"],
]

export const initials = (name: string) =>
  name
    .replace(/[^A-Za-z& ]/g, " ")
    .split(/\s+/)
    .filter((word) => word && word !== "&" && word.toLowerCase() !== "and")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("")

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const [bg, fg] = avatarPalette[hash % avatarPalette.length]
  return (
    <span
      aria-hidden
      className="avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  )
}

export function MarsMark({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden height={size} viewBox="0 0 86 86" width={size}>
      <ellipse cx="43" cy="50" fill="none" rx="38" ry="12" stroke="#c9c5bd" strokeWidth="5" transform="rotate(-16 43 50)" />
      <circle cx="43" cy="43" fill="#f2531b" r="26" />
      <circle cx="33" cy="36" fill="#d64500" opacity=".6" r="5" />
      <circle cx="52" cy="52" fill="#d64500" opacity=".5" r="3.6" />
      <path d="M 12 54 A 38 12 -16 0 0 74 40" fill="none" stroke="#3f3d39" strokeWidth="5" />
    </svg>
  )
}

export function MarsAvatar({ size = 28 }: { size?: number }) {
  return (
    <span className="mars-avatar" style={{ width: size, height: size }}>
      <MarsMark size={size * 0.72} />
    </span>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={value === tab.id}
          className={value === tab.id ? "active" : ""}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
          {tab.count !== undefined && <span className="tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoFocus?: boolean
}) {
  return (
    <label className="search-field">
      <Search aria-hidden size={15} strokeWidth={1.75} />
      <input
        aria-label={placeholder}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  )
}

export function Checkbox({
  checked,
  indeterminate,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      className={`checkbox ${checked ? "checked" : ""} ${indeterminate ? "mixed" : ""}`}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onChange()
      }}
      role="checkbox"
      type="button"
    >
      {checked && !indeterminate && <Check size={12} strokeWidth={3} />}
      {indeterminate && <span className="checkbox-dash" />}
    </button>
  )
}

export function Section({
  title,
  aside,
  children,
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="section">
      <header className="section-head">
        <h2>{title}</h2>
        {aside && <div className="section-aside">{aside}</div>}
      </header>
      {children}
    </section>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  )
}
