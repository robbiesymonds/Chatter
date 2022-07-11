/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts"
import { config } from "dotenv"
import { resolve } from "path"
import { h } from "preact"
import { DIR } from "../build.ts"

interface Props {
  uploaded: boolean
  message?: string
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    if (config()["STATIC_FILE"]) {
      const path = resolve(`./${DIR}`, "temp.txt")
      const data = await Deno.readTextFile(path)
      return ctx.render({ uploaded: true, message: data })
    }
    return ctx.render({ uploaded: false })
  }
}

export default function Home({ data }: PageProps<Props>) {
  const { uploaded, message } = data
  return (
    <div>
      <h1>Chatter</h1>
      <div>{!uploaded ? "Upload file..." : message}</div>
    </div>
  )
}
