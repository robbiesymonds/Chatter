/** @jsx h */
import { h } from "preact"
import { Handlers, PageProps } from "$fresh/server.ts"
import StaticView from "../islands/StaticView.tsx"
import UploadView from "../islands/UploadView.tsx"
import config from "../utils/env.ts"

// Get environment variables.
const env = await config()

export const handler: Handlers<{ mode: "upload" | "static" }> = {
  GET(_, ctx) {
    return ctx.render({ mode: env.DATA_PATH ? "static" : "upload" })
  }
}

export default function Home({ data }: PageProps<{ mode: "upload" | "static" }>) {
  return (
    <div>
      <h1>Chatter</h1>
      {data.mode === "static" ? <StaticView /> : <UploadView />}
    </div>
  )
}
