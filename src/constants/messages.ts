// Contents of the message_[X].json files
export interface MessengerExport {
  title: string
  thread_type: "RegularGroup" | "Regular"
  messages: Message[]
  participants: {
    name: string
  }[]
}

export interface Message {
  sender_name: string
  timestamp_ms: number
  content: string
  type: "Generic" | "Share" | "Call"
  is_unsent: boolean
  reactions?: {
    reaction: string
    actor: string
  }[]
  photos?: Media[]
  videos?: Video[]
  audio_files?: Media[]
  gifs?: Omit<Media, "creation_timestamp">[]
  share?: {
    link: string
  }
}

export interface Media {
  creation_timestamp: number
  uri: string
}

export interface Video extends Media {
  thumbnail: {
    uri: string
  }
}
