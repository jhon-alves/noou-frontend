import { api } from "../api"
import * as T from "./types"

export const userServices = {
  getMe,
  updateUser,
  acceptBusinessInvite,
}

function getMe(): Promise<T.MeResponse> {
  return api.get("/user/me", {
    headers: {
      "X-Silent-Error": "true",
    },
  })
}

function updateUser(userId: number, body: T.UpdateUserBody): Promise<T.UpdateUserResponse> {
  return api.put(`/user/${userId}`, body)
}

function acceptBusinessInvite(body: T.AcceptBusinessInviteBody): Promise<T.MeData> {
  return api.post("/user/accept-invitation", body)
}
