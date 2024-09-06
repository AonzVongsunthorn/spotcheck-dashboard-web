<template>
  <va-card>
    <va-card-title>ข้อมูลรถบรรทุก แบ่งตามช่วงเวลา</va-card-title>
    <va-card-content>
      <va-chart v-if="barChartDataGenerated" :data="barChartDataGenerated" :options="options" type="bar" />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../general/charts/composables/useChartData'
  import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'จำนวนรถ (คัน)',
          font: {
            size: 14,
            weight: 'bolder',
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'ช่วงเวลา',
          font: {
            size: 14,
            weight: 'bolder',
          },
        },
      },
    },
  }
  const dashboardStore = useDashboardV1Store()
  const barChartDataGenerated = useChartData(dashboardStore.truckByTimePeriod)
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
</style>
