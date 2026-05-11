export interface Agent {
  id: string
  name: string
  db_id?: string
  model?: {
    name: string
    model: string
    provider: string
  }
}

export interface Session {
  session_id: string
  session_name: string
  session_state: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ToolCallStatus = "started" | "completed"

export interface ToolCall {
  id: string
  name: string
  status: ToolCallStatus
  args?: unknown
  result?: unknown
  error?: string | null
  duration?: number
  timestamp: Date
}

export interface ChatFile {
  id: string
  name: string
  type: string
  previewUrl?: string
  contentBase64?: string
}

export interface MessageMetrics {
  input_tokens?: number
  output_tokens?: number
  total_tokens?: number
  reasoning_tokens?: number
  time_to_first_token?: number
  duration?: number
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  tools?: ToolCall[]
  files?: ChatFile[]
  metrics?: MessageMetrics
}
