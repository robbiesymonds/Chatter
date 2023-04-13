import ReactDOM from "react-dom/client"
import { useState } from "react"
import UploadView from "./components/UploadView"
import StaticView from "./components/StaticView"

function App() {
  const [mode, setMode] = useState<"static" | "upload">("upload")
  return <>{mode === "static" ? <StaticView /> : <UploadView />}</>
}

// Render the App component.
ReactDOM.createRoot(document.getElementById("app")!).render(<App />)
