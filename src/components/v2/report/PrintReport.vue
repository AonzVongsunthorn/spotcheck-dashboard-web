<template>
  <div>
    <table class="table-auto">
      <tr>
        <td colspan="1" class="p-5 border-r-0">
          <img src="/logo-header-print.png" alt="" class="object-contain mx-auto" />
        </td>
        <td colspan="3" class="text-right border-l-0 p-5">
          รายงานการตรวจสอบรถบรรทุกโดยระบบ Weight In motion for ImPS <br />
          สำนักงานควบคุมน้ำหนักยานพาหนะ กรมทางหลวง <br />
          สถานีตรวจสอบน้ำหนัก {{ traffic.station }}
        </td>
      </tr>
      <tr>
        <td class="w-1/2 text-center" colspan="2">
          <p>ภาพรถบรรทุก</p>
          <img :src="traffic.imageUrl" alt="" class="w-96 h-60 object-cover mx-auto" />
        </td>
        <td class="w-1/2 text-center" colspan="2">
          <p>ภาพป้ายทะเบียน</p>
          <img :src="traffic.imagePlatUrl" alt="" class="w-96 h-60 object-cover mx-auto" />
        </td>
      </tr>
      <tr>
        <td class="w-1/6">สถานี</td>
        <td>
          <div>{{ traffic.station }}</div>
        </td>
        <td class="w-1/6">เลน</td>
        <td>
          <div>{{ traffic.lane }}</div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">ลำดับ</td>
        <td>
          <div>{{ traffic.id }}</div>
        </td>
        <td class="w-1/6">ความเร็ว</td>
        <td>
          <div>{{ (traffic.speed || 0).toFixed(0) }} กม/ชม</div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">วันที่-เวลา</td>
        <td>
          <div class="text-warp">{{ traffic.time }}</div>
        </td>
        <td class="w-1/6">ความยาว</td>
        <td>
          <div>{{ (traffic.length / 100 || 0).toLocaleString() }} ม.</div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">ประเภทรถ</td>
        <td>
          <div>{{ traffic.verticalType }}</div>
        </td>
        <td class="w-1/6">ป้ายทะเบียน</td>
        <td>
          <div>{{ traffic.plate }}</div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">จำนวนเพลา</td>
        <td>
          <div>{{ traffic.totalShaft }} เพลา</div>
        </td>
        <td class="w-1/6">ภาพป้ายทะเบียน</td>
        <td>
          <div>
            <img :src="traffic.plateCropImageUrl" />
          </div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">ลักษณะรถ</td>
        <td>
          <div>
            <VehicleType :vehicle-class-id="traffic.vehicleClassID" status="pass" custom-style="width: 120px;" />
          </div>
        </td>
        <td class="w-1/6">ESAL(f/R10/R11)</td>
        <td>
          <div>{{ (traffic.esal || 0).toFixed(5) }}</div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">นน.พิกัด</td>
        <td>
          <div>{{ (traffic.weightMax || 0).toLocaleString() }} กก.</div>
        </td>
        <td class="w-1/6">ผลการคัดกรอง</td>
        <td>
          <div>
            <span v-if="traffic.errorFlags">Error</span>
            <span v-else>-</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="w-1/6">นน.วัดได้</td>
        <td>
          <div>{{ (traffic.gvw || 0).toLocaleString() }} กก.</div>
        </td>
        <td class="w-1/6">นน.เกิน</td>
        <td>
          <div>
            <span v-if="traffic.gvw <= traffic.weightMax">ผ่าน</span>
            <span v-if="traffic.gvw > traffic.weightMax"
              >คาดว่าเกิน {{ calculatePercent(traffic.gvw, traffic.weightMax) }}%</span
            >
          </div>
        </td>
      </tr>
      <tr v-if="is3DEnabled">
        <td class="w-1/6">ภาพจาก 3D</td>
        <td>
          <div v-if="traffic.dataFrom3D.imagePath">
            <img :src="build3DStaticURL(traffic.dataFrom3D.imagePath)" class="w-28 h-28 object-fill" />
          </div>
          <div v-else>ไม่พบข้อมูลจากระบบ 3D</div>
        </td>
        <td class="w-1/6">ข้อมูลจากระบบ 3D</td>
        <td>
          <div>
            <span v-if="traffic.dataFrom3D.width">กว้าง: {{ (traffic.dataFrom3D.width / 1000).toFixed(2) }} ม.</span>
            <span v-else>กว้าง: ไม่พบข้อมูล</span>
            <br />
            <span v-if="traffic.dataFrom3D.long">ยาว: {{ (traffic.dataFrom3D.long / 1000).toFixed(2) }} ม.</span>
            <span v-else>ยาว: ไม่พบข้อมูล</span>
            <br />
            <span v-if="traffic.dataFrom3D.height">สูง: {{ (traffic.dataFrom3D.height / 1000).toFixed(2) }} ม.</span>
            <span v-else>กว้าง: ไม่พบข้อมูล</span>
          </div>
        </td>
      </tr>
    </table>
    <br />
    <div v-if="is3DEnabled" class="page-break"></div>
    <table class="table-print">
      <tr>
        <td>
          <center><strong>เพลา</strong></center>
        </td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          <center>
            <strong>{{ index + 1 }}</strong>
          </center>
        </td>
      </tr>
      <tr>
        <td>ระยะระหว่างเพลา (ซม.)</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          {{ (item.wheelbase || 0).toFixed(2).toLocaleString() }}
        </td>
      </tr>
      <tr>
        <td>กลุ่มเพลา</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">{{ item.groupID }}</td>
      </tr>
      <tr>
        <td>ประเภทล้อ</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          {{ item.dualTire ? 'ล้อคู่' : 'ล้อเดี่ยว' }}
        </td>
      </tr>
      <tr>
        <td>นน. ล้อซ้าย</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          {{ (item.weightLeft || 0).toLocaleString() }}
        </td>
      </tr>
      <tr>
        <td>นน. ล้อขวา</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          {{ (item.weightRight || 0).toLocaleString() }}
        </td>
      </tr>
      <tr>
        <td>นน.เพลา (กก.)</td>
        <td v-for="(item, index) in traffic.axles" :key="index" class="text-center">
          {{ (item.weight || 0).toLocaleString() }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup>
  import VehicleType from '../vehicle-type/VehicleIcon.vue'
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import dayjs from 'dayjs'
  import 'vue-loading-overlay/dist/css/index.css'
  import {
    build3DStaticURL,
    buildStaticURL,
    calculatePercent,
    convertDateToHumanUnderstandable,
    getDateFromTimestamp,
    getTimeFromTimestamp,
  } from '../../../helpers/utilities'
  import { call3DAPI } from '../../../services/api/v2/3d'

  const listCarStore = useDashboardStore()
  const { filter, is3DEnabled } = storeToRefs(listCarStore)

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
</script>
<style>
  @page {
    size: A4;
    margin: 10mm;
  }
  @media print {
    html,
    body {
      width: 210mm;
      height: 297mm;
    }
  }
  * {
    font-family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' !important;
    font-size: 16px !important;
  }
  table {
    border-collapse: collapse !important;
    width: 100%;
  }
  table,
  th,
  td {
    border: 1px solid;
    vertical-align: top;
    padding: 5px;
  }
  .page-break {
    display: block;
    page-break-before: always;
  }
</style>
