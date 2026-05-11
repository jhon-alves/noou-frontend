import { AgentSSEPayload, AgentSSEPayloadHandler, isAgentSSEEvent } from "../types/sse-types"

function createAgentSSEPayload(event: string, data: unknown): AgentSSEPayload | null {
  if (!isAgentSSEEvent(event)) {
    return null
  }

  switch (event) {
    case "ToolCallStarted":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    case "ToolCallCompleted":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    case "RunContent":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    case "RunResponse":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    case "RunCompleted":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    case "RunError":
      return {
        event,
        data: data as AgentSSEPayload["data"],
      } as AgentSSEPayload

    default:
      return null
  }
}

// Quando stream for true, vai ser executado esse parse para ler por partes o retorno e converter em texto;
// Identifica os eventos 'event' e 'data';
export async function parseSSE(response: Response, onEvent: AgentSSEPayloadHandler) {
  const reader = response.body?.getReader()

  if (!reader) {
    throw new Error("No response body")
  }

  const decoder = new TextDecoder()
  let buffer = ""
  let currentEvent = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim()
        continue
      }

      if (!line.startsWith("data:")) {
        continue
      }

      try {
        const parsedData = JSON.parse(line.slice(5).trim()) as unknown
        const payload = createAgentSSEPayload(currentEvent, parsedData)

        if (!payload) {
          continue
        }

        onEvent(payload)
      } catch {
        // Ignora chunks malformados sem quebrar o streaming.
      }
    }
  }
}
