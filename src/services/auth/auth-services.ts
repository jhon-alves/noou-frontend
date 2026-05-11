import { api } from "../api"
import * as T from "./types"

export const authServices = {
  login,
  validateOtp,
  resendOtp,
  resetInitialPassword,
  confirmResetPassword,
  logout,
  changePasswordInitiate,
  changePasswordConfirm,
}

function login(body: T.LoginBody) {
  return api.post<T.LoginResponse>("/login", body)
}

function validateOtp(body: T.ValidateOtpBody) {
  return api.post<T.ValidateOtpResponse>("/otp/verify", body)
}

function resendOtp() {
  return api.post("/otp/resend")
}

async function resetInitialPassword(body: T.ResetInitialPasswordBody) {
  await new Promise((res) => setTimeout(res, 2000))
  return api.post<{ message: string }>("/password-reset/initiate", body)
}

function confirmResetPassword(body: T.ConfirmResetPasswordBody) {
  return api.post<{ message: string }>("/password-reset/confirm", body)
}

function changePasswordInitiate() {
  return api.post<{ message: string }>("/password-change/initiate", {})
}

function changePasswordConfirm(body: T.ConfirmResetPasswordBody) {
  return api.post<{ message: string }>("/password-change/confirm", body)
}

function logout() {
  return api.post<{ message: string }>("/logout")
}
