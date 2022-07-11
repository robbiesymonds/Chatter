/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "$fresh/server.ts"
import { config } from "dotenv"
import build from "./build.ts"
import manifest from "./fresh.gen.ts"

const file = config()["STATIC_FILE"]
if (file) {
  try {
    await build(file)
    console.log("\x1b[1m\x1b[32mGenerated static export data!\x1b[0m")
  } catch (_e) {
    throw "Unable to resolve location specified in STATIC_FILE variable!"
  }
}

await start(manifest, { port: 3000 })
