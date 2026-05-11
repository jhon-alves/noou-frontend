export type Provider = "google" | "gemini" | "openai"

export type IntegrationData = {
  provider: string
  is_configured: boolean
  is_valid: boolean
  message: string
  scopes: string[]
}
