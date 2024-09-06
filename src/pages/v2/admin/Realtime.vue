<template>
  <div class="h-screen mt-16 p-1 lg:p-2 lg:mt-20 xl:mt-0">
    <div class="fixed top-0 right-2 mr-20 !mt-5 z-50">
      <div class="text-white text-lg flex items-center gap-5 xl:hidden">
        เปิดจราจร <VaSwitch v-model="switchTraffic"/>
      </div>

    </div>
    <loading v-model:active="isShowLoadingDialog" :is-full-page="true" />
    <div class="top-nav xl:flex p-10 flex-initial hidden">
      <div class="flex xs12 lg12 xl12">
        <div class="w-1/6">
          สถานี
          <select v-model="filter.station" class="select-box w-48">
            <option v-for="option in filters.stationOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-1/6 -ml-3">
          น้ำหนัก
          <select
            v-model="filter.exceedWeight"
            class="select-box"
            @change="listCarStore.onExceedWeightOptionChange($event)"
          >
            <option v-for="option in filters.weightOptions" :key="option.value" :value="option.value" selected>
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-1/6 -ml-12">
          เลน
          <select v-model="filter.lane" class="select-box" @change="listCarStore.onLaneOptionChange($event)">
            <option v-for="option in filters.laneOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-1/6 -ml-28">
          จำนวนรายการ
          <select v-model="filter.pageSize" class="select-box">
            <option v-for="option in filters.pageOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-1/6 -ml-24">
          <button class="px-3 py-1 bg-[#0F1342] text-white rounded-full" @click="search()">ตกลง</button>
        </div>
        <div class="flex gap-5">
          <div class="text-lg xl:flex hidden items-center gap-5 flex-initial">
          เปิดจราจร <VaSwitch v-model="switchTraffic"/>
          </div>
          <div class="">
            ต้องการเเจ้งเตือนเมื่อถึง
            <select v-model="selectedAlertPercent" class="select-box w-18">
              <option v-for="option in alertPercentOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            %
          </div>
        </div>

      </div>
    </div>
    <div>
      <div class="xl:flex hidden">
        <div id="cctvCard" class="w-1/3 ml-5 mr-3">
          <va-card>
            <canvas id="cctvCanvas" class="mx-auto w-full h-full"></canvas>
          </va-card>
        </div>
        <div id="statisticCard" class="pr-3 w-1/3">
          <Top5TrafficFromIMPSDoughnutChart
            v-if="currentTrafficFromSummaryReportAPI.data.length"
            :key="refreshChart"
            :data="currentTrafficFromSummaryReportAPI"
          />
        </div>
        <div class="w-1/3 pr-3 mr-4">
          <va-card id="historyChartCard" class="text-center">
            <div v-if="!dataSetForHistoryChart.datasets.length && isHistoryChartLoadingReadyToShow">
              <h1 class="ml-56 pt-20">
                <spring-spinner :animation-duration="3000" :size="60" color="#20283E" />
              </h1>
              <h1 class="text-3xl pt-10">กำลังดาวน์โหลดข้อมูล</h1>
              <h1 class="text-3xl">ประวัติการจราจรย้อนหลัง 5 วัน</h1>
            </div>
            <div>
              <OverWeightVSTotalTrafficChart
                v-if="dataSetForHistoryChart.datasets.length"
                :key="refreshChart"
                :dataset="dataSetForHistoryChart"
              />
            </div>
          </va-card>
        </div>
      </div>
      <div class="mx-10 overflow-y-scroll section-table xl:block hidden">
        <table v-for="(row, index) in currentTrafficList" class="table-fixed w-full table-list mt-2">
          <tr :class="getRowColor(index)">
            <td :class="[IS_3D_ENABLE === 'true' ? 'w-1/3' : 'w-1/6']">
              <div class="flex gap-1">
                <div class="w-[160px] flex-initial">
                  <Image v-if="row.images[0].url" :url="buildStaticURL(row.images[0].url)" style-class="mt-2" />
                  <div v-else class="text-center">
                    <img :src="noImage" style="width: 160px" class="mx-auto" />
                    ไม่พบภาพ
                  </div>
                </div>
                <div class="w-[160px] flex-initial">
                  <Image v-if="row.plate.plate_path" :url="buildStaticURL(row.plate.plate_path)" style-class="mt-2" />
                  <div v-else class="text-center">
                    <img :src="noImage" style="width: 160px" class="mx-auto" />
                    ไม่พบภาพ
                  </div>
                </div>
                <div v-if="IS_3D_ENABLE === 'true'" class="w-[160px]">
                  <div v-if="Object.values(row.dataFrom3D).length">
                    <Image :url="build3DStaticURL(row.dataFrom3D.imagePath)" style-class="mt-2" />
                  </div>
                  <div v-else class="text-center">
                    <div
                      v-if="isWaitingForSyncDataFrom3DService(row.plate, row.stamp)"
                      class="h-[160px] flex items-center justify-center"
                    >
                      <SpringSpinner class="mx-auto flex-none" :color="'#20283E'"></SpringSpinner>
                    </div>
                    <div v-else class="text-center">
                      <img :src="noImage" style="width: 160px" class="mx-auto" />
                      ไม่พบข้อมูลจากระบบ 3D
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="w-[12%]">
              <div class="flex flex-col">
                <span class="value">{{ row.station.stationName }}</span>
                <div class="flex">
                  <div class="w-1/4 label">ลำดับ</div>
                  <div class="w-1/2 value">{{ row.id }}</div>
                </div>
                <div class="flex">
                  <div class="w-1/4 label">ช่อง</div>
                  <div class="w-1/2 value">{{ row.lane }}</div>
                </div>
                <div class="flex">
                  <div class="w-1/4 label">วันที่</div>
                  <div class="w-1/2 value">{{ getDateFromTimestamp(row.stamp) }}</div>
                </div>
                <div class="flex">
                  <div class="w-1/4 label">เวลา</div>
                  <div class="w-1/2 value">{{ getTimeFromTimestamp(row.stamp) }}</div>
                </div>
              </div>
            </td>
            <td class="w-[15%]">
              <div class="flex">
                <div class="w-1/3 label">ประเภทรถ</div>
                <div class="w-1/2 value">{{ row.BosureDescription }}</div>
              </div>
              <div class="flex">
                <div class="w-1/3 label">นน.พิกัด</div>
                <div class="w-1/2 value font-24">{{ (row.GVW_Weight_Max || 0).toLocaleString() }} กก.</div>
              </div>
              <div class="flex">
                <div class="w-1/3 label">นน.วัดได้</div>
                <div class="w-1/2 value font-24">{{ (row.gvw || 0).toLocaleString() }} กก.</div>
              </div>
              <div class="flex">
                <div class="w-1/3 label">ความเร็ว</div>
                <div class="w-1/2 value">{{ (row.speed || 0).toFixed(2) }} กม/ชม.</div>
              </div>
              <div class="flex">
                <div class="w-1/3 label">ยาว</div>
                <div class="w-1/2 value">{{ (row.length / 100).toFixed(2) }} ม.</div>
              </div>
            </td>
            <td v-if="IS_3D_ENABLE === 'true'" class="w-[10%]">
              <div class="value">ข้อมูลจากระบบ 3D</div>
              <div v-if="Object.values(row.dataFrom3D).length" class="flex flex-col">
                <div>
                  กว้าง :<span class="value">{{ (row.dataFrom3D.width / 1000).toFixed(2) }} ม.</span>
                </div>
                <div>
                  ยาว: <span class="value">{{ (row.dataFrom3D.long / 1000).toFixed(2) }} ม.</span>
                </div>
                <div>
                  สูง: <span class="value">{{ (row.dataFrom3D.height / 1000).toFixed(2) }} ม.</span>
                </div>
              </div>
              <div v-else>
                <div v-if="isWaitingForSyncDataFrom3DService(row.plate, row.stamp)">กำลังรอข้อมูลจากระบบ 3D</div>
                <div v-else>ไม่พบข้อมูล 3D</div>
              </div>
            </td>
            <td class="w-2/12">
              <div class="flex flex-col gap-2">
                <VehicleType
                  :vehicle-class-id="row.VehicleClassID"
                  status="pass"
                  :title="getVehicleTitle(row.BosureDescription)"
                  :weight="getVehicleWeight(row.BosureDescription)"
                  :dataset="generateDatesetForCarType(row.axles)"
                  :underline="true"
                />
              </div>
            </td>
            <td class="w-1/12">
              <div class="flex">
                <div class="font-bold">ป้ายทะเบียน</div>
              </div>
              <Image
                v-if="row.plate.crop_path"
                :url="buildStaticURL(row.plate.crop_path)"
                custom-style="max-height: 70px;"
              />
              <div v-if="row.plate.crop_path" class="value font-24">{{ row.plate.license_plate }}</div>
              <div v-if="row.plate.crop_path" class="value font-24">{{ row.plate.province }}</div>
              <div v-if="!row.plate.crop_path" class="value red">ไม่พบป้ายทะเบียน</div>
            </td>
            <td class="w-1/12 v-align-middle">
              <button
                v-if="row.gvw <= row.GVW_Weight_Max"
                class="px-3 py-2 w-24 bg-green-500 rounded-full text-white text-md font-bold"
              >
                ผ่าน
              </button>
              <button
                v-if="row.gvw > row.GVW_Weight_Max && !row.warningFlags"
                class="px-3 w-24 bg-red-500 rounded-full text-white font-bold font-16"
              >
                คาดว่าเกิน <span class="font-24">{{ calculatePercent(row.gvw, row.GVW_Weight_Max) }}%</span>
              </button>
              <button
                v-if="row.gvw > row.GVW_Weight_Max && row.warningFlags"
                class="px-3 py-2 w-24 bg-yellow-500 rounded-full text-black text-md font-bold"
              >
                ตรวจสอบ
              </button>
              <button
                class="mt-1 px-3 w-24 py-1 bg-blue-500 rounded-full text-white text-md font-bold"
                @click="listCarStore.openPopup(row.id, getDateFromTimestamp(row.stamp))"
              >
                ข้อมูล
              </button>
              <button
                v-if="row.plate.license_plate"
                class="mt-1 px-3 w-24 py-1 bg-blue-500 rounded-full text-white text-md font-bold"
                @click="listCarStore.openHistoryPopup(row.plate.license_plate)"
              >
                สืบค้น
              </button>
            </td>
          </tr>
        </table>
      </div>
      <!-- Mobile/Tablet -->
      <div class="xl:hidden">
        <!-- Top Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div id="">
            <va-card>
              <canvas id="cctvCanvas_m" class="mx-auto w-full p-3"></canvas>
            </va-card>
          </div>
          <div id="">
            <va-card>
              <canvas id="cctvCanvas_m2" class="mx-auto w-full p-3"></canvas>
            </va-card>
          </div>
          <!-- <div class="grid grid-cols-2 gap-2 h-fit">
            <div class="shadow-md rounded-md bg-white p-2 relative">
              <div class="absolute inset-y-0 left-0 w-[5px] bg-blue-800 rounded-l-md"></div>
              <div class="flex gap-2">
                <div class="bg-blue-800 w-14 h-14 rounded-full flex items-center justify-center flex-initial">
                  <svg
                    class="h-8 w-8 text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="21 12 17 12 14 20 10 4 7 12 3 12" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <div class="text-lg font-bold">0</div>
                  <div>จำนวนรถทั้งหมด</div>
                </div>
              </div>
            </div>
            <div class="shadow-md rounded-md bg-white p-2 relative">
              <div class="absolute inset-y-0 left-0 w-[5px] bg-blue-800 rounded-l-md"></div>
              <div class="flex gap-2">
                <div class="bg-blue-800 w-14 h-14 rounded-full flex items-center justify-center flex-initial">
                  <svg
                    class="h-8 w-8 text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <div class="text-lg font-bold">0</div>
                  <div>น้ำหนักผ่านกฏหมาย</div>
                </div>
              </div>
            </div>
            <div class="shadow-md rounded-md bg-white p-2 relative">
              <div class="absolute inset-y-0 left-0 w-[5px] bg-blue-800 rounded-l-md"></div>
              <div class="flex gap-2">
                <div class="bg-blue-800 w-14 h-14 rounded-full flex items-center justify-center flex-initial">
                  <svg
                    class="h-8 w-8 text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="3 17 9 11 13 15 21 7" />
                    <polyline points="14 7 21 7 21 14" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <div class="text-lg font-bold">0</div>
                  <div>นำ้หนักเกินกฏหมาย</div>
                </div>
              </div>
            </div>
            <div class="shadow-md rounded-md bg-white p-2 relative">
              <div class="absolute inset-y-0 left-0 w-[5px] bg-blue-800 rounded-l-md"></div>
              <div class="flex gap-2">
                <div class="bg-blue-800 w-14 h-14 rounded-full flex items-center justify-center flex-initial">
                  <svg
                    class="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <div class="text-lg font-bold">0</div>
                  <div>คร่อมช่องจราจร</div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- Card List -->
        <div class="grid grid-cols-12 gap-3 mt-2">
          <div v-for="(row, index) in currentTrafficList" :key="index" class="col-span-12 md:col-span-4">
            <div class="shadow-md rounded-lg">
              <div class="rounded-t-2xl overflow-hidden">
                <Image v-if="row.images[0].url" :url="buildStaticURL(row.images[0].url)" style-class="mt-2 !w-[100%]" />
                <div v-else class="text-center">
                  <img :src="noImage" style="height: 165px" class="mx-auto" />
                </div>
              </div>
              <div class="flex flex-col p-3">
                <div>
                  <div v-if="row.plate.crop_path" class="value">
                    {{ row.plate.license_plate }} {{ row.plate.province }}
                  </div>
                  <div v-if="!row.plate.crop_path" class="value red">ไม่พบป้ายทะเบียน</div>
                </div>
                <div class="flex justify-between">
                  <div>{{ getDateFromTimestamp(row.stamp) }}</div>
                  <div class="text-right">{{ getTimeFromTimestamp(row.stamp) }}</div>
                </div>
                <div class="flex justify-between">
                  <div>พิกัด {{ (row.GVW_Weight_Max || 0).toLocaleString() }} Kg.</div>
                  <div class="text-right">วัดได้ {{ (row.gvw || 0).toLocaleString() }} Kg.</div>
                </div>
                <div class="flex justify-between">
                  <div>Lane {{ row.lane }}</div>
                  <div class="text-right">Speed {{ (row.speed || 0).toFixed(2) }} Km/h</div>
                </div>
                <div class="flex justify-between">
                  <div>
                    <button
                      v-if="row.gvw <= row.GVW_Weight_Max"
                      class="w-20 max-w-24 px-2 py-1 bg-green-500 rounded-lg text-white font-bold"
                    >
                      ผ่าน
                    </button>
                    <button
                      v-else-if="row.gvw > row.GVW_Weight_Max && !row.warningFlags"
                      class="max-w-24 px-2 py-1 bg-red-500 rounded-lg text-white font-bold"
                    >
                      คาดว่าเกิน <span class="">{{ calculatePercent(row.gvw, row.GVW_Weight_Max) }}%</span>
                    </button>
                    <button
                      v-else-if="row.gvw > row.GVW_Weight_Max && row.warningFlags"
                      class="px-2 py-1 w-20 max-w-24 bg-yellow-500 rounded-lg text-black font-bold"
                    >
                      ตรวจสอบ
                    </button>
                  </div>
                  <div class="text-right">
                    <button
                      class="flex ml-auto items-center bg-gradient-to-r from-[#0F1342] to-blue-500 text-white px-2 py-1 rounded-lg"
                      @click="gotoLink(row.id, getDateFromTimestamp(row.stamp))"
                    >
                      ข้อมูลเพิ่มเติม
                      <svg
                        class="h-3 w-3 text-white"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <line x1="13" y1="18" x2="19" y2="12" />
                        <line x1="13" y1="6" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import Image from '../../../components/v2/image-preview/Image.vue'
  import VehicleType from '../../../components/v2/vehicle-type/VehicleIcon.vue'
  import OverWeightVSTotalTrafficChart from '../../../components/v2/chart/OverWeightVSTotalTrafficChart.vue'
  import Top5TrafficFromIMPSDoughnutChart from '../../../components/v2/chart/Top5TrafficFromIMPSDoughnutChart.vue'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { storeToRefs } from 'pinia'
  import dayjs from 'dayjs'
  import Jsmpeg from '@cycjimmy/jsmpeg-player'
  import { useRoute, useRouter } from 'vue-router'
  import { getCurrentInstance } from 'vue'
  import {
    getVehicleTitle,
    buildStaticURL,
    getVehicleWeight,
    getDateFromTimestamp,
    getTimeFromTimestamp,
    getRowColor,
    generateDatesetForCarType,
    isNumber,
    build3DStaticURL,
    calculatePercent,
  } from '../../../helpers/utilities'
  import { SpringSpinner } from 'epic-spinners'
  import noImage from '../../../assets/no-image.png'

  const listCarStore = useDashboardStore()
  const CCTV_URL = import.meta.env.VITE_CCTV_URL
  const IS_WEBSOCKET_ENABLE = import.meta.env.VITE_IS_WEBSOCKET_ENABLE
  const IS_3D_ENABLE = import.meta.env.VITE_IS_3D_ENABLE
  const wimStatistic = ref({
    totalTraffic: 'N/A',
    totalIsPassStaticService: 'N/A',
    totalIsPassImageService: 'N/A',
    totalReportStatus: 'N/A',
  })
  const totalOverWeightFromIMPS = ref('N/A')
  const totalErrorFromIMPS = ref('N/A')
  const totalPassFromIMPS = ref('N/A')
  const dataSetForHistoryChart = ref({ labels: [], datasets: [] })
  const currentTrafficFromSummaryReportAPI = ref({ data: [], vehicleClass: [] })
  const refreshChart = ref(0)
  const isHistoryChartLoadingReadyToShow = ref(false)
  const isShowLoadingDialog = ref(true)
  const { filters, filter, currentTrafficList, alertPercentOptions, selectedAlertPercent } = storeToRefs(listCarStore)
  const route = useRoute()
  const router = useRouter()
  const notificationModule = ref(null)
  const switchTraffic = ref(false)

  async function search() {
    if (notificationModule.value) {
      notificationModule.value.play()
    }
    await loadReportData()
    await loadIMPSSummaryData()
    await getDataSetForHistoryChart()
    await loadWIMData()
  }

  watch(currentTrafficList, () => {
    isShowLoadingDialog.value = false
  })

  onUnmounted(() => {
    const { proxy } = getCurrentInstance()
    proxy.$disconnect()
    console.log('disconnecting .. websocket')
  })

  onMounted(async () => {
    setTimeout(() => {
      const statisticCardHeight = document.getElementById('statisticCard').offsetHeight
      document.getElementById('historyChartCard').style.height = `${statisticCardHeight}px`
      isHistoryChartLoadingReadyToShow.value = true
    }, 1000)
    const { vehicleType } = route.query
    if (vehicleType && isNumber(+vehicleType)) {
      filter.value.vehicleType = vehicleType
    }
    listCarStore.resetFilter()
    listCarStore.clearAllOptions()
    renderCCTV()
    renderWebsocket()
    await generateFilterOption()
    await loadReportData()
    await loadIMPSSummaryData()
    await getDataSetForHistoryChart()
    // await loadWIMData();
    if (IS_3D_ENABLE.toLowerCase() === 'true') {
      setInterval(function () {
        listCarStore.update3DInformation()
      }, 2000)
    }
  })

  function renderCCTV() {
    if (CCTV_URL) {
      new Jsmpeg.Player(CCTV_URL, { canvas: document.getElementById('cctvCanvas') })
      new Jsmpeg.Player(CCTV_URL, { canvas: document.getElementById('cctvCanvas_m') })
      new Jsmpeg.Player(CCTV_URL, { canvas: document.getElementById('cctvCanvas_m2') })
    }
  }

  function renderWebsocket() {
    if (IS_WEBSOCKET_ENABLE.toLowerCase() === 'true') {
      const { proxy } = getCurrentInstance()
      setTimeout(() => {
        if (proxy == null) return
        proxy.$connect()
      }, 100)
    }
  }

  async function generateFilterOption() {
    const setting = await listCarStore.getSettingAPI()
    listCarStore.clearAllOptions()
    if (setting.stationID && setting.stationName) {
      listCarStore.setStationOption(setting.stationName)
    }
    if (setting.lprCameras.length) {
      for (const camera of setting.lprCameras) {
        listCarStore.setLaneOption(camera.lane)
      }
    }
  }

  async function loadReportData() {
    filter.value.startDate = dayjs().format('YYYY-MM-DDT00:00:00+07:00')
    filter.value.endDate = dayjs().format('YYYY-MM-DDT23:59:59+07:00')
    const result = await listCarStore.search(filter.value, IS_3D_ENABLE.toLowerCase() === 'true')
    if (result.data) {
      listCarStore.setCurrentTrafficList(result.data)
      listCarStore.disableLoading()
    }
  }

  async function loadWIMData() {
    const wimStatisticFromAPI = await listCarStore.getWIMStatistic()
    if (wimStatisticFromAPI) {
      wimStatistic.value = {
        totalTraffic: wimStatisticFromAPI.totalTraffic || 0,
        totalIsPassStaticService: wimStatisticFromAPI.totalIsPassStaticService || 0,
        totalIsPassImageService: wimStatisticFromAPI.totalIsPassImageService || 0,
        totalReportStatus: wimStatisticFromAPI.totalReportStatus || 0,
      }
    }
  }

  async function loadIMPSSummaryData() {
    const starDate = dayjs().format('YYYY-MM-DDT00:00:00+07:00')
    let endDate = dayjs().format('YYYY-MM-DDTHH:mm:ss+07:00')
    if (endDate < starDate) {
      endDate = starDate
    }
    filter.value.startDate = starDate
    filter.value.endDate = endDate
    const report = await listCarStore.getReport(filter.value)
    if (report) {
      currentTrafficFromSummaryReportAPI.value = report
      const { data } = report
      totalOverWeightFromIMPS.value = data.map((item) => item.overWeight).reduce((partialSum, a) => partialSum + a, 0)
      totalErrorFromIMPS.value = data.map((item) => item.errorFlag).reduce((partialSum, a) => partialSum + a, 0)
      totalPassFromIMPS.value = data.map((item) => item.total).reduce((partialSum, a) => partialSum + a, 0)
    }
  }

  async function getDataSetForHistoryChart() {
    const timeFrames = [
      {
        label: '00:00-03:59',
        startTime: dayjs().format('YYYY-MM-DDT00:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT03:59:59+07:00'),
      },
      {
        label: '04:00-07:59',
        startTime: dayjs().format('YYYY-MM-DDT04:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT07:59:59+07:00'),
      },
      {
        label: '08:00-11:59',
        startTime: dayjs().format('YYYY-MM-DDT08:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT11:59:59+07:00'),
      },
      {
        label: '12:00-15:59',
        startTime: dayjs().format('YYYY-MM-DDT12:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT15:59:59+07:00'),
      },
      {
        label: '16:00-19:59',
        startTime: dayjs().format('YYYY-MM-DDT16:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT19:59:59+07:00'),
      },
      {
        label: '20:00-23:59',
        startTime: dayjs().format('YYYY-MM-DDT20:00:00+07:00'),
        endTime: dayjs().format('YYYY-MM-DDT23:59:59+07:00'),
      },
    ]
    const data = await listCarStore.generateHistoryReportDataByTimeframe(timeFrames)
    const labels = []
    const totalTraffics = []
    const totalOverWeights = []

    for (const item of data) {
      const { label, data } = item
      const total = data.map((item) => item.total).reduce((partialSum, a) => partialSum + a, 0)
      const totalOverWeight = data.map((item) => item.overWeight).reduce((partialSum, a) => partialSum + a, 0)
      labels.push(label)
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
          label: 'น้ำหนักเกิน',
          borderColor: '#AC3E31',
          backgroundColor: '#AC3E31',
          data: totalOverWeights,
        },
      ],
    }
    refreshChart.value++
  }

  function isWaitingForSyncDataFrom3DService(plate, timestamp) {
    if (!plate || !plate.license_plate) {
      return false
    }
    const now = new Date()
    const startTime = new Date(timestamp)
    const difference = now - startTime

    const differenceInMinutes = difference / (1000 * 60)

    if (differenceInMinutes <= 3) {
      return true
    } else {
      return false
    }
  }

  function gotoLink(id, date) {
    router.push(`/data-detail/${id}/${date}`)
  }
</script>

<style lang="scss">
  .object-contain {
    max-height: 150px;
  }

  .label {
    font-size: 20px;
  }

  .value {
    color: #101341;
    font-size: 20px;
    font-weight: bold;
  }

  .red {
    color: red;
  }

  .hide {
    visibility: hidden;
  }

  .font-48 {
    font-size: 52px;
  }

  .font-16 {
    font-size: 16px;
  }

  .font-24 {
    font-size: 24px;
  }

  /* .hidden {
    visibility: hidden;
  } */

  .show {
    visibility: visible;
  }

  #cctvCard {
    .va-card {
      height: 320px;
    }
  }

  .va-chart > canvas {
    height: 237px !important;
  }

  #line-chart {
    padding-top: 10px;
  }
</style>
