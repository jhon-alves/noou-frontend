export type SessionData = {
  session_id: string
  session_type: string
  agent_id: string
  summary: {
    topics: string[]
    summary: string
  }
  metrics: {
    duration: number
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
  created_at: number
  updated_at: number
}

export type SessionsResponse = {
  items: SessionData[]
}
