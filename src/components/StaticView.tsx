import fs from "fs"
import { useMemo } from "react"
import { Chatter } from "../constants/chatter"
import { MessengerExport } from "../constants/messages"
import generate from "../utils/statistics"
import ResultsView from "./ResultsView"

// Inline bundles the data files.
import * as files from "../../data/*.json"

const STATIC_DATA = (): Chatter | undefined => {
  const data: MessengerExport[] = []
  for (const file of Object.values(files)) {
    data.push(file as MessengerExport)
  }

  if (data.length === 0) return undefined
  return generate(data)
}

export default function StaticView() {
  const data = useMemo(() => STATIC_DATA(), [])

  return (
    <section>
      {!data ? <div className="error">Something went wrong!</div> : <ResultsView data={data} />}
    </section>
  )
}
