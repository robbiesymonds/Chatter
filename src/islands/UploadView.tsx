/** @jsx h */
import { h } from "preact"
import { useRef, useEffect, useState } from "preact/hooks"
import { MessengerExport } from "../utils/messages.ts"
import ResultsView from "./ResultsView.tsx"
import Loading from "./Loading.tsx"

const regex = new RegExp(/message_[0-9]+\.json/)

export default function StaticView() {
  const ref = useRef<HTMLInputElement>(null)
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  const readJSON = (file: File): Promise<MessengerExport> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(JSON.parse(reader.result?.toString() ?? ""))
      reader.onerror = () => reject(null)
      reader.readAsText(file, "UTF-8")
    })

  const handleUpload = async (e: Event) => {
    const data: Promise<MessengerExport>[] = []

    // Read the valid files in correct order.
    if (ref.current?.files) {
      setLoading(true)
      const files = Array.from(ref.current?.files).sort()
      for (const file of files) if (regex.test(file.name)) data.push(readJSON(file))

      // Generate the statistics.
      const json = await Promise.all(data)
      fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(json),
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) setData(res.data)
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    ref.current?.addEventListener("input", handleUpload)
    return () => {
      ref.current?.removeEventListener("input", handleUpload)
    }
  }, [])

  return (
    <section>
      {isLoading ? (
        <Loading />
      ) : data ? (
        <ResultsView data={data} />
      ) : (
        <div class="wrapper">
          <div class="upload">
            <input ref={ref} type="file" multiple />
            <span>
              Drag your <kbd>.json</kbd> files here or <b>browse</b> to upload.
            </span>
          </div>
          <p class="hint">No data is kept, everything gets lost!</p>
          <p class="hint">
            See the{" "}
            <a href="https://github.com/robbiesymonds/Chatter" target="_blank">
              docs
            </a>{" "}
            for more information.
          </p>
        </div>
      )}
    </section>
  )
}
