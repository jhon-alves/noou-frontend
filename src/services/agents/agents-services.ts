import { ApiError } from "../api-error"
import { AgentData, AgentRunBody } from "./types"

// const isDev = import.meta.env.DEV;
// const API_BASE = isDev ? "/agents-proxy" : "https://stg-development.noou.ai";
const PROXY = "/agents-proxy"

export const agentsServices = {
  getAgents,
  getAgentDetails,
  createAgentRun,
  getSessionRun,
}

// Agents
async function getAgents(containerId: string, containerToken: string) {
  const url = `${PROXY}/${containerId}/agents`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(containerToken && { "X-Container-Token": containerToken }),
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch agents")
  }

  const data = (await response.json()) as AgentData[]
  return data
}

function getAgentDetails(containerId: string, containerToken: string, agent_id: string) {
  const url = `${PROXY}/${containerId}/agents/${agent_id}`

  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(containerToken && { "X-Container-Token": containerToken }),
    },
    credentials: "include",
  })
}

function createAgentRun(
  containerId: string,
  containerToken: string,
  agentId: string = "assistant",
  body: AgentRunBody,
  signal?: AbortSignal,
) {
  const formData = new FormData()

  formData.append("message", body.message)
  formData.append("stream", String(body.stream))

  if (body.session_id) {
    formData.append("session_id", body.session_id)
  }

  if (body.files && body.files.length > 0) {
    body.files.forEach((file) => {
      formData.append("files", file)
    })
  }

  const url = `${PROXY}/${containerId}/agents/${agentId}/runs`

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      ...(containerToken && { "X-Container-Token": containerToken }),
    },
    body: formData,
    signal,
  })
}

// Sessions
async function getSessionRun(containerId: string, containerToken: string, sessionId: string) {
  const url = `${PROXY}/${containerId}/sessions/${sessionId}/runs`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(containerToken && { "X-Container-Token": containerToken }),
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = new ApiError("Failed to fetch session run", response.status)
    error.status = response.status
    throw error
  }

  return response.json()
}
