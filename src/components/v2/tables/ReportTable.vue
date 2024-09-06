<template>
  <table class="xl:table-fixed w-full border-table">
    <tr class="thead">
      <td class="xl:whitespace-normal whitespace-nowrap">ประเภทรถบรรทุก</td>
      <td>จำนวนเพลา</td>
      <td>พิกัดน้ำหนัก(ตัน)</td>
      <td>จำนวนรถ(คัน)</td>
      <td>จำนวนรถที่<br/> อาจมีน้ำหนักเกิน</td>
      <td>จำนวนรถที่<br/> มีข้อผิดพลาดอื่น</td>
      <td>จำนวนรถที่<br/> ผ่านได้<br/> โดยไม่ต้องเข้าชั่ง</td>
    </tr>
    <tr :class="getRowColor(index)" v-for="(row, index) of reportList">
      <td class="xl:whitespace-normal whitespace-nowrap">{{row.title}}</td>
      <td>{{row.totalAxles}}</td>
      <td>{{row.maxWeight}}</td>
      <td>{{row.total}}</td>
      <td>{{row.overWeight}}</td>
      <td>{{row.errorFlag}}</td>
      <td>{{row.normalWeight}}</td>
    </tr>
  </table>
</template>
<script setup>
import { useDashboardStore } from "../../../stores/v2/dashboardStore";
import { storeToRefs } from "pinia";

import 'vue-loading-overlay/dist/css/index.css';
import {
  getRowColor,
} from '../../../helpers/utilities'
const listCarStore = useDashboardStore()
const {
  reportList,
} = storeToRefs(listCarStore)

</script>
