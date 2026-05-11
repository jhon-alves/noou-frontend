export type AgentData = {
  id: string
  name: string
  db_id: string
  model: {
    name: string
    model: string
    provider: string
  }
  sessions: {
    session_table: string
  }
  knowledge: {
    knowledge_table: string
  }
  system_message: {
    markdown: boolean
    add_datetime_to_context: boolean
  }
}

export type AgentRunBody = {
  message: string
  stream: boolean
  session_id?: string | null
  files?: File[]
}

export type NoouAgentData = {
  id: string
  name: string
  identifier: string
  short_description: string
  long_description: string
}

export type SessionRunData = {
  run_id: string
  run_input?: string
  content?: string
  events?: any[]
  images?: {
    id: string
    mime_type: string
    content: string
  }[]
  metrics?: {
    input_tokens?: number
    output_tokens?: number
    total_tokens?: number
    reasoning_tokens?: number
    time_to_first_token?: number
    duration?: number
  }
  created_at: number
}
