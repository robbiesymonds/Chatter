/** @jsx h */
import { h } from "preact"
import { Handlers, PageProps } from "$fresh/server.ts"
import config from "../utils/env.ts"
import { setCookie } from "cookie"
import { createHash } from "hash"

// Get environment variables.
const env = await config()

export const handler: Handlers<{ error: boolean }> = {
  GET(_, ctx) {
    if (!env.PASSWORD) return new Response(undefined, { status: 404 })
    else return ctx.render({ error: false })
  },
  async POST(req, ctx) {
    try {
      const _headers = req.headers
      const body = await req.formData()
      if (body.has("password")) {
        const password = body.get("password") as string

        // Create hash to compare.
        const hash = createHash("md5").update(password).toString()
        if (password === env.PASSWORD) {
          const res = new Response(undefined, { status: 301, headers: { location: "/" } })
          setCookie(res.headers, {
            httpOnly: true,
            name: "token",
            value: hash,
            maxAge: 300,
            path: "/"
          })
          return res
        }
      }
      throw "ERROR"
    } catch (_e) {
      console.log(_e)
      return ctx.render({ error: true })
    }
  }
}

export default function Password({ data }: PageProps<{ error: boolean }>) {
  return (
    <main>
      <h1>Chatter</h1>
      <h2>
        <a href="https://github.com/robbiesymonds/Chatter" target="_blank">
          Made by Robbie Symonds ✌🏼
        </a>
      </h2>
      <form action="/password" method="POST">
        <input placeholder="Password" name="password" type="password" />
        {data?.error && <h3 class="error">Wrong password!</h3>}
      </form>
    </main>
  )
}
