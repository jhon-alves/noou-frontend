import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Message } from "./types/agent-types"
import { InputBar } from "@/components/agent/InputBar"
import { AgentMessageList } from "@/components/agent/message/AgentMessageList"
import { PageHeader } from "@/components/shared/PageHeader"
import { useTranslation } from "react-i18next"
import { useAgentStore } from "@/stores/useAgentStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/useToast"
import { agentsServices } from "@/services/agents/agents-services"
import { parseSSE } from "./utils/parseSSE"
import { useNoouAgents } from "./hooks/useNoouAgents"
import { createContainer, shutdownContainer } from "@/services/container/container-services"
import { HistoryDrawer } from "@/components/agent/HistoryDrawer"
import { useSessionRuns } from "./hooks/useSessionRuns"
import { mapSessionRunsToMessages } from "./utils/mapSessionRunsToMessages"
import { LoadingMessage } from "@/components/agent/LoadingMessage"
import { ArrowDown } from "lucide-react"
import { useSessions } from "./hooks/useSessions"
import { getContainerHealthWsUrl } from "./utils/containerHealth"
import { startContainerHealthSocket } from "./hooks/startContainerHealthSocket"
import { AgentSelectDropdown } from "@/components/agent/AgentSelectDropdown"
import { containerPubSub } from "./utils/containerPubSub"
import { containerEvents } from "./utils/containerEvents"
import { StartContainerModal } from "@/components/agent/StartContainerModal"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { AgentActions } from "@/components/agent/AgentActions"
import { AgentSkeleton } from "@/components/agent/AgentSkeleton"

export default function AssistantPage() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const startContainerAbortControllerRef = useRef<AbortController | null>(null)
  const { selectedBusiness } = useBusinessStore()
  const {
    promptTemplate,
    containerId,
    containerToken,
    containerStatus,
    sessionId,
    pendingSessionId,
    historyOpen,
    isStreaming,
    selectedAgent,
    showScrollDown,
    renderedSessionId,
    startContainerModal,
    setMessage,
    setPromptTemplate,
    setSelectedAgent,
    setNoouAgents,
    setHistoryOpen,
    setIsStreaming,
    setContainerId,
    setContainerToken,
    setContainerStatus,
    setSessionId,
    setPendingSessionId,
    setMessagesPreview,
    setShowScrollDown,
    setRenderedSessionId,
    setStartContainerModal,
    resetContainer,
    resetSession,
  } = useAgentStore()

  const businessId = selectedBusiness?.id
  const hasBusiness = !!selectedBusiness

  useEffect(() => {
    if (!containerId || !containerToken) return

    const wsUrl = getContainerHealthWsUrl(containerId)

    startContainerHealthSocket(wsUrl, true)
  }, [])

  useEffect(() => {
    const unsubReady = containerPubSub.subscribe(containerEvents.READY, () => {
      setContainerStatus("active")

      if (pendingSessionId) return setSessionId(pendingSessionId)
    })

    const unsubConnecting = containerPubSub.subscribe(containerEvents.CONNECTING, () => {
      setContainerStatus("connecting-ws")
    })

    const unsubStopped = containerPubSub.subscribe(containerEvents.STOPPED, () => {
      setContainerStatus("stopped")
    })

    const unsubError = containerPubSub.subscribe(containerEvents.ERROR, () => {
      setContainerStatus("error")
      resetContainer()
    })

    return () => {
      unsubReady()
      unsubConnecting()
      unsubStopped()
      unsubError()
    }
  }, [])

  useEffect(() => {
    if (containerStatus === "active" && promptTemplate.length > 0) {
      sendMessage(promptTemplate.trim())
      setMessage("")
      setPromptTemplate("")
    }
  }, [containerStatus, promptTemplate])

  const { mutateAsync: startContainer, isPending: loadingContainer } = useMutation({
    mutationKey: ["start-container"],
    mutationFn: (signal?: AbortSignal) => {
      if (!businessId) return
      return createContainer({ business_id: businessId }, signal)
    },
    onSuccess: (data) => {
      setContainerId(data.container_id)
      setContainerToken(data.token)
      setContainerStatus("connecting-ws")

      const wsUrl = getContainerHealthWsUrl(data.container_id)
      startContainerHealthSocket(wsUrl, false)
    },
    onError: (error) => {
      if (error instanceof Error && error.name === "CanceledError") return
      if (error instanceof Error && error.name === "AbortError") return

      setContainerStatus("error")
      toast({
        title: t("common.error"),
        description: t("agent.create-container-error"),
        type: "error",
      })
    },
    onSettled: () => {
      startContainerAbortControllerRef.current = null
    },
  })

  function handleStartContainer() {
    if (["creating", "connecting-ws", "active"].includes(containerStatus)) return

    startContainerAbortControllerRef.current?.abort()

    const controller = new AbortController()
    startContainerAbortControllerRef.current = controller

    setContainerStatus("creating")

    if (!startContainerModal) {
      setStartContainerModal(true)
    }

    containerPubSub.publish(containerEvents.STARTING)

    startContainer(controller.signal)
  }

  // clear sessionId
  useEffect(() => {
    return () => {
      setSessionId(null)
      setPendingSessionId("")
    }
  }, [])

  // get noou agents / get sessions / get session by id
  const { data: noouAgents, isPending: loadingNoouAgents } = useNoouAgents()
  const { data: sessions, isPending: loadingSessions } = useSessions()
  const {
    data: currentSession,
    isPending: loadingSession,
    isError: sessionRunsIsError,
    error: sessionRunsError,
  } = useSessionRuns(containerId, containerToken, sessionId)

  const isLoadingConversation =
    Boolean(sessionId) && loadingSession && renderedSessionId !== sessionId

  useEffect(() => {
    if (!currentSession || isStreaming) return

    const mappedMessages = mapSessionRunsToMessages(currentSession)
    setMessages(mappedMessages)
    setRenderedSessionId(sessionId)
  }, [currentSession])

  useEffect(() => {
    if (noouAgents) {
      setNoouAgents(noouAgents)

      const validateIdentifier = noouAgents?.filter(
        (item) => item.identifier === selectedAgent?.identifier,
      )[0]

      const agentFiltered = selectedAgent?.identifier
        ? validateIdentifier
        : noouAgents.map((item) => item)[0]

      // Adiciona o primeiro item do array no estado selectedAgent
      if (!selectedAgent.name && !selectedAgent.identifier && !pendingSessionId) {
        setSelectedAgent({ name: agentFiltered.name, identifier: agentFiltered.identifier })
      }
    }
  }, [noouAgents, sessionRunsIsError, sessionRunsError])

  useEffect(() => {
    if (!sessionRunsIsError) return

    const status = (sessionRunsError as any)?.status

    if (status === 500 || status === 502) {
      clearSession()
      setContainerStatus("error")
    }
  }, [sessionRunsIsError, sessionRunsError])

  useEffect(() => {
    return () => {
      clearSession()
    }
  }, [])

  // Save container ID to localStorage whenever it changes
  useEffect(() => {
    if (containerId) {
      localStorage.setItem("containerId", containerId)
    } else {
      localStorage.removeItem("containerId")
    }
  }, [containerId])

  // Save container token to localStorage whenever it changes
  useEffect(() => {
    if (containerToken) {
      localStorage.setItem("containerToken", containerToken)
    } else {
      localStorage.removeItem("containerToken")
    }
  }, [containerToken])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function recomputeScrollButton() {
    const el = scrollContainerRef.current
    if (!el) return

    const threshold = 80
    const hasOverflow = el.scrollHeight > el.clientHeight + 1

    if (!hasOverflow) {
      setShowScrollDown(false)
      return
    }

    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold

    setShowScrollDown(!isAtBottom)
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const onScroll = () => recomputeScrollButton()

    el.addEventListener("scroll", onScroll)
    onScroll()

    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // Aguarda o DOM atualizar com os novos messages (histórico/troca de session)
    const raf = requestAnimationFrame(() => {
      recomputeScrollButton()
    })

    return () => cancelAnimationFrame(raf)
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }

  const sendMessage = async (content: string, files?: File[]) => {
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

    abortControllerRef.current = new AbortController()
    setIsStreaming(true)

    try {
      const response = await agentsServices.createAgentRun(
        containerId,
        containerToken,
        selectedAgent.identifier,
        {
          message: content,
          stream: true,
          session_id: sessionId || undefined,
          files: files?.length ? files : undefined,
        },
        abortControllerRef.current.signal,
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

          abortControllerRef.current?.abort()
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
      abortControllerRef.current = null
    }
  }

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }

  function clearSession() {
    resetSession()
    setMessages([])
  }

  function handlePreviewSession() {
    setMessagesPreview([])
    if (messages?.length <= 0) return

    const mappedMessages = mapSessionRunsToMessages(currentSession)
    setMessagesPreview(mappedMessages)

    window.open(`/agent/preview`, "_blank")
    return
  }

  const { mutateAsync: stopContainer } = useMutation({
    mutationFn: () => {
      if (!containerId || !containerToken) return

      return shutdownContainer(containerId, containerToken)
    },
    onSuccess: () => {
      containerPubSub.publish(containerEvents.STOPPED)
      resetContainer()
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to shutdown container",
        type: "error",
      })
    },
  })

  function handleStopContainer() {
    if (!containerId || !containerToken) return
    stopContainer()
  }

  return (
    <div className="relative h-full flex flex-col pt-8 pb-6">
      {(!hasBusiness || loadingNoouAgents || loadingSessions) && <AgentSkeleton />}

      {hasBusiness && !loadingNoouAgents && !loadingSessions && (
        <>
          <div className="px-6 md:px-8">
            <PageHeader
              titleComponent={
                <AgentSelectDropdown agents={noouAgents} onClearSession={clearSession} />
              }
              breadcrumbs={[
                { label: t("nav.home"), href: "/dashboard" },
                { label: t("nav.agent") },
              ]}
            />
          </div>

          <AgentActions
            messages={messages}
            onPreviewSession={handlePreviewSession}
            onStopContainer={handleStopContainer}
            onStartContainer={handleStartContainer}
            clearSession={clearSession}
          />

          <div className="flex flex-1 flex-col overflow-hidden px-6">
            <div className="relative flex-1 overflow-hidden">
              <div ref={scrollContainerRef} className="h-full overflow-y-auto scrollbar">
                {isLoadingConversation && <LoadingMessage />}

                {!isLoadingConversation && (
                  <AgentMessageList
                    messages={messages}
                    isStreaming={isStreaming}
                    noouAgents={noouAgents}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              <AnimatePresence>
                {showScrollDown && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-full bg-gray-300 dark:bg-neutral-500 p-3 shadow-lg cursor-pointer"
                  >
                    <ArrowDown className="text-black dark:text-white size-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="relative shrink-0">
              <InputBar
                disabled={loadingContainer || containerStatus !== "active"}
                onSend={sendMessage}
                isStreaming={isStreaming}
                onStop={stopStreaming}
              />
              <p className="mt-3 text-center text-xs dark:text-[#808080] text-gray-500">
                {t("agent.check-content")}
              </p>
            </div>
          </div>

          <StartContainerModal
            onStartContainer={handleStartContainer}
            abortStartContainerRef={startContainerAbortControllerRef}
          />
          <HistoryDrawer
            open={historyOpen}
            onOpenChange={setHistoryOpen}
            sessions={sessions}
            loadingSessions={loadingSessions}
          />
        </>
      )}
    </div>
  )
}
