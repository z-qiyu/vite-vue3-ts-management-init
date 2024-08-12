import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosResponse } from 'axios'
import { loginUser, fetchUserProfile, logoutUser, updateUserProfile } from '@/apis'
import type { UserProfile, UpdateProfileRequest, LoginRequest, LoginResponse } from '@/apis'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'user',
  () => {
    // User information
    const userInfo = ref<UserProfile>({
      id: '',
      last_name: '',
      email: '',
      phone_number: '',
      first_name: '',
      address: ''
    })

    const isLoggedIn = ref<boolean>(false)

    const token = ref<string | null>(null)

    const orderAuth = ref<any>(null) // You should define the type for orderAuth if possible

    const router = useRouter() // Assuming this is correctly typed by the 'vue-router' module

    const logout = async () => {
      token.value = null
      userInfo.value = {
        id: '',
        last_name: '',
        email: '',
        phone_number: '',
        first_name: '',
        address: ''
      }
      orderAuth.value = null
      isLoggedIn.value = false
      // Assuming logoutUser is an API call that requires no parameters and returns void
      await logoutUser()
    }

    const fetchProfile = () => {
      fetchUserProfile()
        .then((res: AxiosResponse<UserProfile>) => {
          userInfo.value = res.data
        })
        .catch((e: Error) => {
          ElMessage.error(`Failed to fetch user profile: ${e.toString()}`)
        })
    }

    const login = async (username: string, password: string) => {
      try {
        const response: AxiosResponse<LoginResponse> = await loginUser({ username, password })
        const { access } = response.data
        token.value = access
        isLoggedIn.value = true
      } catch (error: any) {
        ElMessage.error(`Login failed: ${error.toString()}`)
      }
    }

    const initializeFromToken = () => {
      if (token.value) {
        isLoggedIn.value = true
        fetchProfile() // Optionally fetch user info based on the token
      }
    }

    const updateProfile = async (profileData: UpdateProfileRequest) => {
      try {
        const response: AxiosResponse<UserProfile> = await updateUserProfile(
          token.value!,
          profileData
        )
        userInfo.value = response.data
        ElMessage.success('Profile updated successfully')
      } catch (error: any) {
        ElMessage.error(`Failed to update profile: ${error.toString()}`)
      }
    }

    return {
      userInfo,
      isLoggedIn,
      token,
      orderAuth,
      login,
      logout,
      fetchProfile,
      updateProfile,
      initializeFromToken
    }
  },
  {
    persist: true
  }
)
