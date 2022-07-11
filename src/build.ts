import { resolve } from "path"

export const DIR = ".tmp_data"

const build = async (path: string): Promise<boolean> => {
  if (path?.length === 0) return false

  console.log("Reading file...")
  const td = new TextDecoder("utf-8")
  let data

  // Check that the supplied location is valid.
  try {
    data = await Deno.readFile(path)
    console.log(td.decode(data))
  } catch (_) {
    return false
  }

  const PATH = resolve(`./${DIR}`, "temp.txt")

  console.log(PATH)

  // Make the directory if does not exist.
  try {
    await Deno.stat(DIR)
  } catch {
    await Deno.mkdir(DIR)
  }

  // Write the new data to the file.
  try {
    await Deno.writeFile(PATH, data, { create: true })
    const new_data = await Deno.readFile(`${DIR}/temp.txt`)
    console.log(td.decode(new_data))

    return true
  } catch (_) {
    return false
  }
}

export default build
