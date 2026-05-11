export type BusinessData = {
  id: number
  name: string
  email: string
  description: string
  address: string
  phone: string
  is_active: boolean
  users: {
    id: number
    name: string
    email: string
    status: string
    is_active: boolean
  }[]
}
export type BusinessResponse = BusinessData[]

export type BusinessUsersData = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_superuser: boolean
  roles: {
    id: number
    name: string
  }[]
}
export type BusinessUsersResponse = BusinessUsersData[]

export type DeleteUserBody = {
  business_id: number
  user_id: number
}

export type CreateBusinessBody = {
  name: string
  description?: string
  email?: string
  address?: string
  phone?: string
  is_active: boolean
}

export type UpdateBusinessBody = {
  name?: string
  description?: string
  email?: string
  address?: string
  phone?: string
  is_active?: boolean
}

export type AddUserToBusinessBody = {
  user_email: string
  business_id: number
}

export type RemoveUserToBusinessBody = {
  user_id: number
  business_id: number
}
