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
    return ctx.render({ mode: env.ENABLE_STATIC ? "static" : "upload" })
  }
}

export default function Home({ data }: PageProps<{ mode: "upload" | "static" }>) {
  return (
    <main>
      <h1>Chatter</h1>
      <h2>
        <a href="https://github.com/robbiesymonds/Chatter" target="_blank">
          Made by Robbie Symonds ✌🏼
        </a>
      </h2>
      {data.mode === "static" ? <StaticView /> : <UploadView />}
    </main>
  )
}
