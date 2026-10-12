import { purchaseOrders } from "./source"
import type { LineCheck, LineItem, OcrInvoice, PurchaseOrder } from "./types"

// Tolerance bands from the dev build: a line passes within ±2% or $5,
// the invoice total within ±1% or $25.
const LINE_BAND = { pct: 0.02, abs: 5 }
const TOTAL_BAND = { pct: 0.01, abs: 25 }

export const money = (value: number | null | undefined, signed = false) => {
  if (value === null || value === undefined) return "—"
  const text = Math.abs(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
  if (!signed) return value < 0 ? `-${text}` : text
  return value > 0 ? `+${text}` : value < 0 ? `-${text}` : text
}

// Some POs carry the "PO-" prefix in the source data and some don't.
export const poLabel = (po: string) => (/^PO/i.test(po) ? po : `PO ${po}`)

export const shortDate = (iso: string | null | undefined) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"

export const qty = (value: number | null) =>
  value === null ? "—" : Number.isInteger(value) ? String(value) : value.toFixed(2)

export const normPo = (po: string | null | undefined) =>
  String(po ?? "").toUpperCase().replace(/^PO[-\s]*/, "").trim()

const normText = (text: string) =>
  text.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim()

const lineAmount = (line: LineItem) =>
  line.lineTotal ?? (line.quantity ?? 0) * (line.unitPrice ?? 0)

const withinBand = (a: number, b: number, band: { pct: number; abs: number }) =>
  Math.abs(a - b) <= Math.max(band.abs, Math.abs(b) * band.pct)

export const poByNumber = (po: string | null | undefined) =>
  purchaseOrders.find((item) => normPo(item.poNumber) === normPo(po)) ?? null

const tokens = (text: string) => new Set(normText(text).split(" ").filter(Boolean))

function similarity(a: string, b: string) {
  const left = tokens(a)
  const right = tokens(b)
  if (!left.size || !right.size) return 0
  let shared = 0
  left.forEach((token) => right.has(token) && shared++)
  return shared / Math.max(left.size, right.size)
}

// Lines are paired by description, never by position on the page.
function pairLine(line: LineItem, poLines: LineItem[], used: Set<number>) {
  let best = -1
  let bestScore = 0
  poLines.forEach((candidate, index) => {
    if (used.has(index)) return
    const score =
      normText(candidate.description) === normText(line.description)
        ? 1
        : similarity(candidate.description, line.description)
    if (score > bestScore) {
      best = index
      bestScore = score
    }
  })
  if (bestScore < 0.6) return null
  used.add(best)
  return poLines[best]
}

export function checkLines(invoice: OcrInvoice, po: PurchaseOrder | null): LineCheck[] {
  const used = new Set<number>()
  return invoice.lines.map((line, index) => {
    const key = `${index}`
    const matched = po ? pairLine(line, po.lines, used) : null
    if (!matched) {
      return {
        key,
        description: line.description,
        invoice: line,
        po: null,
        verdict: "not-on-po",
        exact: false,
        difference: lineAmount(line),
      }
    }
    // A standing order is drawn down over many invoices, so only price is
    // compared line by line; the balance check covers quantity.
    const quantityOff = !po?.standing && (line.quantity ?? 0) !== (matched.quantity ?? 0)
    const priceOff = !withinBand(line.unitPrice ?? 0, matched.unitPrice ?? 0, LINE_BAND)
    const billed = lineAmount(line)
    const expected = po?.standing
      ? (line.quantity ?? 0) * (matched.unitPrice ?? 0)
      : lineAmount(matched)
    const amountOff = !withinBand(billed, expected, LINE_BAND)
    const verdict =
      quantityOff && priceOff
        ? "price-quantity"
        : quantityOff
          ? "quantity"
          : priceOff || amountOff
            ? "price"
            : "match"
    return {
      key,
      description: line.description,
      invoice: line,
      po: matched,
      verdict,
      exact:
        Math.abs(billed - expected) < 0.005 &&
        (line.unitPrice ?? 0) === (matched.unitPrice ?? 0) &&
        (!!po?.standing || (line.quantity ?? 0) === (matched.quantity ?? 0)),
      difference: billed - expected,
    }
  })
}

export const TOLERANCE_NOTE = "Lines ±2% or $5 · total ±1% or $25"

export const totalWithinBand = (invoice: OcrInvoice, po: PurchaseOrder) =>
  withinBand(invoice.subtotal ?? 0, po.subtotal ?? 0, TOTAL_BAND)

export const verdictLabel: Record<LineCheck["verdict"], string> = {
  match: "Matched",
  price: "Price differs",
  quantity: "Quantity differs",
  "price-quantity": "Price and quantity differ",
  "not-on-po": "Not on PO",
}

// Damerau–Levenshtein distance, so a digit transposition (33920 → 33902)
// counts as one edit, the way a person would read it.
function editDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

export type PoSuggestion = {
  po: PurchaseOrder
  score: number
  reasons: string[]
}

function vendorSimilarity(a: string, b: string) {
  if (normText(a) === normText(b)) return 1
  return similarity(a, b)
}

function lineOverlap(invoice: OcrInvoice, po: PurchaseOrder) {
  const checks = checkLines(invoice, po)
  if (!checks.length) return { paired: 0, exact: 0 }
  return {
    paired: checks.filter((line) => line.po).length / checks.length,
    exact: checks.filter((line) => line.verdict === "match").length / checks.length,
  }
}

export function scorePo(invoice: OcrInvoice, po: PurchaseOrder): PoSuggestion {
  const distance = editDistance(normPo(invoice.poNumber), normPo(po.poNumber))
  const vendor = vendorSimilarity(invoice.vendor, po.vendor)
  const lines = lineOverlap(invoice, po)
  const poScore = Math.max(0, 1 - distance / 4)
  // What was ordered matters more than how the number was typed.
  const lineScore = 0.6 * lines.exact + 0.4 * lines.paired
  const score = Math.round((0.3 * poScore + 0.2 * vendor + 0.5 * lineScore) * 100)
  const reasons: string[] = []
  if (distance === 0) reasons.push("PO number matches")
  else if (distance === 1) reasons.push(`PO number one character off ${invoice.poNumber}`)
  else reasons.push(`PO number differs from ${invoice.poNumber}`)
  if (po.vendor === invoice.vendor) reasons.push("Same vendor")
  else if (vendor >= 0.5) reasons.push(`Vendor spelled “${po.vendor}”`)
  const linesPaired = Math.round(lines.paired * invoice.lines.length)
  const linesExact = Math.round(lines.exact * invoice.lines.length)
  reasons.push(`${linesExact} of ${invoice.lines.length} lines match exactly`)
  if (linesPaired > linesExact) reasons.push(`${linesPaired - linesExact} with small differences`)
  return { po, score, reasons }
}

// Header suggestions only surface POs whose number is close to what OCR
// read; anything further away has to be found with search.
export function suggestPos(invoice: OcrInvoice): PoSuggestion[] {
  if (poByNumber(invoice.poNumber)) return []
  return purchaseOrders
    .filter((po) => {
      const distance = editDistance(normPo(invoice.poNumber), normPo(po.poNumber))
      const paired = lineOverlap(invoice, po).paired
      // A close number with nothing else in common is a coincidence, not a match.
      if (paired < 0.3) return false
      return distance <= 1 || (distance <= 3 && vendorSimilarity(invoice.vendor, po.vendor) >= 0.5)
    })
    .map((po) => scorePo(invoice, po))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export function searchPos(invoice: OcrInvoice, query: string): PoSuggestion[] {
  const needle = normText(query)
  if (!needle) return []
  return purchaseOrders
    .filter((po) => normText(`${po.poNumber} ${po.vendor}`).includes(needle) || normPo(po.poNumber).includes(normPo(query)))
    .map((po) => scorePo(invoice, po))
    .sort((a, b) => b.score - a.score)
}

// How much of a standing order has been billed by approved invoices.
export function drawdown(po: PurchaseOrder, approvedInvoices: OcrInvoice[]) {
  const billed = approvedInvoices
    .filter((invoice) => normPo(invoice.poNumber) === normPo(po.poNumber))
    .reduce((sum, invoice) => sum + (invoice.subtotal ?? 0), 0)
  const cap = po.standing?.valueCap ?? po.subtotal ?? 0
  return { billed, cap, remaining: cap - billed }
}
