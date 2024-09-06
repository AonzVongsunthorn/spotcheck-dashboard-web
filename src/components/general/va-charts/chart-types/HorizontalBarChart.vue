<template>
  <Bar :height="200" :chart-options="{ ...chartOptions, ...horizontalBarOptions }" :chart-data="props.chartData" />
</template>

<script setup lang="ts">
  import { Bar } from 'vue-chartjs'
  import type { TChartOptions } from 'vue-chartjs/dist/types'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale } from 'chart.js'
  import { TBarChartData } from '../../charts/types'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, ChartDataLabels)

  const horizontalBarOptions = {
    indexAxis: 'y' as 'x' | 'y',
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 0
        },
        color: 'black',
        anchor: 'end',
        align: 'end',
      },
    },
    legend: {
      display: true,
      labels: {
        font: {
          size: 24,
          weight: 'bold',
          display: false,
        },
      },
    },
  }

  const props = defineProps<{
    chartData: TBarChartData
    chartOptions?: TChartOptions<'bar'>
  }>()
</script>
