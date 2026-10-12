import { useMemo, useState } from "react"
import { RotateCcw, X } from "lucide-react"
import { DEFAULT_TOLERANCE } from "../data/scenario"
import type { Tolerance } from "../data/types"
import { deriveInvoice, useMars } from "../state/store"
import { Button } from "./ui"

function NumberField({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string
  suffix: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="field number-field">
      <span>{label}</span>
      <span className="input-affix">
        {suffix === "$" && <i>$</i>}
        <input
          inputMode="decimal"
          min={0}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
          step={suffix === "%" ? 0.5 : 1}
          type="number"
          value={value}
        />
        {suffix === "%" && <i>%</i>}
      </span>
    </label>
  )
}

function Switch({
  checked,
  onChange,
  title,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  children: string
}) {
  return (
    <label className="setting-switch">
      <span className="cell-stack">
        <strong>{title}</strong>
        <small>{children}</small>
      </span>
      <span className="toggle">
        <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
        <i />
      </span>
    </label>
  )
}

export default function SettingsPanel() {
  const { state, setTolerance, openPanel, notify } = useMars()
  const [draft, setDraft] = useState<Tolerance>(state.tolerance)
  const set = (patch: Partial<Tolerance>) => setDraft((current) => ({ ...current, ...patch }))

  // Show what the rules would do to today's queue before they're saved.
  const preview = useMemo(() => {
    const open = state.queued.filter((id) => !state.approved[id])
    const count = (tolerance: Tolerance) =>
      open.filter((id) => deriveInvoice({ ...state, tolerance }, id).status === "Ready to approve").length
    return { before: count(state.tolerance), after: count(draft), open: open.length }
  }, [draft, state])

  const changed = JSON.stringify(draft) !== JSON.stringify(state.tolerance)
  const close = () => openPanel(null)

  return (
    <>
      <button aria-label="Close settings" className="scrim" onClick={close} />
      <aside aria-label="Matching rules" className="drawer">
        <header className="drawer-head">
          <span className="cell-stack">
            <strong>Matching rules</strong>
            <small>How MARS decides what needs review</small>
          </span>
          <Button aria-label="Close" icon={X} onClick={close} size="sm" variant="ghost" />
        </header>
        <div className="drawer-body settings-body">
          <section className="settings-group">
            <h3>Line tolerance</h3>
            <p>Each invoice line may differ from its PO line by whichever is larger.</p>
            <div className="field-row">
              <NumberField label="Percent" onChange={(linePct) => set({ linePct })} suffix="%" value={draft.linePct} />
              <NumberField label="Amount" onChange={(lineAbs) => set({ lineAbs })} suffix="$" value={draft.lineAbs} />
            </div>
          </section>
          <section className="settings-group">
            <h3>Invoice total tolerance</h3>
            <p>The invoice subtotal may differ from the PO by whichever is larger.</p>
            <div className="field-row">
              <NumberField label="Percent" onChange={(totalPct) => set({ totalPct })} suffix="%" value={draft.totalPct} />
              <NumberField label="Amount" onChange={(totalAbs) => set({ totalAbs })} suffix="$" value={draft.totalAbs} />
            </div>
          </section>
          <section className="settings-group">
            <h3>Controls</h3>
            <Switch checked={draft.block} onChange={(block) => set({ block })} title="Block approval over tolerance">
              Off, differences above tolerance show as warnings and the invoice can still be approved.
            </Switch>
            <Switch checked={draft.threeWay} onChange={(threeWay) => set({ threeWay })} title="Require 3-way match for goods">
              Billed units must appear on a goods receipt. Services are always matched 2-way.
            </Switch>
          </section>
          <div className={`settings-preview ${changed ? "changed" : ""}`}>
            <strong>
              {preview.after} of {preview.open} open invoices ready to approve
            </strong>
            <small>
              {changed
                ? preview.after === preview.before
                  ? "No change to today's queue."
                  : `${preview.after > preview.before ? "+" : ""}${preview.after - preview.before} compared with the current rules.`
                : "With the current rules."}
            </small>
          </div>
        </div>
        <footer className="drawer-foot">
          <Button icon={RotateCcw} onClick={() => setDraft(DEFAULT_TOLERANCE)} variant="ghost">
            Defaults
          </Button>
          <Button onClick={close}>Cancel</Button>
          <Button
            disabled={!changed}
            onClick={() => {
              setTolerance(draft)
              notify("Matching rules saved")
              close()
            }}
            variant="primary"
          >
            Save rules
          </Button>
        </footer>
      </aside>
    </>
  )
}
