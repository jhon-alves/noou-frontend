import { motion, AnimatePresence } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Message } from "./types/agent-types"
import { InputBar } from "@/components/agent/InputBar"
import { AgentMessageList } from "@/components/agent/message/AgentMessageList"
import { PageHeader } from "@/components/shared/PageHeader"
import { useTranslation } from "react-i18next"
import { useAgentStore } from "@/stores/useAgentStore"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/hooks/useToast"
import { useNoouAgents } from "./hooks/useNoouAgents"
import { createContainer } from "@/services/container/container-services"
import { HistoryDrawer } from "@/components/agent/history/HistoryDrawer"
import { useSessionRuns } from "./hooks/useSessionRuns"
import { mapSessionRunsToMessages } from "./utils/mapSessionRunsToMessages"
import { LoadingMessage } from "@/components/agent/LoadingMessage"
import { ArrowDown } from "lucide-react"
import { useSessions } from "./hooks/useSessions"
import { getContainerHealthWsUrl } from "./utils/containerHealth"
import { startContainerHealthSocket } from "./hooks/startContainerHealthSocket"
import { containerPubSub } from "./utils/containerPubSub"
import { containerEvents } from "./utils/containerEvents"
import { StartContainerModal } from "@/components/agent/StartContainerModal"
import { useContainerLifecycle } from "./hooks/useContainerLifecycle"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { AgentActions } from "@/components/agent/AgentActions"
import { useAgentChat } from "./hooks/useAgentChat"
import { cn } from "@/lib/utils"

export default function AssistantPage() {
  useContainerLifecycle()
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const { selectedBusiness } = useBusinessStore()
  const { sendMessage, stopStreaming } = useAgentChat({ setMessages })
  const {
    promptTemplate,
    containerId,
    containerToken,
    containerStatus,
    sessionId,
    pendingSessionId,
    isStreaming,
    selectedAgent,
    showScrollDown,
    renderedSessionId,
    startContainerModal,
    setMessage,
    setPromptTemplate,
    setSelectedAgent,
    setNoouAgents,
    setContainerId,
    setContainerToken,
    setContainerStatus,
    setMessagesPreview,
    setShowScrollDown,
    setRenderedSessionId,
    setStartContainerModal,
    resetSession,
  } = useAgentStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const abortContainerRef = useRef<AbortController | null>(null)

  const businessId = selectedBusiness?.id
  const hasBusiness = !!selectedBusiness

  const { mutateAsync: startContainer, isPending: loadingContainer } = useMutation({
    mutationKey: ["create-container"],
    mutationFn: (signal?: AbortSignal) => {
      if (!businessId) return
      return createContainer({ business_id: businessId }, signal)
    },
  })

  const handleStartContainer = useCallback(async () => {
    if (["creating", "connecting-ws", "active"].includes(containerStatus)) return

    abortContainerRef.current?.abort()

    const controller = new AbortController()
    abortContainerRef.current = controller

    setContainerStatus("creating")

    if (!startContainerModal) {
      setStartContainerModal(true)
    }

    containerPubSub.publish(containerEvents.STARTING)

    try {
      const data = await startContainer(controller.signal)

      setContainerId(data.container_id)
      setContainerToken(data.token)
      setContainerStatus("connecting-ws")

      const wsUrl = getContainerHealthWsUrl(data.container_id)
      startContainerHealthSocket(wsUrl, false)
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CanceledError" || error.name === "AbortError")
      ) {
        return
      }

      setContainerStatus("error")
      toast({
        title: t("common.error"),
        description: t("agent.create-container-error"),
        type: "error",
      })
    } finally {
      abortContainerRef.current = null
    }
  }, [containerStatus, startContainerModal, startContainer])

  useEffect(() => {
    const isIdle = !["creating", "connecting-ws", "active"].includes(containerStatus)

    if (startContainerModal && isIdle) {
      handleStartContainer()
    }
  }, [startContainerModal, containerStatus, handleStartContainer])

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

  const isChatActive = messages.length > 0 || isLoadingConversation

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
    if (containerStatus === "active" && promptTemplate.length > 0) {
      sendMessage(promptTemplate.trim())
      setMessage("")
      setPromptTemplate("")
    }
  }, [containerStatus, promptTemplate])

  useEffect(() => {
    return () => {
      clearSession()
    }
  }, [])

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  // }, [messages])

  useEffect(() => {
    const bottomElement = messagesEndRef.current
    const scrollContainer = scrollContainerRef.current

    if (!bottomElement || !scrollContainer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollDown(!entry.isIntersecting)
      },
      {
        root: scrollContainer,
        rootMargin: "300px",
        threshold: 0,
      },
    )

    observer.observe(bottomElement)

    return () => {
      observer.disconnect()
    }
  }, [isChatActive, sessionId])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
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

  return (
    <div className="relative h-full flex flex-col pt-8 pb-6">
      {(!hasBusiness || loadingNoouAgents || loadingSessions) && <LoadingMessage />}

      {hasBusiness && !loadingNoouAgents && !loadingSessions && (
        <>
          <div className="px-6 md:px-8">
            <PageHeader
              title={selectedAgent?.name}
              breadcrumbs={[
                { label: t("nav.home"), href: "/dashboard" },
                { label: t("nav.agent") },
              ]}
            >
              <AgentActions
                agents={noouAgents}
                messages={messages}
                onPreviewSession={handlePreviewSession}
                onStartContainer={handleStartContainer}
                clearSession={clearSession}
              />
            </PageHeader>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden px-6">
            <div
              className={cn(
                "flex flex-col flex-1 overflow-hidden",
                !isChatActive ? "justify-center" : "justify-baseline",
              )}
            >
              <AnimatePresence mode="popLayout">
                {!isChatActive ? (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-full text-center mb-8"
                  >
                    <p className="text-5xl font-light text-neutral-800 dark:text-neutral-100">
                      {t("agent.welcome-message")}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="relative flex-1 overflow-hidden flex flex-col w-full"
                  >
                    <div
                      ref={scrollContainerRef}
                      className={cn(
                        "h-full overflow-y-auto [overflow-anchor:none]",
                        isStreaming ? "scrollbar-hide" : "scrollbar",
                      )}
                    >
                      {isLoadingConversation && <LoadingMessage />}

                      {!isLoadingConversation && (
                        <AgentMessageList
                          messages={messages}
                          isStreaming={isStreaming}
                          noouAgents={noouAgents}
                        />
                      )}

                      <div ref={messagesEndRef} className="[overflow-anchor:auto] h-px shrink-0" />
                    </div>

                    <AnimatePresence>
                      {showScrollDown && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          onClick={scrollToBottom}
                          className={cn(
                            "absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-gray-300 dark:bg-neutral-500",
                            "rounded-full p-3 shadow-lg cursor-pointer",
                            isStreaming ? "hidden" : "block",
                          )}
                        >
                          <ArrowDown className="text-black dark:text-white size-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                layout
                initial={false}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.6,
                }}
                className={cn(
                  "w-full relative shrink-0 mx-auto px-5",
                  !isChatActive ? "max-w-5xl" : "max-w-full",
                )}
              >
                <div className="absolute bottom-full left-0 w-full h-8 pointer-events-none bg-linear-to-t from-[#FAFAFA] to-transparent dark:from-foreground" />
                <InputBar
                  disabled={loadingContainer || containerStatus !== "active"}
                  onSend={sendMessage}
                  isStreaming={isStreaming}
                  onStop={stopStreaming}
                />

                <AnimatePresence>
                  {isChatActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-3 text-center text-xs text-neutral-300 overflow-hidden"
                    >
                      {t("agent.check-content")}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <StartContainerModal abortStartContainerRef={abortContainerRef} />
          <HistoryDrawer
            noouAgents={noouAgents}
            sessions={sessions}
            loadingSessions={loadingSessions}
          />
        </>
      )}
    </div>
  )
}
