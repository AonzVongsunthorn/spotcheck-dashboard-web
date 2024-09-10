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
          <p class="uppercase mt-3">ระบบได้รหัสผ่านครั้งเดียว (OTP) ผ่าน
            {{ (otpRequest.telephoneNo || '').replace((otpRequest.telephoneNo || '').substring(4, 7), '***') }}
          </p>
          <p>
            โดยมีรหัสอ้างอิงคือ {{ otpRequest.ref }}
          </p>
        </div>
      </div>
      <div class="mb-3">
        <input type="text" v-model="otp" class="h-10 rounded-full p-4 w-full" placeholder="ระบบได้รหัสผ่านครั้งเดียว (OTP)" />
      </div>
      <button class="bg-[#0F1342] rounded-full px-3 py-2 text-white uppercase font-bold w-full" @click="verifyOTP()">{{ t('auth.otpBtn') }}</button>
      <div class="d-flex justify-center mt-3">
        <va-button color="#FF1C3E" @click="backToLoginPage">{{ t('auth.backToLoginPage') }}</va-button>
        <va-button class="ml-1" color="#449ADB" @click="resendOTP">{{ t('auth.retryOTPBtn') }}</va-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../../../stores/authStore'
  import {
    GO_TO_OTP_PAGE,
    SERVICE_NAME,
    SESSION_TOKEN_KEY,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_WITH_ERROR,
  } from '../../../constants'
  import { saveUserLog } from '../../../services/api/log'
  import { getProfile } from '../../../services/api/auth'
  import { createToast } from 'mosha-vue-toastify'
  import dayjs from 'dayjs'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';


  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const { otp, otpRequest, isLoading } = storeToRefs(authStore)
  const IS_REQUIRED_OTP = import.meta.env.VITE_IS_REQUIRED_OTP

  async function backToLoginPage() {
    router.push({ name: 'login' })
  }

  async function resendOTP() {
    if (dayjs(otpRequest.value.lastRequest).isAfter(dayjs().subtract(3, 'minutes'))) {
      createToast(
        `คุณสามารถขอ OTP ได้อีกครั้งหลังจาก ${dayjs(otpRequest.value.lastRequest)
          .add(3, 'minutes')
          .format('HH:mm:ss')}`,
        {
          position: 'top-right',
          type: 'danger',
        },
      )
      return
    }
    await authStore.requestOTPWithAPI()
  }

  async function verifyOTP() {
    if (!otp.value) {
      createToast(t('auth.fillOTPError'), {
        position: 'top-right',
        type: 'danger',
      })
      return
    }
    const response = await authStore.verifyOTPWithAPI()
    if (!response.isSuccess) {
      createToast(t('auth.verifyOTPFail'), {
        position: 'top-right',
        type: 'danger',
      })
      await saveUserLog({
        service: SERVICE_NAME,
        event: VERIFY_OTP_WITH_ERROR,
      })
      return
    }
    await saveUserLog({
      service: SERVICE_NAME,
      event: VERIFY_OTP_SUCCESS,
    })
    createToast(t('auth.loggedInSuccessfully'), {
      position: 'top-right',
      type: 'success',
    })
    router.push({ name: 'realtime' })
  }

  onMounted(async () => {
    if (!localStorage.getItem(SESSION_TOKEN_KEY)) {
      router.push({ name: 'login' })
    }
    if (IS_REQUIRED_OTP.toLowerCase() !== 'true') {
      router.push({ name: 'login' })
      return
    }
    await getProfile()
    await saveUserLog({
      service: SERVICE_NAME,
      event: GO_TO_OTP_PAGE,
    })
    await authStore.requestOTPWithAPI()
  })
</script>
<style>
  .va-input-label {
    font-size: 16px !important;
  }
</style>
