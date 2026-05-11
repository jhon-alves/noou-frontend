import { ApiErrorResponse } from "@/services/api-error"
import { AxiosError } from "axios"

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined

    // Fallback to erros with msg/type/loc
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0]
      return first.msg
    }

    // Fallback to errors (400, 403, 423, etc)
    if (typeof data?.detail === "string") {
      return data.detail
    }

    // Fallback Axios
    return error.message || "An unexpected error occurred."
  }

  // Fallback generic
  if (error instanceof Error) {
    return error.message
  }

  return "Unknown error."
}
