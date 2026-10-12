import Shell from "./components/Shell"
import Audit from "./screens/Audit"
import Inbox from "./screens/Inbox"
import InvoiceList from "./screens/invoices/InvoiceList"
import InvoiceReview from "./screens/invoices/InvoiceReview"
import Queries from "./screens/Queries"
import { MarsProvider, useMars } from "./state/store"

function Screen() {
  const { state } = useMars()
  switch (state.view) {
    case "inbox":
      return <Inbox />
    case "invoices":
      return state.openInvoiceId ? <InvoiceReview id={state.openInvoiceId} /> : <InvoiceList />
    case "queries":
      return <Queries />
    case "audit":
      return <Audit />
  }
}

export default function App() {
  return (
    <MarsProvider>
      <Shell>
        <Screen />
      </Shell>
    </MarsProvider>
  )
}
