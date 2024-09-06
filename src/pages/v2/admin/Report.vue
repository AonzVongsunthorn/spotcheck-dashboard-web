<template>
  <div class="h-screen">
    <loading v-model:active="isLoading" :is-full-page="true" />
    <div class="top-nav pt-20 pb-5 px-5 xl:px-0 xl:p-10">
      <div class="flex flex-col gap-5">
        <div class="flex gap-20 justify-between">
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-2 items-start">
            <div>
              วันที่
              <input v-model="filter.selectedStartDate" type="date" placeholder="จาก" class="date-input" />
              <input v-model="filter.selectedEndDate" type="date" placeholder="ถึง" class="date-input" />
            </div>
            <div>
              <button class="px-3 py-1 bg-[#0F1342] text-white rounded-full" @click="search()">ค้นหา</button>
              <button class="ml-3 px-3 py-1 bg-[#3D9209] text-white rounded-full" @click="generateReport()">
                ออกรายงาน PDF
              </button>
              <button class="ml-3 px-3 py-1 bg-[#178DE3] text-white rounded-full" @click="exportCSV()">
                ออกรายงาน CSV
              </button>
            </div>
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
    <div class="xl:px-10 px-5 mt-3 overflow-x-scroll">
      <OverWeightChart v-if="reportGraphData.datasets.length" :key="refreshChart" />
    </div>
    <div class="xl:px-10 px-5 mt-3 overflow-x-scroll">
      <ReportTable />
    </div>
  </div>
</template>
<script setup>
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import dayjs from 'dayjs'
  import OverWeightChart from '../../../components/v2/chart/OverWeightChart.vue'
  import ReportTable from '../../../components/v2/tables/ReportTable.vue'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import printJS from 'print-js'
  import { createToast } from 'mosha-vue-toastify'
  const CURRENT_SITE_URL = import.meta.env.VITE_CURRENT_SITE_URL
  const listCarStore = useDashboardStore()
  const { filters, filter, reportList, reportGraphData, isLoading } = storeToRefs(listCarStore)

  const refreshChart = ref(0)

  async function exportCSV() {
    let csv =
      'ประเภทรถบรรทุก,ประเภทรถบรรทุก,พิกัดน้ำหนัก(ตัน),จำนวนรถ(คัน),จำนวนรถที่อาจมีน้ำหนักเกิน,จำนวนรถที่มีข้อผิดพลาดอื่น,จำนวนรถที่ผ่านได้โดยไม่ต้องเข้าชั่ง' +
      '\r\n'
    for (const row of reportList.value) {
      const item = [
        row.title,
        row.totalAxles,
        row.maxWeight,
        row.total,
        row.overWeight,
        row.errorFlag,
        row.normalWeight,
      ]
      csv += item.join(',')
      csv += '\r\n'
    }

    const anchor = document.createElement('a')
    // const blob = new Blob([csv], { type: 'text/csv;charset=utf-8\uFEFF,' })
    const blob = new Blob(
      [
        new Uint8Array([0xef, 0xbb, 0xbf]), // UTF-8 BOM
        csv,
      ],
      { type: 'text/plain;charset=utf-8' },
    )
    const objUrl = URL.createObjectURL(blob)
    // anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    anchor.href = objUrl
    anchor.target = '_blank'
    anchor.download = 'รายงานสรุปผลการตรวจวัดน้ำหนักรถบรรทุก.csv'
    anchor.click()
  }

  async function generateReport() {
    try {
      const { selectedStartDate, selectedEndDate } = filter.value
      const currentUrl = `${CURRENT_SITE_URL}report/${selectedStartDate}/${selectedEndDate}`
      const { base64 } = await listCarStore.generatePDF(currentUrl)
      printJS({
        printable: base64,
        type: 'pdf',
        base64: true,
      })
    } catch (error) {
      const { data } = error.response
      const { message } = data
      console.error(message)
      createToast('เกิดปัญหาระหว่างออกรายงาน', {
        position: 'top-right',
        type: 'danger',
        onClose: () => {
          listCarStore.disableLoading()
        },
      })
    }
  }

  async function search() {
    const { selectedStartDate, selectedEndDate } = filter.value
    filter.value.startDate = `${selectedStartDate}T00:00:00+07:00`
    filter.value.endDate = `${selectedEndDate}T23:59:59+07:00`
    const result = await listCarStore.getReport(filter.value)
    listCarStore.setReportGraphData(result)
    listCarStore.setReportList(result)
    refreshChart.value++
  }

  onMounted(async () => {
    filter.value.startDate = dayjs().format('YYYY-MM-DDT00:00:00+07:00')
    filter.value.endDate = dayjs().format('YYYY-MM-DDT23:59:59+07:00')
    const result = await listCarStore.getReport(filter.value)
    listCarStore.setReportGraphData(result)
    listCarStore.setReportList(result)
    refreshChart.value++
  })
</script>

<style>
  .date-input {
    width: 45%;
  }
  .hide {
    visibility: hidden;
  }
</style>
