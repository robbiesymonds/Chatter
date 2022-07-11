/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "$fresh/server.ts"
import { config } from "dotenv"
import build from "./build.ts"
import manifest from "./fresh.gen.ts"

let env = await config()
if (Object.keys(env).length === 0) env = Deno.env.toObject()

console.log(env)
try {
  const s = await build(env?.STATIC_FILE)
  if (s) console.log("\x1b[1m\x1b[32mGenerated static export data!\x1b[0m")
} catch (_e) {
  throw _e
  throw "Unable to resolve location specified in STATIC_FILE variable!"
}

await start(manifest, { port: 3000 })
