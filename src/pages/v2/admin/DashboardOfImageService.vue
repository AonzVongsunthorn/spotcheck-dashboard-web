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

          <div class="grid grid-cols-12 gap-5 mt-5 xl:mt-3">
            <div class="col-span-12 md:col-span-6 xl:col-span-3">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">
                    {{ Number(totalNotPassWeightStation) + Number(totalPassWeightStation) }}
                  </h2>
                  <p class="text-black text-2xl">จำนวนรถทั้งหมด</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-12 md:col-span-6 xl:col-span-3">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ totalNotPassWeightStation }}</h2>
                  <p class="text-black text-2xl">จำนวนรถที่ไม่เข้าชั่ง</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-12 md:col-span-6 xl:col-span-3">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ totalPassWeightStation }}</h2>
                  <p class="text-black text-2xl">จำนวนรถที่เข้าชั่ง</p>
                </va-card-content>
              </va-card>
            </div>
            <div class="col-span-12 md:col-span-6 xl:col-span-3">
              <va-card class="col-span-12 sm:col-span-4">
                <va-card-content>
                  <h2 class="va-h2 m-0 text-black">{{ totalOverWeight }}</h2>
                  <p class="text-black text-2xl">จำนวนรถที่คาดว่าน้ำหนักเกิน</p>
                </va-card-content>
              </va-card>
            </div>
          </div>
          <div class="grid grid-cols-12">
            <div class="col-span-12 xl:col-span-6 mt-3">
            <TopFiveVehicleTrafficFromImageAPIInDoughnutChart ref="donutChart" :key="top5TrafficDashboardRefresh" />
          </div>
          <div class="col-span-12 xl:col-span-6 mt-3">
            <TrafficAndOverweightCompareBarChart v-if="!isMultipleDay" :key="top5TrafficDashboardRefresh" />
            <TrafficAndOverweightCompareLineChart
              v-if="isMultipleDay"
              :key="top5TrafficDashboardRefresh"
              :dataset="dataSetForHistoryChart"
            />
          </div>
          <div class="col-span-12 xl:col-span-6 mt-3">
            <TopFiveVehicleTrafficFromImageAPI :key="top5TrafficDashboardRefresh" />
          </div>
          <div class="col-span-12 xl:col-span-6 mt-3">
            <TopFiveOverWeightFromImageAPI :key="top5OverWeightDashboardRefresh" />
          </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { storeToRefs } from 'pinia'
  import { useImageServiceDashboardStore } from '../../../stores/v2/imageServiceDashboardStore'
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import TopFiveVehicleTrafficFromImageAPI from '../../../components/v2/chart/graph-from-image-service/TopFiveVehicleTrafficFromImageAPI.vue'
  import TopFiveOverWeightFromImageAPI from '../../../components/v2/chart/graph-from-image-service/TopFiveOverWeightFromImageAPI.vue'
  import TopFiveVehicleTrafficFromImageAPIInDoughnutChart from '../../../components/v2/chart/graph-from-image-service/TopFiveVehicleTrafficFromImageAPIInDoughnutChart.vue'
  import TrafficAndOverweightCompareBarChart from '../../../components/v2/chart/graph-from-image-service/trafice-and-overwieght-compare/TrafficAndOverweightCompareBarChart.vue'
  import TrafficAndOverweightCompareLineChart from '../../../components/v2/chart/graph-from-image-service/trafice-and-overwieght-compare/TrafficAndOverweightCompareLineChart.vue'
  import { onMounted } from 'vue'
  import dayjs from 'dayjs'
  import { ref } from 'vue'

  const imageServiceDashboardStore = useImageServiceDashboardStore()
  const dashboardStore = useDashboardStore()
  const dataSetForHistoryChart = ref({ labels: [] as any[], datasets: [] as any[] })
  const {
    filter,
    totalNotPassWeightStation,
    totalOverWeight,
    totalPassWeightStation,
    isMultipleDay,
    isLoading,
    top5TrafficDashboardRefresh,
    top5OverWeightDashboardRefresh,
  } = storeToRefs(imageServiceDashboardStore)

  onMounted(async () => {
    await search()
  })

  async function search() {
    imageServiceDashboardStore.enableLoading()
    const result = await imageServiceDashboardStore.callReportAPI(
      filter.value.selectedStartDate,
      filter.value.selectedEndDate,
    )
    imageServiceDashboardStore.setTop5TrafficDashboardData(result)
    imageServiceDashboardStore.setTop5OverWeightDashboardData(result)
    imageServiceDashboardStore.setTotalNotPassWeightStation(result)
    imageServiceDashboardStore.setTotalOverWeight(result)
    imageServiceDashboardStore.setTotalTrafficCompareWithTotalOverweightBarChart(result)
    await loadTotalTrafficFromVehicleClassificationService()
    await loadHistoryData()
    imageServiceDashboardStore.setIsMultipleDay()
    imageServiceDashboardStore.forceRerender()
    imageServiceDashboardStore.disableLoading()
  }

  async function loadTotalTrafficFromVehicleClassificationService() {
    const { selectedStartDate, selectedEndDate } = filter.value
    const startDate = dayjs(selectedStartDate).format('YYYY-MM-DD')
    const endDate = dayjs(selectedEndDate).format('YYYY-MM-DD')
    const { data } = await imageServiceDashboardStore.callVehicleClassificationSummarizeData(startDate, endDate)
    const { total } = data
    imageServiceDashboardStore.setTotalPassWeightStation(total)
    console.log('total', total)
  }

  async function loadHistoryData() {
    const starDate = dayjs(filter.value.selectedStartDate).format('YYYY-MM-DD')
    const endDate = dayjs(filter.value.selectedEndDate).format('YYYY-MM-DD')
    const data = await dashboardStore.generateHistoryReportData(starDate, endDate)
    const labels: any[] = []
    const totalTraffics: any[] = []
    const totalOverWeights: any[] = []
    for (const item of data) {
      const { label, data } = item
      const total = data.map((item) => item.total).reduce((partialSum, a) => partialSum + a, 0)
      const totalOverWeight = data.map((item) => item.overWeight).reduce((partialSum, a) => partialSum + a, 0)
      labels.push(label.toString())
      totalTraffics.push(total)
      totalOverWeights.push(totalOverWeight)
    }
    dataSetForHistoryChart.value = {
      labels,
      datasets: [
        {
          label: 'จำนวนรถทั้งหมด',
          borderColor: '#488A99',
          backgroundColor: '#488A99',
          data: totalTraffics,
        },
        {
          label: 'จำนวนรถที่อาจน้ำหนักเกิน',
          borderColor: '#AC3E31',
          backgroundColor: '#AC3E31',
          data: totalOverWeights,
        },
      ],
    }
  }
</script>
<style lang="scss">
  .va-card {
    max-width: 99%;
  }
</style>
