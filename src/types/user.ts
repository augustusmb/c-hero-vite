export type UpdatedUserInfoProducts = {
  name: string
  email: string
  company: string
  vessel: string
  port: string
  id: number
  newlyAddedProducts: string[]
  newlyRemovedProducts: string[]
}

export type User = {
  id: number
  name: string
  email: string
  phone: string
  level: string
  company: string
  vessel: string
  port:  string
  terms_accepted: boolean
};