import { config } from "dotenv"

type Vars = {
  ENABLE_STATIC?: string
  PASSWORD?: string
}

const env = async (): Promise<Vars> => {
  const e = await config()
  if (Object.keys(e)?.length === 0) return Deno.env.toObject()
  else return e
}

export default env