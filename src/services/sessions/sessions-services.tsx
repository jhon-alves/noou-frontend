import { api } from "../api"
import { SessionsResponse, SessionData } from "./types"

export const sessionsServices = {
  getSessions,
  getSessionById,
  deleteSession,
}

function getSessions(): Promise<SessionsResponse> {
  return api.get("/sessions")
}

function getSessionById(sessionId: string): Promise<SessionData> {
  return api.get(`/sessions/${sessionId}`)
}

function deleteSession(sessionId: string) {
  return api.delete(`/sessions/${sessionId}`)
}
