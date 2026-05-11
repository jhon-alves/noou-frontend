import { api } from "../api"
import * as T from "./types"

export const userAdminServices = {
  updateAdminUser,
  resetAdminPassword,
}

function updateAdminUser(userId: number, body: T.UpdateUserAdminBody): Promise<T.UserAdminData> {
  return api.put(`/user/admin/${userId}`, body)
}

function resetAdminPassword(
  userId: number,
  body: { new_password: string },
): Promise<T.UserAdminData> {
  return api.post(`/user/admin/${userId}/reset-password`, body)
}
