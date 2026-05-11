export type UserAdminPermissions = {
  id: number
  name: string
  scope: string
  description?: string | null
}

export type UserAdminRoles = {
  id: number
  name: string
  description?: string | null
  permisssions: UserAdminPermissions
}

export type UserAdminBusiness = {
  id: number
  name: string
}

export type UserAdminData = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_superuser: boolean
  status: string
}

export type AdminUsersResponse = UserAdminData[]

export type CreateUserAdminBody = {
  name: string
  email: string
  password: string
  business_ids: number[]
  is_active: boolean
}

export type UpdateUserAdminBody = {
  name?: string
  email: string
  is_active: boolean
}
