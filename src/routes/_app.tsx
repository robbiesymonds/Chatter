/** @jsx h */
/** @jsxFrag Fragment */
import { Head } from "$fresh/runtime.ts"
import { AppProps } from "$fresh/server.ts"
import { Fragment, h } from "preact"

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Chatter</title>
        <link href="/global.css" rel="stylesheet" />
      </Head>
      <Component />
    </>
  )
}
