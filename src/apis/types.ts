// Define request and response types for each API call
import type { User } from '@/apis/users/types'

export interface LoginRequest {
  username: string
  password: string
}

export type PK = number | null

export interface LoginResponse {
  access: string
}

export interface RegisterRequest {
  // Define properties according to your registration data structure
  // For example:
  username: string
  password: string
  email: string
  confirmPassword: string
}

export type UserProfile = User

export interface UpdateProfileRequest {
  // Define properties you want to allow updating
  // For example:
  last_name?: string
  email?: string
  phone_number?: string
  first_name?: string
  address?: string
}

export type Optionalize<T> = {
  [P in keyof T]?: T[P]
}

export type GetParams<T = {}> = {
  [P in keyof T]?: T[P]
} & {
  page?: number
  page_size?: number
  keyword?: string
}
