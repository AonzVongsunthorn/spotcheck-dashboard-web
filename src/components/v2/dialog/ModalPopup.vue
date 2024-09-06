<template>
  <div :class="getClass()">
    <loading v-model:active="isLoading" :is-full-page="true" />
    <div class="modal-popup">
      <div class="bg-[#0F1342] rounded-t-3xl flex flex-initial justify-between px-4 py-2 text-white">
        <h1 class="text-3xl">ImPS (WIM)</h1>
        <div v-if="!isPrintMode" class="text-right">
          <va-icon class="material-icons" size="large" @click="print()">print</va-icon>
        </div>
      </div>
      <div class="flex gap-2 justify-center my-3 mx-auto px-5">
        <img :src="traffic.imageUrl" alt="" class="w-60 h-60 object-fill" />
        <img :src="traffic.imagePlatUrl" alt="" class="w-60 h-60 object-fill" />
      </div>
      <div>
        <table class="table-fixed w-full table-modal text-md">
          <tr class="bg-[#0f134204]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-bold font-standard">สถานี</div>
                <div class="w-1/2 font-standard">{{ traffic.station }}</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">เลน</div>
                <div class="w-1/2 font-standard">{{ traffic.lane }}</div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ลำดับ</div>
                <div class="w-1/2 font-standard">{{ traffic.id }}</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ความเร็ว</div>
                <div class="w-1/2 font-standard">{{ (traffic.speed || 0).toFixed(0) }} กม/ชม</div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">วันที่-เวลา</div>
                <div class="w-1/2 font-standard">{{ traffic.time }}</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ความยาว</div>
                <div class="w-1/2 font-standard">{{ (traffic.length / 100 || 0).toLocaleString() }} ม.</div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ประเภทรถ</div>
                <div class="w-1/2 font-standard">{{ traffic.verticalType }}</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ป้ายทะเบียน</div>
                <div class="w-1/2 font-standard">{{ traffic.plate }}</div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">จำนวนเพลา</div>
                <div class="w-1/2 font-standard">{{ traffic.totalShaft }} เพลา</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ภาพป้ายทะเบียน</div>
                <div class="w-1/2">
                  <img :src="traffic.plateCropImageUrl" class="object-contain h-12" />
                </div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ลักษณะรถ</div>
                <div class="w-1/2">
                  <VehicleType :vehicle-class-id="traffic.vehicleClassID" status="pass" custom-style="width: 120px;" />
                </div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ESAL(f/R10/R11)</div>
                <div class="w-1/2 font-standard">{{ (traffic.esal || 0).toFixed(5) }}</div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">นน.พิกัด</div>
                <div class="w-1/2 font-standard">{{ (traffic.weightMax || 0).toLocaleString() }} กก.</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ผลการเดินรถ</div>
                <div class="w-1/2">
                  <button v-if="traffic.errorFlags" class="px-3 py-1 bg-red-500 rounded-full text-white font-bold">
                    Error
                  </button>
                  <p v-else>-</p>
                </div>
              </div>
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">นน.วัดได้</div>
                <div class="w-1/2 font-standard">{{ (traffic.gvw || 0).toLocaleString() }} กก.</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ผลการวัดน้ำหนัก</div>
                <div class="w-1/2">
                  <button
                    v-if="traffic.gvw <= traffic.weightMax"
                    class="px-3 py-1 bg-green-500 rounded-full text-white font-bold"
                  >
                    ผ่าน
                  </button>
                  <button
                    v-if="traffic.gvw > traffic.weightMax"
                    class="px-3 py-1 bg-red-500 rounded-full text-white font-bold"
                  >
                    คาดว่าเกิน {{ calculatePercent(traffic.gvw, traffic.weightMax) }}%
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="is3DEnabled" class="bg-[#0f134204]">
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ภาพจาก 3D</div>
                <div v-if="traffic.dataFrom3D.imagePath" class="w-1/2 font-standard">
                  <img :src="build3DStaticURL(traffic.dataFrom3D.imagePath)" alt="" class="w-24 h-24 object-fill" />
                </div>
                <div v-else class="w-1/2 font-standard">ไม่พบข้อมูลจากระบบ 3D</div>
              </div>
            </td>
            <td class="border-list">
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ข้อมูลจากระบบ 3D</div>
              </div>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">กว้าง</div>
                <div v-if="traffic.dataFrom3D.width" class="w-1/2 font-standard">
                  {{ (traffic.dataFrom3D.width / 1000).toFixed(2) }} ม.
                </div>
                <div v-else class="w-1/2 font-standard">ไม่พบข้อมูล</div>
              </div>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">ยาว</div>
                <div v-if="traffic.dataFrom3D.long" class="w-1/2 font-standard">
                  {{ (traffic.dataFrom3D.long / 1000).toFixed(2) }} ม.
                </div>
                <div v-else class="w-1/2 font-standard">ไม่พบข้อมูล</div>
              </div>
              <div class="flex">
                <div class="w-1/2 font-standard font-bold">สูง</div>
                <div v-if="traffic.dataFrom3D.height" class="w-1/2 font-standard">
                  {{ (traffic.dataFrom3D.height / 1000).toFixed(2) }} ม.
                </div>
                <div v-else class="w-1/2 font-standard">ไม่พบข้อมูล</div>
              </div>
            </td>
          </tr>
        </table>
        <table class="table-fixed w-full table-modal">
          <tr class="bg-[#0F1342] text-white text-center">
            <td class="border-list font-bold font-standard table-title">เพลา</td>
            <td
              v-for="(item, index) in traffic.axles"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ index + 1 }}
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list font-bold table-title font-standard">ระยะระหว่างเพลา (ซม.)</td>
            <td
              v-for="(item, index) in traffic.axles"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ (item.wheelbase || 0).toFixed(2).toLocaleString() }}
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list font-bold table-title font-standard">กลุ่มเพลา</td>
            <td
              v-for="(item, index) in traffic.axles"
              :key="index"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ item.groupID }}
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list font-bold table-title font-standard">ประเภทล้อ</td>
            <td
              v-for="(item, index) in traffic.axles"
              :key="index"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ item.dualTire ? 'ล้อคู่' : 'ล้อเดี่ยว' }}
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list font-bold table-title font-standard">นน. ล้อซ้าย</td>
            <td
              v-for="(item, index) in traffic.axles"
              :key="index"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ (item.weightLeft || 0).toLocaleString() }}
            </td>
          </tr>
          <tr class="bg-[#0f134231]">
            <td class="border-list font-bold table-title font-standard">นน. ล้อขวา</td>
            <td
              v-for="(item, index) in traffic.axles"
              :key="index"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ (item.weightRight || 0).toLocaleString() }}
            </td>
          </tr>
          <tr class="bg-[#0f134204]">
            <td class="border-list font-bold table-title font-standard">เพลา (กก.)</td>
            <td
              v-for="(item, index) in traffic.axles"
              :key="index"
              :class="
                index + 1 < traffic.axles.length
                  ? 'border-list text-center font-bold font-standard'
                  : 'text-center font-bold font-standard'
              "
            >
              {{ (item.weight || 0).toLocaleString() }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
  import VehicleType from '../vehicle-type/VehicleIcon.vue'
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import dayjs from 'dayjs'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import printJS from 'print-js'
  import {
    build3DStaticURL,
    buildStaticURL,
    calculatePercent,
    convertDateToHumanUnderstandable,
    getDateFromTimestamp,
    getTimeFromTimestamp,
  } from '../../../helpers/utilities'
  import { call3DAPI } from '../../../services/api/v2/3d'
  const CURRENT_SITE_URL = import.meta.env.VITE_CURRENT_SITE_URL

  const listCarStore = useDashboardStore()
  const { filter, isLoading, is3DEnabled } = storeToRefs(listCarStore)

  const traffic = ref({
    imageUrl: '',
    imagePlatUrl: '',
    station: '',
    id: '',
    runningNumber: '',
    verticalType: '',
    time: '',
    totalShaft: '',
    verticalTypeImageUrl: '',
    weightMax: '',
    gvw: '',
    overWeight: '-',
    lane: '',
    speed: '',
    length: '',
    frontWheel: '-',
    backWheel: '-',
    plate: '',
    plateCropImageUrl: '',
    esal: '',
    violation: '',
    status: '',
    vehicleClassID: '',
    axles: [],
    warningFlags: 0,
    errorFlags: 0,
    dataFrom3D: {
      width: '',
      long: '',
      height: '',
      imagePath: '',
    },
  })
  const id = ref('')
  const date = ref('')
  const isPrintMode = ref(false)

  const route = useRoute()
  onMounted(async () => {
    id.value = route.params.id
    date.value = route.params.date
    isPrintMode.value = route.params.printMode
    filter.value.startDate = dayjs().format(`${date.value}T00:00:00+07:00`)
    filter.value.endDate = dayjs().format(`${date.value}T23:59:59+07:00`)
    const { data } = await listCarStore.searchWithSpecificId(id.value, filter.value)
    const dataFrom3D = {
      width: '',
      long: '',
      height: '',
      imagePath: '',
    }
    if (data.length) {
      const searchResult = data[0]
      if (is3DEnabled.value) {
        const { stamp } = searchResult
        console.log('stamp', stamp)
        const startDateFor3D = dayjs(stamp).subtract(5, 'minutes').format('DD-MM-YYYY HH:mm:ss')
        const endDateFor3D = dayjs(stamp).add(5, 'minutes').format('DD-MM-YYYY HH:mm:ss')
        const { data: dataFrom3DService } = await call3DAPI({ startDate: startDateFor3D, stopDate: endDateFor3D })
        if (data) {
          const plate = searchResult.plate.license_plate
          if (plate && plate !== '') {
            const dataFrom3DFilterByPlate = dataFrom3DService.find((item) => item.license_plate === plate)
            console.log('dataFrom3DFilterByPlate', dataFrom3DFilterByPlate)
            if (dataFrom3DFilterByPlate) {
              dataFrom3D.width = dataFrom3DFilterByPlate.width
              dataFrom3D.long = dataFrom3DFilterByPlate.long
              dataFrom3D.height = dataFrom3DFilterByPlate.hight
              dataFrom3D.imagePath = dataFrom3DFilterByPlate.pathPCDImage
            }
          }
        }
      }
      console.log('dataFrom3D', dataFrom3D)
      traffic.value.imageUrl = buildStaticURL(searchResult.images[0].url)
      traffic.value.imagePlatUrl = buildStaticURL(searchResult.plate.plate_path)
      traffic.value.station = searchResult.station.stationName
      traffic.value.id = searchResult.id
      traffic.value.runningNumber = 'N/A'
      traffic.value.verticalType = searchResult.BosureDescription
      traffic.value.time = `${convertDateToHumanUnderstandable(
        getDateFromTimestamp(searchResult.stamp),
      )} ${getTimeFromTimestamp(searchResult.stamp)}`
      traffic.value.totalShaft = searchResult.axlesCount
      traffic.value.verticalTypeImageUrl = buildStaticURL(searchResult.images_01)
      traffic.value.weightMax = searchResult.GVW_Weight_Max
      traffic.value.gvw = searchResult.gvw
      traffic.value.overWeight = searchResult.gvw - searchResult.GVW_Weight_Max
      traffic.value.lane = searchResult.lane
      traffic.value.speed = searchResult.speed
      traffic.value.length = searchResult.length
      traffic.value.frontWheel = 'N/A'
      traffic.value.backWheel = 'N/A'
      traffic.value.plate = `${searchResult.plate.license_plate} ${searchResult.plate.province}`
      traffic.value.plateCropImageUrl = searchResult.plate.crop_path
        ? buildStaticURL(searchResult.plate.crop_path)
        : buildStaticURL(searchResult.plate.plate_path)
      traffic.value.esal = searchResult.esal
      traffic.value.violation = searchResult.violation
      traffic.value.status = 'N/A'
      traffic.value.vehicleClassID = searchResult.VehicleClassID
      traffic.value.axles = searchResult.axles
      traffic.value.errorFlags = searchResult.errorFlags
      traffic.value.warningFlags = searchResult.warningFlags
      traffic.value.dataFrom3D = dataFrom3D
    }
  })

  function getClass() {
    return (isPrintMode.value || '').toLowerCase() === 'true' ? 'mx-auto w-12/12' : 'mx-auto my-10 w-4/5'
  }

  async function print() {
    const currentUrl = `${CURRENT_SITE_URL}traffic-report/${id.value}/${date.value}`
    const { base64 } = await listCarStore.generatePDF(currentUrl)
    printJS({
      printable: base64,
      type: 'pdf',
      base64: true,
    })
  }
</script>
<style>
  .object-contain {
    max-height: 200px;
    overflow: hidden;
  }
  .font-standard {
    font-size: 22px;
  }
</style>
