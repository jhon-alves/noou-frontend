export type MePermissions = {
  id: number
  name: string
  scope: string
  description: string
}

export type MeRoles = {
  id: number
  name: string
  description: string
  permissions: MePermissions
}

export type MeBusinesses = {
  name: string
  id: number
}

export type MeData = {
  id: number
  name: string
  email: string
  status: string
  is_active: boolean
  is_superuser: boolean
  current_business_id: number
  roles: MeRoles[]
  all_scopes: string[]
  businesses: MeBusinesses[]
}

export type MeResponse = MeData

export type AcceptBusinessInviteBody = {
  invitation_token: string
  name: string
  password: string
}

export type UpdateUserBody = {
  name?: string
  email?: string
  is_active?: boolean
}

export type UpdateUserResponse = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_superuser: boolean
  status: string
}
