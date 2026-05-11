import { api } from "../api"
import {
  SecretsByBusinessResponse,
  UserSecretsResponse,
  SecretKeysResponse,
  SecretResponse,
  GetSecretData,
  CreateSecretBody,
  CreateUserSecretBody,
} from "./types"

export const secretServices = {
  getSecretsByBusiness,
  getUserSecrets,
  getSecretById,
  createSecret,
  createUserSecret,
  deleteSecret,
  getSecretKeys,
}

function getSecretsByBusiness(
  businessId: number,
  skip: number = 0,
  limit: number = 100,
  includeUserSecrets: boolean = false,
): Promise<SecretsByBusinessResponse> {
  const url = `/secret/business/${businessId}?skip=${skip}&limit=${limit}&include_user_secrets=${includeUserSecrets}`
  return api.get(url)
}

function getUserSecrets(
  businessId: number,
  skip: number = 0,
  limit: number = 100,
): Promise<UserSecretsResponse> {
  const url = `/secret/user/business/${businessId}?skip=${skip}&limit=${limit}`
  return api.get(url)
}

function getSecretById(secretId: number) {
  return api.get<GetSecretData>(`/secret/${secretId}`)
}

function createSecret(body: CreateSecretBody): Promise<SecretResponse> {
  return api.post("/secret/", body)
}

function createUserSecret(body: CreateUserSecretBody): Promise<SecretResponse> {
  return api.post("/secret/user", body)
}

function deleteSecret(secretId: number) {
  return api.delete(`/secret/${secretId}`)
}

function getSecretKeys(lang: string = "en"): Promise<SecretKeysResponse> {
  return api.get(`/secret/keys?lang=${lang}`)
}
