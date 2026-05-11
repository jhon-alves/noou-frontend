export type AgentSSEEvent =
  | "ToolCallStarted"
  | "ToolCallCompleted"
  | "RunContent"
  | "RunResponse"
  | "RunCompleted"
  | "RunError"

export type AgentToolCallStartedData = {
  created_at: number
  tool: {
    tool_call_id: string
    tool_name: string
    tool_args?: unknown
  }
}

export type AgentToolCallCompletedData = {
  tool: {
    tool_call_id: string
    tool_name?: string
    tool_args?: unknown
    result?: unknown
    tool_call_error?: string | null
    metrics?: {
      duration?: number
    }
  }
}

export type AgentRunContentData = {
  content: string
}

export type AgentRunResponseData = {
  metrics: {
    input_tokens?: number
    output_tokens?: number
    total_tokens?: number
    reasoning_tokens?: number
    time_to_first_token?: number
    duration?: number
  }
}

export type AgentRunCompletedImage = {
  id: string
  mime_type: string
  content: string
}

export type AgentRunCompletedData = {
  session_id: string
  images?: AgentRunCompletedImage[]
}

export type AgentRunErrorData = {
  content?: string
  message?: string
  error?: string
}

export type AgentSSEPayload =
  | {
      event: "ToolCallStarted"
      data: AgentToolCallStartedData
    }
  | {
      event: "ToolCallCompleted"
      data: AgentToolCallCompletedData
    }
  | {
      event: "RunContent"
      data: AgentRunContentData
    }
  | {
      event: "RunResponse"
      data: AgentRunResponseData
    }
  | {
      event: "RunCompleted"
      data: AgentRunCompletedData
    }
  | {
      event: "RunError"
      data: AgentRunErrorData
    }

export type AgentSSEPayloadHandler = (payload: AgentSSEPayload) => void

export function isAgentSSEEvent(event: string): event is AgentSSEEvent {
  return (
    event === "ToolCallStarted" ||
    event === "ToolCallCompleted" ||
    event === "RunContent" ||
    event === "RunResponse" ||
    event === "RunCompleted" ||
    event === "RunError"
  )
}
