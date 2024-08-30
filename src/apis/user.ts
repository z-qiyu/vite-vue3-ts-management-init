// Login API call
import type { AxiosResponse } from 'axios'
import api from '@/apis/instance'
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, UserProfile } from '@/apis/types'

export async function loginUser(data: LoginRequest): Promise<AxiosResponse<{ access: string }>> {
  return api.post('/login/', data)
}

// Register API call (if needed)
export async function registerUser(data: RegisterRequest): Promise<AxiosResponse<void>> {
  return api.post('/register/', data)
}

// Fetch users profile
export async function fetchUserProfile(): Promise<AxiosResponse<UserProfile>> {
  return api.get('/profile/')
}

// Update users profile
export async function updateUserProfile(
  token: string,
  data: UpdateProfileRequest
): Promise<AxiosResponse<UserProfile>> {
  return api.put('/profile/', data)
}

// Logout API call
export async function logoutUser(): Promise<AxiosResponse<void>> {
  return api.post('/logout/')
}
