<template>
  <va-card>
    <va-card-title> สถานะรถเข้าออก {{ startTime === endTime ? 'รายชั่วโมง' : 'รายวัน' }}</va-card-title>
    <va-card-content v-if="last5DaysGraphDataChart">
      <va-chart :data="last5DaysGraphDataChart" :options="options" type="line" />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../../general/charts/composables/useChartData'
  const props = defineProps<{ dataset: any; startTime: string; endTime: string }>()
  const last5DaysGraphDataChart = useChartData(props.dataset, 0.7)
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'จำนวนรถทั้งหมด',
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: 'ช่วงเวลา',
        },
      },
    },
  }
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
</style>
