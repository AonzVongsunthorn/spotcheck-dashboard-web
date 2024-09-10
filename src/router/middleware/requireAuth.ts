import type { NavigationGuardNext } from 'vue-router'
import { getOTPVerificationStatus, getProfile } from '../../services/api/auth'
const IS_REQUIRED_OTP = import.meta.env.VITE_IS_REQUIRED_OTP

export default async function requireAuth({ next, authStore }: { next: NavigationGuardNext; authStore: any }) {
  try {
    const user = await getProfile()
    if (!user) {
      return next({
        name: 'login',
      })
    }
    const { data } = user
    if (!data.isAlive) {
      return next({
        name: 'login',
      })
    }
    if (IS_REQUIRED_OTP.toLowerCase() === 'true') {
      const otpVerificationStatus = await getOTPVerificationStatus()
      const { data } = otpVerificationStatus
      const { isPassOTPVerification } = data
      if (!isPassOTPVerification) {
        return next({
          name: 'login',
        })
      }
    }
    const { name, email, role, isAlive, telephoneNo } = data
    authStore.setAuthUser({ name, email, role, isAlive, isDoneOTPVerification: true, telephoneNo })
  } catch (error) {
    console.error('error', error)
    document.location.href = 'login'
  }

  return next()
}
