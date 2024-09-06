<template>
  <va-card>
    <va-card-title>
      <p class="text-xl">ปริมาณจำนวนรถที่ระบบตามช่วงเวลา รถที่ระบบ / รถที่น้ำหนักเกิน</p>
    </va-card-title>
    <va-card-content>
      <va-chart :data="data" type="bar" :options="options" />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../../../general/charts/composables/useChartData'
  import { useImageServiceDashboardStore } from '../../../../../stores/v2/imageServiceDashboardStore'
  const dashboardStore = useImageServiceDashboardStore()
  const data = useChartData(dashboardStore.totalTrafficCompareWithTotalOverweightBarChart)
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            color: '#34495e',
            family: 'sans-serif',
            size: 14,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
          family: 'sans-serif',
        },
        boxPadding: 4,
      },
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 0
        },
        padding: {
          bottom: -15,
        },
        color: 'black',
        anchor: 'end',
        align: 'end',
      },
    },
  }
</script>
