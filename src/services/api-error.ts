export type ValidationErrorDetail = {
  loc: (string | number)[]
  msg: string
  type: string
}

export type ApiErrorResponse =
  | { detail: string; status_code?: number }
  | { detail: ValidationErrorDetail[] }

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}
