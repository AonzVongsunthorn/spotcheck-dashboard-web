<template>
  <div class="mx-auto w-5/5">
    <loading v-model:active="isLoading" :is-full-page="true" />
    <div class="modal-popup">
      <div class="bg-[#0F1342] rounded-t-3xl flex flex-initial justify-between px-4 py-2 text-white">
        <h1 class="text-3xl">ImPS (WIM)</h1>
        <div class="text-right">
          <va-icon class="material-icons" size="large">print</va-icon>
        </div>
      </div>
      <table class="table-fixed w-full border-table">
        <tr class="thead">
          <td>สถานี</td>
          <td width="160px">วันที่-เวลา</td>
          <td>เลขที่</td>
          <td>ลำดับ</td>
          <td>เลน</td>
          <td>ประเภทรถ</td>
          <td>นน.พิกัด (กก.)</td>
          <td>นน.วัดได้ (กก.)</td>
          <td>นน.เกิน (กก.)</td>
          <td>นน.เกิน (%)</td>
          <td>ป้ายทะเบียน</td>
          <td>ผลการคัดกรอง</td>
        </tr>
        <tr v-for="(row, index) of traffics" :class="getRowColor(index)">
          <td>{{ row.station && row.station.stationName ? row.station.stationName : '' }}</td>
          <td>{{ dayjs(row.stamp).format('YYYY-MM-DD HH:mm:ss') }}</td>
          <td>N/A</td>
          <td>{{ row.id }}</td>
          <td>{{ row.lane }}</td>
          <td>{{ row.BosureDescription }}</td>
          <td>{{ (row.GVW_Weight_Max || 0).toLocaleString() }} กก.</td>
          <td class="text-right">{{ (row.gvw || 0).toLocaleString() }} กก.</td>
          <td class="text-right">{{ row.gvw <= row.GVW_Weight_Max ? '-' : row.gvw - row.GVW_Weight_Max }}</td>
          <td>
            {{
              row.gvw <= row.GVW_Weight_Max ? '-' : `${(((row.gvw - row.GVW_Weight_Max) / row.gvw) * 100).toFixed(2)}%`
            }}
          </td>
          <td>{{ row.plate.license_plate }} {{ row.plate.province }}</td>
          <td>{{ row.gvw <= row.GVW_Weight_Max ? 'ผ่าน' : 'ไม่ผ่าน' }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script setup>
  import { useDashboardStore } from '../../stores/v2/dashboardStore'
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import dayjs from 'dayjs'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { getRowColor } from '../../helpers/utilities'
  const listCarStore = useDashboardStore()
  const { filter, isLoading } = storeToRefs(listCarStore)

  const traffics = ref([])

  const route = useRoute()
  onMounted(async () => {
    const plate = route.params.plate
    filter.value.startDate = dayjs().subtract(7, 'days').format('YYYY-MM-DDT00:00:00+07:00')
    filter.value.endDate = dayjs().format('YYYY-MM-DDT23:59:59+07:00')
    filter.value.plate = plate
    const { data } = await listCarStore.search(filter.value, false, true)
    traffics.value = data
  })
</script>
