import i18n from "@/i18n"
import axios, { AxiosError } from "axios"
import { getApiErrorMessage } from "@/utils/handleApiError"
import { toast } from "@/hooks/useToast"
import { config } from "@/config"
import { ApiError } from "./api-error"
import { tokens } from "@/config/tokens"

export const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data
    const message = getApiErrorMessage(error)

    const apiError = new ApiError(message, status, data?.code, data)

    const silent = error.config?.headers?.["X-Silent-Error"]

    if (!silent) {
      switch (status) {
        case 401: {
          const currentPath = window.location.pathname + window.location.search
          localStorage.setItem(tokens.redirectAfterLogin, currentPath)
          window.location.href = "/"

          toast({
            title: i18n.t("common.error"),
            description: i18n.t("global.access-denied-error"),
            type: "error",
          })
          break
        }
        case 403:
          toast({
            title: i18n.t("common.error"),
            description: i18n.t("global.access-denied-error"),
            type: "error",
          })
          break

        case 404:
          toast({
            title: i18n.t("common.error"),
            description: i18n.t("global.resource-not-found-error"),
            type: "error",
          })
          break

        default:
          toast({
            title: i18n.t("common.error"),
            description: message,
            type: "error",
          })
          break
      }
    }

    return Promise.reject(apiError)
  },
)
