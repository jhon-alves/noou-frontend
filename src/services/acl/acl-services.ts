import { api } from "../api"
import * as T from "./types"

export const aclServices = {
  getRoles,
  createRole,
  assignRolesToUser,
  revokeRolesFromUser,
  getUserRoles,
}

function getRoles(): Promise<T.RolesResponse> {
  return api.get("/acl/roles")
}

function createRole(body: T.CreateRoleBody) {
  return api.post<T.RolesData>("/acl/roles", body)
}

function assignRolesToUser(body: T.AssignRolesBody) {
  return api.post<string>("/acl/assign-roles", body)
}

function revokeRolesFromUser(body: T.RevokeRolesBody) {
  return api.post<string>("/acl/revoke-roles", body)
}

function getUserRoles(businessId: number, userId: number): Promise<T.UserRolesResponse> {
  return api.get(`/acl/user-roles/${businessId}/${userId}`)
}
