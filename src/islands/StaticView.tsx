/** @jsx h */
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import ResultsView from "./ResultsView.tsx"

export default function StaticView() {
  const [data, setData] = useState()
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    fetch("/api/generate", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) setData(res.data)
        else setError(true)
      })
  }, [])

  return (
    <section>
      {error ? <div>Something went wrong!</div> : data ? <ResultsView data={data} /> : "Loading..."}
    </section>
  )
}
