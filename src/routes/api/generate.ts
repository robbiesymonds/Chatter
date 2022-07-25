import { Handlers } from "$fresh/server.ts"
import build from "../../build.ts"
import config from "../../utils/env.ts"
import generate from "../../utils/statistics.ts"

const env = await config()

export const handler: Handlers<Promise<{ status: boolean; data?: unknown }>> = {
  async POST(req) {
    let data: unknown
    const json = await req.json()
    if (env.ENABLE_STATIC === "false" && json !== null) data = generate(json)
    else data = await build()

    return Response.json({ status: data !== null, data })
  }
}
