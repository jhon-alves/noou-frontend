import { api } from "../api"
import { MemoriesResponse, MemoryData } from "./types"

export const memoriesServices = {
  getMemories,
  getMemoryById,
  deleteMemory,
}

function getMemories(): Promise<MemoriesResponse> {
  return api.get("/memories/")
}

function getMemoryById(memoryId: string): Promise<MemoryData> {
  return api.get(`/memories/${memoryId}`)
}

function deleteMemory(memoryId: string) {
  return api.delete(`/memories/${memoryId}`)
}
