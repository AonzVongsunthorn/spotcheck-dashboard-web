import { RequestOTPResult, User } from '../services/api/auth/api.interface'
import { defineStore } from 'pinia'
import { login, requestOTP, verifyOTP } from '../services/api/auth'

export type AuthStoreState = {
  authUser: User | null
}

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => {
    return {
      email: 'v.jaturong@gmail.com',
      password: '123456',
      isRememberSession: false,
      isLoading: false,
      otp: '',
      otpRequest: {
        telephoneNo: '',
        ref: '',
        status: '',
        lastRequest: '',
        isFromCache: '',
      } as RequestOTPResult,
      authUser: {
        name: '',
        role: '',
        email: '',
        telephoneNo: '',
        isActive: false,
        isPassOTPValidation: false,
      },
    }
  },
  getters: {
    getLoggedInUserFullName(state) {
      return state?.authUser?.name || ''
    },
    getLoggedInUserRole(state) {
      return state?.authUser?.role || ''
    },
  },
  actions: {
    async loginWithAPI(email, password) {
      return login({ email, password })
    },
    async requestOTPWithAPI() {
      const result = await requestOTP()
      this.otpRequest = result.data
    },
    async verifyOTPWithAPI() {
      return await verifyOTP(this.otp)
    },
    enableLoading() {
      this.isLoading = true
    },
    disableLoading() {
      this.isLoading = false
    },
    isSessionAlive() {
      return this.authUser?.isActive || false
    },
    setAuthUser(user) {
      this.authUser = user
    },
    resetFormInformation() {
      this.email = ''
      this.password = ''
      this.otp = ''
    },
  },
})
