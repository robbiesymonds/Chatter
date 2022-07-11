import { resolve } from "path"

export const DIR = ".tmp_data"

const build = async (path: string): Promise<boolean> => {
  if (path?.length === 0) return false

  try {
    const data = await Deno.readFile(path)
    const td = new TextDecoder("utf-8")
    console.log(td.decode(data))

    const PATH = resolve(`./${DIR}`, "temp.txt")
    if (!Deno.readDir(DIR)) await Deno.mkdir(DIR)
    await Deno.writeFile(PATH, data, { create: true })

    const new_data = await Deno.readFile(`${DIR}/temp.txt`)
    console.log(td.decode(new_data))

    return true
  } catch (_e) {
    return false
  }
}

export default build
