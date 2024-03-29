import { Chatter, Person } from "../constants/chatter"
import PieChart from "./PieChart"
import LineChart from "./LineChart"
import GaugeChart from "./GaugeChart"
import { Fragment } from "react"

const NA = (s: number) => (s == 0 ? <i>N/A</i> : s)

export default function StaticView({ data }: { data: Chatter }) {
  const { general, people } = data

  const reactionMessage = (p: Person) => {
    const strings = [
      "was no stranger to using reactions:",
      "saved their reactions for special occasions:",
      "isn't the biggest fan of reactions:"
    ]
    const count = p.favourite_reactions.reduce((a, b) => a + b.value, 0)
    return `${p.name.split(" ")[0]} ${strings[count >= 150 ? 0 : count >= 50 ? 1 : 2]}`
  }

  const shareMessage = (p: Person) => {
    const strings = ["photo", "video", "audio file", "GIF"]
    const values = [p.photos, p.videos, p.audio, p.gifs]
    const formatted: string[] = []
    values.forEach((v, i) => {
      if (v > 0)
        formatted.push(
          `${i === values.length - 1 ? "and " : ""}<b>${v}</b> ${strings[i]}${v > 1 ? "s" : ""}`
        )
    })
    return `${p.name.split(" ")[0]} sent a total of ${formatted.join(", ")} to the chat.`
  }

  const possessive = (s: string) => {
    const f = s.split(" ")[0]
    return `${f}${f.slice(-1).toLowerCase() == "s" ? "\u0027" : "\u0027s"}`
  }

  const plural = (n: number, s: string) => {
    return `${n} ${s}${n !== 1 ? "s" : ""}`
  }

  return (
    <div className="results">
      <div className="header">
        <h1>
          {data.chat_name}
          <span>{plural(general.age, "day")}</span>
        </h1>
        {data.chat_type === "RegularGroup" && (
          <div className="chips">
            {people.map((p, i) => (
              <div
                key={i}
                className="chip"
                onClick={() =>
                  document
                    .getElementById(p.name)
                    ?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                }
              >
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card info">
          <h2>Total Messages</h2>
          <span>{NA(general.total_messages)}</span>
        </div>
        <div className="card info">
          <h2>Total Photos</h2>
          <span>{NA(general.total_photos)}</span>
        </div>
        <div className="card info">
          <h2>Total Videos</h2>
          <span>{NA(general.total_videos)}</span>
        </div>
        <div className="card info">
          <h2>Total Audio</h2>
          <span>{NA(general.total_audio)}</span>
        </div>
        <div className="card info">
          <h2>Total GIFs</h2>
          <span>{NA(general.total_gifs)}</span>
        </div>
        <div className="card info">
          <h2>Total Reactions</h2>
          <span>{NA(general.total_reactions)}</span>
        </div>

        <div className="chat">
          <div>
            <h3>Average Messages</h3>
            <p>
              There was an average of <b>{plural(general.average_messages, "message")}</b> per day.
            </p>
          </div>
          <div>
            <h3>Longest Streak</h3>
            <p>
              The best consecutive record was <b>{general.longest_streak} days</b> in a row!
            </p>
          </div>
          {general.total_calls >= 1 && (
            <div>
              <h3>Audio Calls</h3>
              <p>
                There was <b>{plural(general.total_calls, "call")}</b>. You called for{" "}
                <b>{plural(general.call_minutes, "minute")}</b> in total.
              </p>
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="cards">
        <div className="left small-left">
          <div className="card">
            <h3>Message Split</h3>
            <div style={{ width: "90%", paddingTop: "1rem" }}>
              <PieChart data={general.message_split} />
            </div>
          </div>
          <div className="card">
            <h3>Chat Sentiment</h3>
            <div style={{ width: "90%", paddingTop: "1rem" }}>
              <GaugeChart data={general.sentiment} />
            </div>
          </div>
        </div>
        <div className="big-right">
          <div className="card">
            <h3>Monthly Activity</h3>
            <div style={{ paddingTop: "1rem" }}>
              <LineChart data={general.activity} />
            </div>
          </div>
          <div className="right">
            <div className="card">
              <h3>Common Words</h3>
              <div className="list">
                {general.common_words.map((w, i) => (
                  <div key={i}>
                    <kbd>{w.content}</kbd>
                    <span>{w.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Most Used Emojis</h3>
              <div className="list">
                {general.common_emojis.map((e, i) => (
                  <div key={i}>
                    <span>{e.content}</span>
                    <span>{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <hr />

      <div className="break">
        <span>Chat Participants</span>
      </div>

      <hr />

      {data.people.map((p, i) => (
        <Fragment key={i}>
          <h4 id={p.name}>{p.name}</h4>
          <div className={`cards ${i % 2 === 1 ? "flip" : ""}`}>
            <div className="card person-big">
              <div className="chat">
                <div>
                  <h3>Sharing is Caring</h3>
                  <p dangerouslySetInnerHTML={{ __html: shareMessage(p) }}></p>
                </div>
                <div>
                  <h3>Average Length</h3>
                  <p>
                    Their messages were <b>{plural(p.average_length, "character")}</b> long on
                    average.
                  </p>
                </div>
                <div>
                  <h3>Reactions</h3>
                  <div>
                    {reactionMessage(p)}
                    <ul>
                      {p.favourite_reactions.map((r, i) => (
                        <li key={i}>
                          <span>
                            {r.content} {r.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3>Spammer</h3>
                  <p>
                    Their highest number of messages in a row was <b>{p.most_consecutive}</b>!
                  </p>
                </div>
                <div>
                  <h3>Optimistic Analysis</h3>
                  <p>
                    {possessive(p.name)} most positive message was <i>"{p.most_positive}"</i>
                  </p>
                </div>
                <div>
                  <h3>Negative Analysis</h3>
                  <p>
                    {possessive(p.name)} most negative message was <i>"{p.most_negative}"</i>
                  </p>
                </div>
              </div>
            </div>
            <div className="card person-small">
              <h3>Overall Sentiment</h3>
              <div style={{ width: "90%", paddingTop: "1rem" }}>
                <GaugeChart data={p.sentiment} />
              </div>
            </div>
            <div className="card person-table-left">
              <h3>Favourite Words</h3>
              <div className="list">
                {p.favourite_words.map((w, i) => (
                  <div key={i}>
                    <kbd>{w.content}</kbd>
                    <span>{w.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card person-table-right">
              <h3>Emoji Usage</h3>
              <div className="list">
                {p.favourite_emojis.map((e, i) => (
                  <div key={i}>
                    <span>{e.content}</span>
                    <span>{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr />
        </Fragment>
      ))}
    </div>
  )
}
