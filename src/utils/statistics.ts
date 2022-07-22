import { Chatter, Person } from "./chatter.ts"
import { MessengerExport } from "./messages.ts"
import { format, difference, dayOfYear } from "datetime"
import { STICKY_WORDS } from "./constants.ts"

function decodeEmoji(s: string) {
  const parser = new TextDecoder("utf-8")
  const data = Uint8Array.from(s.split("").map((c) => c.charCodeAt(0)))
  return parser.decode(data)
}

// deno-lint-ignore no-control-regex
const UNICODE = new RegExp(/[^\u0000-\u007F]+/)
const CALL_START = new RegExp(/[a-zA-Z]+ started a (call|video chat)./)
const CALL_END = new RegExp(/The (call|video chat) ended./)
const CALL_ACTIVITY = new RegExp(/[a-zA-Z]+ (joined the (call|video chat)|started sharing video)./)
const REACTION = new RegExp(/[[a-zA-Z]+ reacted [^.]+ to your message/)
const COMMON_WORD_LIMIT = 25
const COMMON_EMOJI_LIMIT = 10

const intialise = (): Chatter => ({
  chat_name: "",
  people: [],
  general: {
    total_messages: 0,
    total_photos: 0,
    total_videos: 0,
    total_audio: 0,
    total_gifs: 0,
    total_reactions: 0,
    total_calls: 0,
    call_minutes: 0,
    average_messages: 0,
    message_split: [],
    common_words: [],
    common_emojis: [],
    longest_streak: 0,
    sentiment: [],
    activity: [],
    age: 0
  }
})

const formatEmojiData = (emojis: Record<string, number>) =>
  Object.entries(emojis)
    .sort((a, b) => b[1] - a[1])
    .slice(0, COMMON_EMOJI_LIMIT)
    .map(([e, c]) => ({ content: e === "❤" ? "\u2764\ufe0f" : e, value: c }))

const formatWordData = (words: Record<string, number>) =>
  Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .filter(([w]) => !STICKY_WORDS.includes(w))
    .slice(0, COMMON_WORD_LIMIT)
    .map(([w, c]) => ({ content: w, value: c }))

const generate = (data: Array<MessengerExport>): Chatter => {
  const stats = intialise()
  const { general, people } = stats
  let call_timestamp: Date
  const common_words: { [key: string]: number } = {}
  const common_emojis: { [key: string]: number } = {}
  const person_emojis: { [key: string]: string[] } = {}
  const person_words: { [key: string]: string[] } = {}
  const person_reactions: { [key: string]: string[] } = {}
  let consecutive = { name: "", count: 0 }

  // Fetch person object utility.
  const person = (n: string) => people.find((p) => p.name === n) as Person

  data.forEach((chat, i) => {
    // Collect repeated data once.
    if (i === 0) {
      stats.chat_name = chat.title
      chat.participants.map(({ name }) => {
        people.push({
          name,
          favourite_words: [],
          favourite_emojis: [],
          favourite_reactions: [],
          photos: 0,
          videos: 0,
          audio: 0,
          gifs: 0,
          average_length: 0,
          most_consecutive: 0,
          most_positive: "",
          most_negative: ""
        })
        person_emojis[name] = []
        person_words[name] = []
        person_reactions[name] = []
        general.message_split.push({ content: name, value: 0 })
      })
    }

    // For all messages.
    chat.messages.reverse().forEach((m) => {
      if (m.type === "Generic") {
        if (m.content && !CALL_ACTIVITY.test(m.content) && !REACTION.test(m.content)) {
          general.total_messages++

          // Count characters.
          person(m.sender_name).average_length += m.content.length

          // Tokenise messages.
          const tokens = m.content.split(/(\s+)/).filter((e) => e.trim().length > 0)
          tokens.forEach((t) => {
            if (UNICODE.test(t)) {
              // Emoji specific count.
              const emojis = decodeEmoji(t)
                .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
                .filter((e) => e.trim().length > 0 && !/[ -~]/.test(e))

              emojis.forEach((e) => {
                person_emojis[m.sender_name].push(e)
                if (common_emojis[e] != null) common_emojis[e] += 1
                else common_emojis[e] = 1
              })
            } else if (!/^-?\d+$/.test(t)) {
              // Normal messages.
              const w = t.toLocaleLowerCase()
              person_words[m.sender_name].push(w)
              if (common_words[w] != null) common_words[w] += 1
              else common_words[w] = 1
            }
          })
        }

        // Specific message type counts.
        if (m.content && REACTION.test(m.content)) {
          general.total_reactions++
        }
        if (m.photos) {
          general.total_photos++
          person(m.sender_name).photos++
        }
        if (m.videos) {
          general.total_videos++
          person(m.sender_name).videos++
        }
        if (m.audio_files) {
          general.total_audio++
          person(m.sender_name).audio++
        }
        if (m.gifs) {
          general.total_gifs++
          person(m.sender_name).gifs++
        }
        if (m.reactions) {
          m.reactions.forEach((r) => {
            person_reactions[r.actor].push(decodeEmoji(r.reaction))
          })
        }

        // Message split.
        general.message_split.find((p) => p.content === m.sender_name)!.value++

        // Message activity.
        const day_sent = format(new Date(m.timestamp_ms), "yyyy-MM-dd")
        const activity = general.activity.find((a) => a.content === day_sent)
        if (!activity) general.activity.push({ content: day_sent, value: 1 })
        else activity.value++

        // Consecutive messages count.
        if (!consecutive.name) consecutive = { name: m.sender_name, count: 1 }
        if (consecutive.name != m.sender_name) {
          if (consecutive.count > person(consecutive.name).most_consecutive)
            person(consecutive.name).most_consecutive = consecutive.count
          consecutive = { name: m.sender_name, count: 1 }
        } else {
          consecutive.count++
        }
      }

      // Call-related statistics.
      if (m.type == "Call") {
        if (CALL_START.test(m.content)) {
          call_timestamp = new Date(m.timestamp_ms)
          general.total_calls++
        } else if (CALL_END.test(m.content)) {
          const mins = difference(call_timestamp, new Date(m.timestamp_ms), {
            units: ["minutes"]
          })!.minutes
          general.call_minutes += mins ?? 0
        }
      }
    })
  })

  // Average messages based on activity.
  const daily_sum = general.activity.reduce((a, b) => a + b.value, 0)
  general.average_messages = Math.round(daily_sum / general.activity.length)

  // Format commmon words and emojis.
  general.common_words = formatWordData(common_words)
  general.common_emojis = formatEmojiData(common_emojis)

  // Chat age since first message.
  general.age =
    difference(new Date(general.activity[0].content), new Date(), {
      units: ["days"]
    }).days ?? 0

  // Longest streak.
  let longest_streak = 0
  let current_day: Date
  general.activity.forEach(({ content }, i) => {
    const date = new Date(content)
    if (i === 0) current_day = date
    if (dayOfYear(current_day) % 365 === dayOfYear(date) - 1) {
      longest_streak++
      if (longest_streak > general.longest_streak) {
        general.longest_streak = longest_streak
      }
    } else longest_streak = 0
    current_day = date
  })

  // Calculate person-specific favourites.
  people.forEach((p) => {
    // Emoji
    const e_count: { [key: string]: number } = {}
    for (const e of person_emojis[p.name]) e_count[e] = e_count[e] ? e_count[e] + 1 : 1
    p.favourite_emojis = formatEmojiData(e_count)

    // Words
    const w_count: { [key: string]: number } = {}
    for (const e of person_words[p.name]) w_count[e] = w_count[e] ? w_count[e] + 1 : 1
    p.favourite_words = formatWordData(w_count)

    // Reactions
    const r_count: { [key: string]: number } = {}
    for (const r of person_reactions[p.name]) r_count[r] = r_count[r] ? r_count[r] + 1 : 1
    p.favourite_reactions = formatEmojiData(r_count)

    // Average length calculation.
    p.average_length = Math.round(
      p.average_length / general.message_split.find((s) => s.content === p.name)!.value
    )
  })

  return stats
}

export default generate
