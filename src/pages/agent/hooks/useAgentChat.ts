/**
 * Hook responsável por gerenciar o motor principal de conversação do Agente.
 * * Ele encapsula toda a complexidade assíncrona do chat, incluindo:
 * - O envio de mensagens de texto e arquivos.
 * - O streaming de respostas em tempo real via Server-Sent Events (SSE).
 * - A captura e atualização de status Tool Calls, métricas e erros.
 * - O controle de interrupção (AbortController) via stopStreaming.
 */

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { agentsServices } from "@/services/agents/agents-services"
import { useAgentStore } from "@/stores/useAgentStore"
import { Message } from "../types/agent-types"
import { parseSSE } from "../utils/parseSSE"
import { toast } from "@/hooks/useToast"

interface UseAgentChatOptions {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function useAgentChat({ setMessages }: UseAgentChatOptions) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const abortAgentRunRef = useRef<AbortController | null>(null)

  const {
    containerId,
    containerToken,
    sessionId,
    selectedAgent,
    setIsStreaming,
    setContainerStatus,
    setSessionId,
  } = useAgentStore()

  async function sendMessage(content: string, files?: File[]) {
    if (!containerId) {
      toast({
        title: t("common.error"),
        description: t("agent.start-container-error"),
        type: "error",
      })
      return
    }

    if (!selectedAgent) {
      toast({
        title: t("common.error"),
        description: t("agent.select-agent-error"),
        type: "error",
      })
      return
    }

    const assistantMessageId = crypto.randomUUID()
    const userMessageId = crypto.randomUUID()

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content,
        timestamp: new Date(),
        files: files?.map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        })),
      },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ])

    abortAgentRunRef.current = new AbortController()
    setIsStreaming(true)

    try {
      const response = await agentsServices.createAgentRun(
        containerId,
        containerToken!,
        selectedAgent.identifier,
        {
          message: content,
          stream: true,
          session_id: sessionId || undefined,
          files: files?.length ? files : undefined,
        },
        abortAgentRunRef.current.signal,
      )

      if (!response.ok) {
        if (response?.status === 500 || response?.status === 502) {
          setContainerStatus("error")
        }
        throw new Error("Failed to run agent")
      }

      await parseSSE(response, ({ event, data }) => {
        if (event === "ToolCallStarted" && data.tool) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    tools: [
                      ...(msg.tools || []),
                      {
                        id: data.tool.tool_call_id,
                        name: data.tool.tool_name,
                        status: "started",
                        args: data.tool.tool_args,
                        timestamp: new Date(data.created_at * 1000),
                      },
                    ],
                  }
                : msg,
            ),
          )
        } else if (event === "ToolCallCompleted" && data.tool) {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantMessageId || !msg.tools) return msg

              return {
                ...msg,
                tools: msg.tools.map((tool) => {
                  if (tool.id !== data.tool.tool_call_id) {
                    return tool
                  }

                  return {
                    ...tool,
                    status: "completed",
                    result: data.tool.result,
                    error: data.tool.tool_call_error,
                    duration: data.tool.metrics?.duration,
                  }
                }),
              }
            }),
          )
        } else if (event === "RunContent" && data.content) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: msg.content + data.content } : msg,
            ),
          )
        } else if (event === "RunResponse" && data.metrics) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    metrics: {
                      input_tokens: data.metrics.input_tokens,
                      output_tokens: data.metrics.output_tokens,
                      total_tokens: data.metrics.total_tokens,
                      reasoning_tokens: data.metrics.reasoning_tokens,
                      time_to_first_token: data.metrics.time_to_first_token,
                      duration: data.metrics.duration,
                    },
                  }
                : msg,
            ),
          )
        } else if (event === "RunCompleted") {
          qc.invalidateQueries({ queryKey: ["sessions"] })

          setSessionId(data.session_id)

          if (data.images && data.images.length > 0) {
            const mappedFiles = data.images.map((img) => ({
              id: img.id,
              name: "image",
              type: img.mime_type,
              contentBase64: img.content,
            }))
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, files: mappedFiles } : msg,
              ),
            )
          }
        } else if (event === "RunError") {
          const errorMsg = data.content || data.message || data.error || t("send-message-error")

          toast({
            title: t("common.error"),
            description: errorMsg,
            type: "error",
          })

          abortAgentRunRef.current?.abort()
        }
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast({
          title: t("common.success"),
          description: t("agent.abort-message-error"),
          type: "success",
        })
      } else {
        toast({
          title: t("common.error"),
          description: error instanceof Error ? error.message : t("send-message-error"),
          type: "error",
        })

        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
      }
    } finally {
      setIsStreaming(false)
      abortAgentRunRef.current = null
    }
  }

  const stopStreaming = () => {
    if (abortAgentRunRef.current) {
      abortAgentRunRef.current.abort()
      setIsStreaming(false)
    }
  }

  return { sendMessage, stopStreaming }
}
