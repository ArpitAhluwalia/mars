import { useRef, useState } from "react"
import { ArrowUpRight, Check, FileText, FileX, Loader2, Upload as UploadIcon, X } from "lucide-react"
import { money } from "../data/reconcile"
import { uploadSamples } from "../data/scenario"
import type { Upload } from "../data/types"
import { deriveInvoice, useMars } from "../state/store"
import { Button, MarsAvatar, StatusPill } from "./ui"

const stages = ["Uploaded", "Splitting pages", "Reading invoices", "Matching POs"]

function UploadRow({ upload }: { upload: Upload }) {
  const { state, openInvoice, openPanel } = useMars()
  const done = upload.stage >= 4
  const found = upload.invoiceIds.length

  return (
    <div className="agent-card">
      <div className="agent-card-head">
        <MarsAvatar size={26} />
        <span>
          <strong>MARS</strong>{" "}
          {done
            ? found
              ? `split ${upload.pages} pages into ${found} invoice${found > 1 ? "s" : ""}`
              : `read ${upload.pages} pages and found no invoice`
            : `is processing ${upload.file}`}
        </span>
        {!done && <Loader2 className="spin" size={14} />}
      </div>

      <ol className="pipeline">
        {stages.map((label, index) => {
          const state = upload.stage > index ? "done" : upload.stage === index ? "active" : ""
          return (
            <li className={state} key={label}>
              <i>{state === "done" ? <Check size={11} strokeWidth={3} /> : state === "active" ? <Loader2 className="spin" size={11} /> : null}</i>
              {label}
            </li>
          )
        })}
      </ol>

      {done &&
        upload.invoiceIds.map((id) => {
          const view = deriveInvoice(state, id)
          return (
            <button
              className="object-row"
              key={id}
              onClick={() => {
                openPanel(null)
                openInvoice(id)
              }}
            >
              <span className="object-icon">
                <FileText size={16} strokeWidth={1.6} />
              </span>
              <span className="cell-stack">
                <strong>
                  {view.invoice.invoiceNumber} · {money(view.invoice.total)}
                </strong>
                <small>
                  Pages {view.invoice.sourcePages} · {view.finding}
                </small>
              </span>
              <StatusPill status={view.status} />
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </button>
          )
        })}
      {done && !found && (
        <div className="object-row">
          <span className="object-icon">
            <FileX size={16} strokeWidth={1.6} />
          </span>
          <span className="cell-stack">
            <strong>{upload.skipped} pages skipped</strong>
            <small>None of them are invoices, so nothing was created</small>
          </span>
        </div>
      )}
      {done && (
        <p className="agent-note">
          Est. processing cost ${(upload.pages * 0.012).toFixed(3)} · {upload.pages} pages OCR
        </p>
      )}
    </div>
  )
}

export default function UploadPanel() {
  const { state, openPanel, startUpload } = useMars()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const close = () => openPanel(null)

  // Any real PDF runs through the same demo pipeline using the CU-004 sample's results.
  const take = (files: FileList | null) => {
    const file = files?.[0]
    if (file) startUpload(0, file.name)
  }

  return (
    <>
      <button aria-label="Close upload" className="scrim" onClick={close} />
      <aside aria-label="Upload invoices" className="drawer">
        <header className="drawer-head">
          <span className="cell-stack">
            <strong>Upload invoices</strong>
            <small>PDFs are split, read and matched the same way as email</small>
          </span>
          <Button aria-label="Close" icon={X} onClick={close} size="sm" variant="ghost" />
        </header>
        <div className="drawer-body upload-body">
          <button
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onClick={() => input.current?.click()}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              take(event.dataTransfer.files)
            }}
          >
            <UploadIcon size={22} strokeWidth={1.5} />
            <strong>Drop invoice PDFs here</strong>
            <small>or click to browse · one PDF can hold several invoices</small>
            <input accept="application/pdf,.pdf" hidden onChange={(event) => take(event.target.files)} ref={input} type="file" />
          </button>

          <div className="samples">
            <p className="list-group">Try a sample from the dev test set</p>
            {uploadSamples.map((sample, index) => (
              <button className="attachment" key={sample.file} onClick={() => startUpload(index)}>
                <span className="file-badge">PDF</span>
                <span className="cell-stack">
                  <strong>{sample.file}</strong>
                  <small>
                    {sample.pages} pages · {sample.size}
                  </small>
                </span>
                <UploadIcon size={16} strokeWidth={1.6} />
              </button>
            ))}
          </div>

          {state.uploads.length > 0 && (
            <div className="upload-list">
              <p className="list-group">This session</p>
              {state.uploads.map((upload) => (
                <UploadRow key={upload.id} upload={upload} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
