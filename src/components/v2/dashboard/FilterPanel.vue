<template>
  <div class="flex gap-3 pb-0">
    <div class="flex flex-col gap-5 pb-0">
      <div class="grid grid-cols-4 gap-2 items-start">
        <div>
          วันที่
          <input type="date" v-model="startDate" placeholder="จาก" class="date-input" />
          <input type="date" v-model="endDate" placeholder="ถึง" class="date-input" />
        </div>
        <div>
          <button class="px-3 py-1 bg-[#0F1342] text-white rounded-full" @click="dashboardStore.search()">ตกลง</button>
        </div>
      </div>
    </div>
    <div class="flex gap-2 flex-initial hide">
      <div>
        <img src="/th.png" class="w-8 h-8" />
      </div>
      <div>
        <select id="" name="" class="select-box">
          <option value="">TH</option>
          <option value="">EN</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
  import { storeToRefs } from 'pinia'
  const dashboardStore = useDashboardV1Store()
  const { t } = useI18n()
  const { startDate, endDate } = storeToRefs(dashboardStore)
</script>
<style>
.hide {
  visibility: hidden;
}
</style>
