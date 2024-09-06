<template>
  <va-card>
    <va-card-title>
      <p class="text-xl">จำนวนรถที่ผ่านระบบ รถไม่เข้าชั่ง 5 อันดับแรกที่จำนวนมาก</p>
    </va-card-title>
    <va-card-content>
      <va-chart
        ref="doughnutChart"
        :ref="refName"
        class="chart chart--donut"
        :data="data"
        type="doughnut"
        :options="defaultOption"
      />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../../general/charts/composables/useChartData'
  import { useImageServiceDashboardStore } from '../../../../stores/v2/imageServiceDashboardStore'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const dashboardStore = useImageServiceDashboardStore()
  const defaultOption = {
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
        color: 'black',
        anchor: 'center',
        align: 'center',
      },
    },
  }
  const refName = 'doughnut-chart'
  const data = useChartData(dashboardStore.top5TrafficDashboardForDoughnutChart)
</script>
<style lang="scss">
  .va-chart > canvas {
    height: 237px !important;
  }
</style>
