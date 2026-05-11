import { Message } from "@/pages/agent/types/agent-types"
import { NoouAgentData } from "@/services/agents/types"
import { create } from "zustand"

export type ContainerStatus =
  | "stopped" // vermelho
  | "creating" // vermelho piscando
  | "connecting-ws" // amarelo piscando
  | "active" // verde
  | "error"

type SelectAgent = {
  name: string
  identifier: string
}

type AgentStore = {
  // Core
  containerId: string
  containerToken: string
  containerStatus: ContainerStatus
  sessionId: string
  pendingSessionId: string
  renderedSessionId: string | null
  message: string
  messagesPreview: Message[]
  promptTemplate: string
  setContainerId: (id: string) => void
  setContainerToken: (token: string) => void
  setContainerStatus: (status: ContainerStatus) => void
  setSessionId: (id: string) => void
  setPendingSessionId: (id: string) => void
  setRenderedSessionId: (session: string | null) => void
  setMessage: (message: string) => void
  setMessagesPreview: (m: Message[]) => void
  setPromptTemplate: (prompt: string) => void
  resetContainer: () => void
  resetSession: () => void

  // UI
  isConfigOpen: boolean
  isMemoryOpen: boolean
  isStreaming: boolean
  historyOpen: boolean
  showScrollDown: boolean
  setIsConfigOpen: (open: boolean) => void
  setIsMemoryOpen: (open: boolean) => void
  setIsStreaming: (value: boolean) => void
  setHistoryOpen: (open: boolean) => void
  setShowScrollDown: (view: boolean) => void

  // Agents & Messages
  noouAgents: NoouAgentData[]
  selectedAgent: SelectAgent
  setSelectedAgent: (selectedAgent: SelectAgent) => void
  setNoouAgents: (noouAgents: NoouAgentData[]) => void

  startContainerModal: boolean
  setStartContainerModal: (value: boolean) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  // Core
  containerId: localStorage.getItem("containerId") || "",
  containerToken: localStorage.getItem("containerToken") || "",
  containerStatus: "stopped",
  sessionId: localStorage.getItem("sessionId") || "",
  pendingSessionId: "",
  renderedSessionId: null,
  message: "",
  messagesPreview: JSON.parse(localStorage.getItem("messagesPreview") || "[]"),
  promptTemplate: "",
  setContainerId: (containerId) => {
    localStorage.setItem("containerId", containerId)
    set({ containerId })
  },
  setContainerToken: (containerToken) => {
    localStorage.setItem("containerToken", containerToken)
    set({ containerToken })
  },
  setContainerStatus: (containerStatus) => set({ containerStatus }),
  setSessionId: (sessionId) => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId)
      set({ sessionId })
      return
    }

    localStorage.removeItem("sessionId")
    set({ sessionId: "" })
  },
  setPendingSessionId: (pendingSessionId) => set({ pendingSessionId }),
  setRenderedSessionId: (renderedSessionId) => set({ renderedSessionId }),
  setMessage: (message) => set({ message }),
  setMessagesPreview: (data) => {
    localStorage.setItem("messagesPreview", JSON.stringify(data))
    set({ messagesPreview: data })
  },
  setPromptTemplate: (promptTemplate) => set({ promptTemplate }),
  resetContainer: () => {
    set({
      containerId: "",
      containerToken: "",
      containerStatus: "stopped",
      sessionId: "",
      message: "",
      showScrollDown: false,
      renderedSessionId: null,
      startContainerModal: false,
    })
    localStorage.removeItem("containerId")
    localStorage.removeItem("containerToken")
    localStorage.removeItem("sessionId")
  },
  resetSession: () => {
    set({
      sessionId: "",
      showScrollDown: false,
      renderedSessionId: null,
      message: "",
    })
    localStorage.removeItem("sessionId")
  },

  // UI
  isStreaming: false,
  isConfigOpen: false,
  isMemoryOpen: JSON.parse(localStorage.getItem("memoryPanelOpen") || "false"),
  historyOpen: false,
  showScrollDown: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsConfigOpen: (isConfigOpen) => set({ isConfigOpen }),
  setIsMemoryOpen: (isMemoryOpen) => {
    localStorage.setItem("memoryPanelOpen", JSON.stringify(isMemoryOpen))
    set({ isMemoryOpen })
  },
  setHistoryOpen: (historyOpen) => set({ historyOpen }),
  setShowScrollDown: (showScrollDown) => set({ showScrollDown }),

  // Agents & Messages
  noouAgents: [],
  selectedAgent: {
    name: "",
    identifier: "",
  },
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
  setNoouAgents: (noouAgents) => set({ noouAgents }),

  startContainerModal: false,
  setStartContainerModal: (startContainerModal) => set({ startContainerModal }),
}))
