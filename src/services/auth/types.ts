// Login
export type LoginResponse = {
  temp_token: string
  requires_otp: boolean
}

export type LoginBody = {
  email: string
  password: string
}

// OTP
export type ValidateOtpResponse = {
  access_token: string
  token_type: string
}

export type ValidateOtpBody = {
  otp_code: string
}

// Reset Password
export type ResetInitialPasswordBody = {
  email: string
}

export type ConfirmResetPasswordBody = {
  token: string
  new_password: string
}
