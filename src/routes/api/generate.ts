import { Handlers } from "$fresh/server.ts"
import build from "../../build.ts"

export const handler: Handlers<Promise<{ status: boolean; data?: unknown }>> = {
  async POST() {
    const data = await build()
    return Response.json({ status: data !== null, data })
  }
}
