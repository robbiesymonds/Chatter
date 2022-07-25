/** @jsx h */
import { h } from "preact"
import { Handlers, PageProps } from "$fresh/server.ts"
import StaticView from "../islands/StaticView.tsx"
import UploadView from "../islands/UploadView.tsx"
import config from "../utils/env.ts"
import { getCookies } from "cookie"
import { createHash } from "hash"

// Get environment variables.
const env = await config()

export const handler: Handlers<{ mode: "upload" | "static" }> = {
  GET(req, ctx) {
    if (env.PASSWORD) {
      const hash = createHash("md5").update(env.PASSWORD).toString()
      if (hash !== getCookies(req.headers)["token"]) return Response.redirect(req.url + "password")
    }
    return ctx.render({ mode: env.ENABLE_STATIC === "true" ? "static" : "upload" })
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
