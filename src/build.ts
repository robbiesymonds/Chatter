import config from "./utils/env.ts"
import generate from "./utils/statistics.ts"
import { MessengerExport } from "./utils/messages.ts"

const env = await config()
const dir = `${Deno.cwd()}/data`
const regex = new RegExp(/message_[0-9]+\.json/)

const build = async (): Promise<unknown> => {
  if (!env?.ENABLE_STATIC) return null

  const data: Array<MessengerExport> = []
  try {
    const parser = new TextDecoder("utf-8")

    // Only look for Messenger exports.
    for await (const file of Deno.readDir(dir)) {
      if (regex.test(file.name)) {
        const json = parser.decode(await Deno.readFile(`${dir}/${file.name}`))
        data.push(JSON.parse(json))
      }
    }

    // Generate the statistics.
    return generate(data)
  } catch (e) {
    console.error("Failed to resolve `DATA_PATH` location: ", e)
    return null
  }
}

export default build
