export type CreateSecretBody = {
  business_id: number
  key: string
  value: string
}
export type SecretResponse = {
  id: number
  business_id: number
  user_id: number
}
// ------------- GET SECRET BY ID -------------
export type GetSecretData = {
  id: number
  business_id: number
  key: string
  user_id: number
  created_at: string
}
// ------------- GET SECRETS BY BUSINESS -------------
export type SecretsByBusinessData = {
  id: number
  business_id: number
  key: string
  user_id: number
  created_at: string
}
export type SecretsByBusinessResponse = SecretsByBusinessData[]

// ------------- CREATE USER SECRET -------------
export type CreateUserSecretBody = {
  business_id: number
  key: string
  value: string
}
// ------------- GET USER SECRETS -------------
export type UserSecretData = {
  id: number
  business_id: number
  key: string
  user_id: number
  created_at: string
}
export type UserSecretsResponse = UserSecretData[]

// ------------- GET SECRET KEYS -------------
export type SecretKeysData = {
  id: number
  key: string
  description: string
  lang: "pt" | "en"
}
export type SecretKeysResponse = SecretKeysData[]
