import { useRef, useEffect, useState } from "react"
import { MessengerExport } from "../constants/messages"
import ResultsView from "./ResultsView"
import Loading from "./Loading"
import generate from "../utils/statistics"
import { Chatter } from "../constants/chatter"

const regex = new RegExp(/message_[0-9]+\.json/)

export default function StaticView() {
  const ref = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<Chatter | undefined>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

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
      console.log(data)

      // Generate the statistics.
      const json = await Promise.all(data)
      try {
        const stats = generate(json)
        setData(stats)
      } catch (e) {
        setError(true)
        return
      }

      setLoading(false)
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
      ) : error ? (
        <div className="error">Something went wrong!</div>
      ) : data ? (
        <ResultsView data={data} />
      ) : (
        <div className="wrapper">
          <div className="upload">
            <input ref={ref} type="file" multiple accept="application/JSON" />
            <span>
              Drag your <kbd>.json</kbd> files here or <b>browse</b> to upload.
            </span>
          </div>
          <p className="hint">No data is kept, everything gets lost!</p>
          <p className="hint">
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
