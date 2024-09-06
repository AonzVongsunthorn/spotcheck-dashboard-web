<template>
  <va-card>
    <va-card-title> ข้อมูลการจราจรผ่าน IMPS ย้อนหลัง {{ TOTAL_DAYS_HISTORY_TRAFFIC }} วัน </va-card-title>
    <va-card-content v-if="last5DaysGraphDataChart">
      <va-chart :data="last5DaysGraphDataChart" :options="options" type="line" />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../general/charts/composables/useChartData'
  import { TOTAL_DAYS_HISTORY_TRAFFIC } from '../../../constants'
  const props = defineProps<{ dataset: any }>()
  const last5DaysGraphDataChart = useChartData(props.dataset, 0.7)
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
        padding: {
          top: 20,
        },
      },
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 0
        },
        color: 'black',
        anchor: 'end',
        align: 'right',
        padding: {
          bottom: 5,
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
