<template>
  <loading v-model:active="isLoading" :is-full-page="true"/>
  <div class="bg-[#0F1342] min-h-screen flex items-center justify-center login-page">
    <div class="bg-[#979ab738] rounded-3xl px-14 py-16 absolute">
      <div class="flex flex-col items-center">
        <img src="/logo.png" class="w-36" />
        <div class="text-white my-3 text-center">
          <h1 class="text-lg font-bold uppercase">SpotCheck Dashboard</h1>
          <h2 class="uppercase">Thailand Department Of Highway</h2>
          <hr>
          <p class="uppercase mt-3">กรุณากรอก Email และ Password เพื่อเข้าระบบ</p>
        </div>
      </div>
      <div class="mb-3">
        <input type="text" v-model="email" class="h-10 rounded-full p-4 w-full" placeholder="USERNAME" />
      </div>
      <div class="mb-3">
        <input type="password" v-model="password" class="h-10 rounded-full p-4 w-full" placeholder="PASSWORD" />
      </div>
      <div class="ml-5 my-2">
        <input type="checkbox" id="isRememberSession" v-model="isRememberSession" />
        <label for="isRememberSession" class="text-white ml-1">Keep me signed in</label>
      </div>
      <button class="bg-[#0F1342] rounded-full px-3 py-2 text-white uppercase font-bold w-full" @click="login()">Log in</button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../../../stores/authStore'
  import { LOGIN_EVENT_TITLE, LOGOUT_EVENT_TITLE, SERVICE_NAME, SESSION_TOKEN_KEY } from '../../../constants'
  import { saveUserLog } from '../../../services/api/log'
  import { createToast } from 'mosha-vue-toastify'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';

  const IS_REQUIRED_OTP = import.meta.env.VITE_IS_REQUIRED_OTP

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const { email, password, isRememberSession, isLoading } = storeToRefs(authStore)

  async function login() {
    if (!loginValidation(email.value, password.value)) {
      return
    }
    authStore.enableLoading()
    const loginResult = await authStore.loginWithAPI(email.value, password.value)
    authStore.disableLoading()
    if (!loginResult.isSuccess) {
      createToast(t('auth.userNotFound'), {
        position: 'top-right',
        type: 'danger',
      })
      return
    }
    localStorage.setItem(SESSION_TOKEN_KEY, loginResult.response.data.access_token)
    await saveUserLog({
      service: SERVICE_NAME,
      event: LOGIN_EVENT_TITLE,
    })
    if (IS_REQUIRED_OTP.toLowerCase() === 'true') {
      router.push({ name: 'otp' })
      return
    }
    createToast(t('auth.loggedInSuccessfully'), {
      position: 'top-right',
      type: 'success',
    })
    router.push({ name: 'realtime' })

  }

  function loginValidation(email: string, password: string) {
    if (email.length === 0) {
      createToast('โปรดกรอก email', {
        position: 'top-right',
        type: 'danger',
      })
      return false
    }
    if (password.length === 0) {
      createToast('โปรดกรอก รหัสผ่าน', {
        position: 'top-right',
        type: 'danger',
      })
      return false
    }
    return true
  }

  onMounted(async () => {
    if (localStorage.getItem(SESSION_TOKEN_KEY)) {
      console.log('saving user log ....')
      await saveUserLog({
        service: SERVICE_NAME,
        event: LOGOUT_EVENT_TITLE,
      })
      localStorage.removeItem(SESSION_TOKEN_KEY)
    }
    authStore.setAuthUser({
      name: '',
      role: '',
      email: '',
      id: 0,
      isActive: false,
      telephoneNo: '',
      isDoneOTPVerification: false,
    })
  })
</script>
<style>
  .text-red {
    color: red;
  }
  .text-blue {
    color: #2C315C
  }
</style>
