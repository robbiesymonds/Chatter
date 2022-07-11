import config from "./utils/env.ts"

const env = await config()

const build = async (): Promise<unknown> => {
  if (!env?.DATA_PATH) return null

  try {
    const parser = new TextDecoder("utf-8")
    const data = await Deno.readFile(env.DATA_PATH)

    return parser.decode(data)
  } catch (e) {
    console.error("Failed to resolve `DATA_PATH` location: ", e)
    return null
  }
}

export default build
