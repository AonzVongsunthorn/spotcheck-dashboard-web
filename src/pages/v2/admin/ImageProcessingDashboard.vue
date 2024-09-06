<template>
  <div class="h-screen">
    <loading v-model:active="isLoading" :is-full-page="true" />
    <div class="top-nav pt-20 pb-5 px-5 xl:px-0 xl:p-10">
      <div class="flex gap-20 flex-initial">
        <div class="">
          <div class="flex items-center gap-6">
            <div class="flex-initial gap-2 flex items-center">
              วันที่
              <input v-model="filter.selectedStartDate" type="date" placeholder="จาก" class="date-input" />
              <input v-model="filter.selectedEndDate" type="date" placeholder="ถึง" class="date-input" />
            </div>
            <div>
              <button class="px-3 py-1 bg-[#0F1342] text-white rounded-full" @click="search()">ตกลง</button>
            </div>
          </div>
          <div class="grid grid-cols-12 xl:grid-cols-5 gap-3 mt-3">
            <div class="col-span-6 xl:col-span-1">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ vehicleClassStatistics.totalMotorcycle }}</h2>
                  <p class="text-black text-2xl">รถจักรยานยนต์</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-6 xl:col-span-1">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ vehicleClassStatistics.totalCar }}</h2>
                  <p class="text-black text-2xl pr-14">รถยนต์</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-6 xl:col-span-1">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ vehicleClassStatistics.totalVan }}</h2>
                  <p class="text-black text-2xl pr-20">รถตู้</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-6 xl:col-span-1">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ vehicleClassStatistics.totalTruck }}</h2>
                  <p class="text-black text-2xl pr-14">รถบรรทุก</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-6 xl:col-span-1">
              <va-card class="col-span-1">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ vehicleClassStatistics.totalBus }}</h2>
                  <p class="text-black text-2xl pr-16">รถบัส</p>
                </va-card-content>
              </va-card>
            </div>
          </div>
          <div class="flex xs12 lg12 xl12 mt-3">
            <TotalTrafficLineChart
              :key="top5TrafficDashboardRefresh"
              :dataset="dataSetForHistoryChart"
              :start-time="filter.selectedStartDate"
              :end-time="filter.selectedEndDate"
            />
          </div>
          <div v-if="CCTV_ENDPOINT_OF_3D_SERVICE" class="flex xs12 lg12 xl12 mt-3">
            <va-card>
              <va-card-title> CCTV จากระบบประมวลผลด้วยภาพ </va-card-title>
              <va-card-content>
                <img :src="CCTV_ENDPOINT_OF_3D_SERVICE" />
              </va-card-content>
            </va-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { useImageServiceDashboardStore } from '../../../stores/v2/imageServiceDashboardStore'
  import { onMounted, ref } from 'vue'
  import dayjs from 'dayjs'
  import { SummarizeDataSeparateByClassObject } from '../../../services/api/v1/report/api.interface'
  import TotalTrafficLineChart from '../../../components/v2/chart/graph-from-vehicle-separate-service/TotalTrafficLineChart.vue'
  const CCTV_ENDPOINT_OF_3D_SERVICE = import.meta.env.VITE_CCTV_ENDPOINT_OF_3D_SERVICE
  const imageServiceDashboardStore = useImageServiceDashboardStore()
  const { filter, isLoading, top5TrafficDashboardRefresh } = storeToRefs(imageServiceDashboardStore)
  const vehicleClassStatistics = ref({
    totalMotorcycle: 0,
    totalCar: 0,
    totalVan: 0,
    totalTruck: 0,
    totalBus: 0,
  })
  const dataSetForHistoryChart = ref({ labels: [] as string[], datasets: [] as any[] })
  onMounted(async () => {
    await search()
  })
  async function search() {
    await loadTotalTrafficFromVehicleClassificationServiceSeparateByClass()
    await loadTotalTrafficFromVehicleClassificationServiceSeparateByTimeSeries()
    imageServiceDashboardStore.forceRerender()
  }
  async function loadTotalTrafficFromVehicleClassificationServiceSeparateByTimeSeries() {
    const { selectedStartDate, selectedEndDate } = filter.value
    const startDate = dayjs(selectedStartDate).format('YYYY-MM-DD')
    const endDate = dayjs(selectedEndDate).format('YYYY-MM-DD')
    const { data } = await imageServiceDashboardStore.callVehicleClassificationSummarizeDataSeparateByTimeSeries(
      startDate,
      endDate,
    )
    const labels: string[] = data.map((item) => item.label)
    const totalTraffics: string[] = data.map((item) => item.total)
    dataSetForHistoryChart.value = {
      labels,
      datasets: [
        {
          label: 'จำนวนรถทั้งหมด',
          borderColor: '#488A99',
          backgroundColor: '#488A99',
          data: totalTraffics,
        },
      ],
    }
  }
  async function loadTotalTrafficFromVehicleClassificationServiceSeparateByClass() {
    const { selectedStartDate, selectedEndDate } = filter.value
    const startDate = dayjs(selectedStartDate).format('YYYY-MM-DD')
    const endDate = dayjs(selectedEndDate).format('YYYY-MM-DD')
    const { data }: { data: SummarizeDataSeparateByClassObject[] } =
      await imageServiceDashboardStore.callVehicleClassificationSummarizeDataSeparateByClass(startDate, endDate)
    for (const item of data) {
      if (item.class === 'motorcycle') {
        vehicleClassStatistics.value.totalMotorcycle = +item.total
      } else if (item.class === 'car') {
        vehicleClassStatistics.value.totalCar = +item.total
      } else if (item.class === 'van') {
        vehicleClassStatistics.value.totalCar = +item.total
      } else if (item.class === 'truck') {
        vehicleClassStatistics.value.totalTruck = +item.total
      } else if (item.class === 'bus') {
        vehicleClassStatistics.value.totalBus = +item.total
      }
    }
  }
</script>
<style lang="scss" scoped>
  .va-card {
    width: 100% !important;
  }
  .line-chart {
    padding-top: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
</style>
