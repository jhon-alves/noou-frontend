// Permissions
export type PermissionsData = {
  id: number
  name: string
  scope: string
  description?: string | null
}

// Roles
export type RolesData = {
  id: number
  name: string
  description?: string | null
  permissions: PermissionsData
}

export type UserRolesData = {
  id: number
  name: string
  is_active: boolean
  description?: string | null
}

export type UserRolesResponse = {
  user_id: number
  roles: UserRolesData[]
}

export type RolesResponse = RolesData[]

export type CreateRoleBody = {
  name: string
  description?: string | null
  permission_ids: number[]
}

export type AssignRolesBody = {
  user_id: number
  role_ids: number[]
  business_id: number
}

export type RevokeRolesBody = {
  user_id: number
  role_ids: number[]
  business_id: number
}
