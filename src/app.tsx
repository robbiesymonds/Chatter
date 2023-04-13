import { lazy } from "react"
import ReactDOM from "react-dom/client"
const StaticView = lazy(() => import("./components/StaticView"))
const UploadView = lazy(() => import("./components/UploadView"))

/* ----- ENABLE THIS FOR STATIC MODE ----- */
const STATIC = false

function App() {
  return <>{STATIC ? <StaticView /> : <UploadView />}</>
}

// Render the App component.
ReactDOM.createRoot(document.getElementById("app")!).render(<App />)
