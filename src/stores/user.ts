import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosResponse } from 'axios'
import { loginUser, fetchUserProfile, logoutUser, updateUserProfile } from '@/apis'
import type { UserProfile, UpdateProfileRequest, LoginRequest, LoginResponse } from '@/apis'
import { useRouter } from 'vue-router'

export enum PermissionEnum {
    SUPERADMIN = '超级管理员',
    ADMIN = '管理员',
    STAFF = '工作人员',
    VISITOR = '访客'
}

export const useUserStore = defineStore(
  'user',
  () => {
    // User information
    const userInfo = ref<UserProfile>({
      id: null,
      last_name: '',
      email: '',
      phone: '',
      first_name: '',
      is_staff: false,
      is_superuser: false,
      date_joined: '',
      is_active: false,
      is_admin: false,
      password: '',
      username: ''
    })

    const isLoggedIn = ref<boolean>(false)

    const token = ref<string | null>(null)

    const orderAuth = ref<any>(null) // You should define the type for orderAuth if possible

    const router = useRouter() // Assuming this is correctly typed by the 'vue-router' module

    const permission = computed<PermissionEnum>(() => {
      if(!isLoggedIn.value){
        return PermissionEnum.VISITOR
      }
      if(userInfo.value.is_superuser) return PermissionEnum.SUPERADMIN;
      if(userInfo.value.is_admin) return PermissionEnum.ADMIN;
      if(userInfo.value.is_staff) return PermissionEnum.STAFF;

      return PermissionEnum.VISITOR
    })

    const showNav = (p?:PermissionEnum[],no_p?:PermissionEnum[]):boolean => {
      if(p === undefined && no_p === undefined) {
        return true
      }else{
        if(no_p !== undefined && no_p.findIndex((i: PermissionEnum)=>i === permission.value) > -1) return false;
        if(p === undefined) return true;
        return p.findIndex((i: PermissionEnum)=>i === permission.value) > -1
      }
    }

    const logout = async () => {
      token.value = null
      userInfo.value = {
        id: null,
        last_name: '',
        email: '',
        phone: '',
        first_name: '',
        is_staff: false,
        is_superuser: false,
        date_joined: '',
        is_active: false,
        is_admin: false,
        password: '',
        username: ''
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
        fetchProfile()
      } catch (error: any) {
        ElMessage.error(`Login failed: ${error.toString()}`)
      }
    }

    const initializeFromToken = () => {
      if (token.value) {
        isLoggedIn.value = true
        fetchProfile() // Optionally fetch users info based on the token
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
      initializeFromToken,
      permission,
      showNav
    }
  },
  {
    persist: true
  }
)
