import { api } from "../api"
import * as T from "./types"

export const businessServices = {
  getBusiness,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessUsers,
  addUserToBusiness,
  removeUserFromBusiness,
  getUsers,
  deleteUser,
  getCurrentBusiness,
  useBusiness,
}

function getBusiness(): Promise<T.BusinessResponse> {
  return api.get("/business/admin/list")
}

function getBusinessById(businessId: number): Promise<T.BusinessData> {
  return api.get(`/business/${businessId}`)
}

function createBusiness(body: T.CreateBusinessBody): Promise<T.BusinessData> {
  return api.post("/business/admin/create", body)
}

function updateBusiness(businessId: number, body: T.UpdateBusinessBody): Promise<T.BusinessData> {
  return api.put(`/business/admin/${businessId}`, body)
}

function deleteBusiness(businessId: number) {
  return api.delete(`/business/admin/${businessId}`)
}

function getBusinessUsers(businessId: number): Promise<T.BusinessUsersResponse> {
  return api.get(`/business/${businessId}/users`)
}

function addUserToBusiness(body: T.AddUserToBusinessBody): Promise<T.BusinessData> {
  return api.post("/business/add-user", body)
}

function removeUserFromBusiness(body: T.RemoveUserToBusinessBody) {
  return api.post<T.BusinessData>("/business/remove-user", body)
}

function getUsers(businessId: number): Promise<T.BusinessUsersResponse> {
  return api.get(`/business/${businessId}/users`)
}

function deleteUser(body: T.DeleteUserBody): Promise<T.BusinessResponse> {
  return api.post("/business/remove-user", body)
}

function getCurrentBusiness(): Promise<Omit<T.BusinessData, "users">> {
  return api.get("/business/current", {
    headers: {
      "X-Silent-Error": true,
    },
  })
}

function useBusiness(businessId: number): Promise<T.BusinessData> {
  return api.post(`/business/use/${businessId}`)
}
