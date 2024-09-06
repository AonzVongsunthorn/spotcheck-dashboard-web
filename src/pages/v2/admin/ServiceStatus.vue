<template>
  <table class="table-fixed w-full border-table mt-20 px-10" v-if="listOfExecutionLogs.data.length">
    <tr class="thead">
      <td>เหตุการณ์</td>
      <td>เวลาที่ดึงข้อมูลล่าสุด</td>
    </tr>
    <tr :class="getRowColor(index)" v-for="(row, index) of listOfExecutionLogs.data">
      <td>{{row.jobTitle}}</td>
      <td>{{row.lastExecutionAt}}</td>
    </tr>
  </table>
</template>
<script setup>
import { useDashboardStore } from "../../../stores/v2/dashboardStore";
import {
  getRowColor,
} from '../../../helpers/utilities'
import { onMounted, ref } from "vue";
const listOfExecutionLogs = ref({ data: [] })
const listCarStore = useDashboardStore()
onMounted(async () => {
  listOfExecutionLogs.value= await listCarStore.getExecutionLogAPI()
})
</script>
