export type MemoryData = {
  memory_id: string
  memory: string
  input: string
  agent_id: string
  topics: string
  feedback: string
  created_at: number
  updated_at: number
}

export type MemoriesResponse = {
  items: MemoryData[]
}
