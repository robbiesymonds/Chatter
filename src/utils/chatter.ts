export interface Chatter {
  chat_name: string
  general: General
  people: Person[]
}

// Conversation-wide statistics.
export interface General {
  total_messages: number
  total_photos: number
  total_videos: number
  total_audio: number
  total_gifs: number
  total_reactions: number
  total_calls: number
  call_minutes: number
  average_messages: number
  message_split: Data[]
  common_words: Data[]
  common_emojis: Data[]
  longest_streak: number
  sentiment: Data[]
  activity: Data[]
  age: number
}

// Statistics for each participant.
export interface Person {
  name: string
  favourite_words: Data[]
  favourite_emojis: Data[]
  favourite_reactions: Data[]
  photos: number
  videos: number
  audio: number
  gifs: number
  average_length: number
  most_consecutive: number
  most_positive: string
  most_negative: string
}

// -----------------
// | Generics
// -----------------

export interface Data<T = number> {
  content: string
  value: T
}
