<template>
  <div class="mx-1">
    <div class="px-10 mt-3">
      <h1 class="title">รายงานสรุปผลการตรวจวัดน้ำหนักรถบรรทุก ระหว่างวันที่
        {{convertDateToHumanUnderstandable(startDate)}}
        ถึง {{convertDateToHumanUnderstandable(endDate)}}
      </h1>
      <ReportTable />
    </div>
    <div style="page-break-before:always">&nbsp;</div>
    <div class="px-10 mt-3">
      <OverWeightChart v-if="reportGraphData.datasets.length" :key="refreshChart" />
    </div>
  </div>
</template>
<script setup>
import { useDashboardStore } from "../../../stores/v2/dashboardStore";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import 'vue-loading-overlay/dist/css/index.css';
import OverWeightChart from '../chart/OverWeightChart.vue'
import ReportTable from '../tables/ReportTable.vue'
import {
  convertDateToHumanUnderstandable
} from '../../../helpers/utilities'

const listCarStore = useDashboardStore()
const {
  filter,
  reportGraphData,
  isLoading
} = storeToRefs(listCarStore)

const refreshChart = ref(0)
const startDate = ref('')
const endDate = ref('')

const route = useRoute()
onMounted(async () => {
  startDate.value = route.params.startDate
  endDate.value = route.params.endDate
  filter.value.startDate = `${startDate.value}T00:00:00+07:00`
  filter.value.endDate = `${endDate.value}T23:59:59+07:00`
  const result = await listCarStore.getReport(filter.value)
  listCarStore.setReportGraphData(result)
  listCarStore.setReportList(result)
  refreshChart.value++
});
</script>
<style>
.thead td{
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  font-size: 15px !important;
}
td {
  padding: 1px !important;
  font-size: 16px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
</style>
