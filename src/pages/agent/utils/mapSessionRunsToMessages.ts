import { Message } from "../types/agent-types"
import { SessionRunData } from "@/services/agents/types"

export function mapSessionRunsToMessages(runs: SessionRunData[]): Message[] {
  const messages: Message[] = []

  runs.forEach((run) => {
    // User message (input)
    if (run.run_input) {
      messages.push({
        id: `${run.run_id}-user`,
        role: "user",
        content: run.run_input,
        timestamp: new Date(run.created_at * 1000),
      })
    }

    // Assistant message (output)
    if (run.content || run.images?.length) {
      messages.push({
        id: `${run.run_id}-assistant`,
        role: "assistant",
        content: run.content ?? "",
        timestamp: new Date(run.created_at * 1000),
        files: run.images?.map((img) => ({
          id: img.id,
          name: "image",
          type: img.mime_type,
          contentBase64: img.content,
        })),
        metrics: run.metrics,
      })
    }
  })

  return messages
}
