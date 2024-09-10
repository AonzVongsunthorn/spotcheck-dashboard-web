<template>
  <div class="w-full bg-[#0F1342] text-white flex justify-between items-center px-5 py-3 xl:hidden fixed z-50">
    <h1 class="text-xl p-2">{{ data.stationName ? data.stationName : 'ImPS (WIM)' }}</h1>
    <div class="text-right">
      <button @click="toggleMenu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </div>
  <div class="side-bar relative hidden xl:block">
    <div>
      <h1 class="text-4xl py-10 px-5">{{ data.stationName ? data.stationName : 'ImPS (WIM)' }}</h1>
    </div>
    <div class="account flex flex-col items-center">
      <img src="/user-icon.png" alt="" width="48" />
      <p class="uppercase mt-3">{{ (getLoggedInUserFullName || '').split(' ')[0] }}</p>
    </div>
    <div class="menu">
      <ul>
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'realtime' }">รายการรถไม่เข้าชั่ง</router-link></li>
        <!-- <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'image-detected' }">ระบบตรวจจับด้วยภาพ</router-link></li> -->
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'dashboard' }">แดชบอร์ด</router-link></li>
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'image-processing-dashboard' }">ประมวลผลด้วยภาพ</router-link>
        </li>
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'search' }">สืบค้นข้อมูล</router-link></li>
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'report' }">รายงาน</router-link></li>
        <!--  <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'devices' }">สถานะอุปกรณ์</router-link></li>  -->
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'station-setup' }">ตั้งค่าสถานี</router-link></li>
        <!-- <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'service-status' }">สถานะการดึงข้อมูล</router-link>
        </li> -->
      </ul>
    </div>
    <div class="absolute bottom-0 menu w-full">
      <ul>
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'login' }">Logout</router-link></li>
      </ul>
    </div>
  </div>
  <!-- Side Menu for Mobile/Tablet-->
  <div
    :class="[
      'fixed inset-y-0 left-0 bg-[#0F1342] text-white z-50 transform transition-transform xl:hidden',
      { '-translate-x-full': !menuOpen },
    ]"
  >
    <div class="flex items-center justify-between p-4">
      <button @click="toggleMenu" class="flex gap-2 text-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-8 h-8 flex-initial"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        ซ่อนเมนู
      </button>

    </div>
    <div class="menu">
      <ul>
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'realtime' }" @click="toggleMenu()">รายการรถไม่เข้าชั่ง</router-link>
        </li>
        <!-- <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'image-detected' }">ระบบตรวจจับด้วยภาพ</router-link></li> -->
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'dashboard' }" @click="toggleMenu()">แดชบอร์ด</router-link>
        </li>
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'image-processing-dashboard' }" @click="toggleMenu()">ประมวลผลด้วยภาพ</router-link>
        </li>
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'search' }" @click="toggleMenu()">สืบค้นข้อมูล</router-link>
        </li>
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'report' }" @click="toggleMenu()">รายงาน</router-link>
        </li>
        <!--  <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'devices' }">สถานะอุปกรณ์</router-link></li>  -->
        <li class="hover:bg-[#979ab738]">
          <router-link :to="{ name: 'station-setup' }" @click="toggleMenu()">ตั้งค่าสถานี</router-link>
        </li>
      </ul>
    </div>
    <div class="absolute bottom-0 menu w-full">
      <ul>
        <li class="hover:bg-[#979ab738]"><router-link :to="{ name: 'login' }">Logout</router-link></li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import { useAuthStore } from '../../stores/authStore'
  import { useStationSetupStore } from '../../stores/v2/stationSetupStore'
  const loginStore = useAuthStore()
  const stationSetupStore = useStationSetupStore()

  const { data } = storeToRefs(stationSetupStore)
  const { getLoggedInUserFullName } = storeToRefs(loginStore)

  const menuOpen = ref(false)
  const menuTitle = ref('')

  onMounted(async () => {
    await stationSetupStore.getSettingAPI()
    console.log('config', data)
  })

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }
</script>
