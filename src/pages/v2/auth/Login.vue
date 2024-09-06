<template>
  <loading v-model:active="isLoading"
           :is-full-page="true"/>
  <div class="bg-[#0F1342] min-h-screen flex items-center justify-center login-page">
    <div class="bg-[#979ab738] rounded-3xl px-14 py-16 absolute">
      <div class="flex flex-col items-center">
        <img src="/logo.png" class="w-36" />
        <div class="text-white my-3 text-center">
          <h1 class="text-lg font-bold uppercase">Weighing Information System: WIS</h1>
          <p class="uppercase">Thailand Department Of Highway</p>
        </div>
      </div>
      <div class="mb-3">
        <input type="text" v-model="user.username" class="h-10 rounded-full p-4 w-full" placeholder="USERNAME" />
        <label class="ml-1" :class="{ 'text-blue': !errors.username, 'text-red': errors.username }">กรุณากรอก Username</label>
      </div>
      <div class="mb-3">
        <input type="password" v-model="user.password" class="h-10 rounded-full p-4 w-full" placeholder="PASSWORD" />
        <label class="text-red ml-1" :class="{ 'text-blue': !errors.password, 'text-red': errors.password }">กรุณากรอก Password</label>
      </div>
      <div class="ml-5 my-2">
        <input type="checkbox" id="isRememberSession" v-model="user.isRememberSession" />
        <label for="isRememberSession" class="text-white ml-1">Keep me signed in</label>
      </div>
      <button class="bg-[#0F1342] rounded-full px-3 py-2 text-white uppercase font-bold w-full" @click="login()">Log in</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onBeforeMount } from 'vue'
import { createToast } from 'mosha-vue-toastify'
import { useLoginStore } from '../../../stores/v2/loginStore/'
import { LoginParams } from "../../../stores/v2/loginStore/interface";
import { SESSION_TOKEN_KEY } from "../../../constants";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const loginStore = useLoginStore()
const router = useRouter()

onBeforeMount(() => {
  console.log('logging out ..')
  localStorage.removeItem(SESSION_TOKEN_KEY)
})

const isLoading = ref(false)

const user = ref({
  username: '',
  password: '',
  isRememberSession: false,
})
const errors = ref({
  username: false,
  password: false,
})

function resetErrors() {
  errors.value = {
    username: false,
    password: false,
  }
}

function validation() {
  if (!user.value.username) {
    errors.value.username = true;
  }

  if (!user.value.password) {
    errors.value.password = true;
  }
}

async function login() {
  resetErrors()
  validation()
  if (errors.value.username || errors.value.password) {
    return
  }
  isLoading.value = true
  const params: LoginParams = {
    username: user.value.username,
    password: user.value.password,
    isRememberSession: user.value.isRememberSession,
  }
  const loginResult = await loginStore.login(params)
  isLoading.value = false
  if (loginResult.isSuccess) {
    router.push({ name: `realtime` })
  } else {
    createToast('USERNAME หรือ PASSWORD ไม่ถูกต้อง', {
      position: 'top-right',
      type: 'danger',
    })
  }
}
</script>
<style>
.text-red {
  color: red;
}
.text-blue {
  color: #2C315C
}
</style>
