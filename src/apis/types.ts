// Define request and response types for each API call
export interface LoginRequest {
  username: string
  password: string
}

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

export interface UserProfile {
  id: string
  last_name: string
  email: string
  phone_number: string
  first_name: string
  address: string
}

export interface UpdateProfileRequest {
  // Define properties you want to allow updating
  // For example:
  last_name?: string
  email?: string
  phone_number?: string
  first_name?: string
  address?: string
}
