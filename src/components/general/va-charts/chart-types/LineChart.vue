<template>
  <Line :chart-options="chartOptions" :height="350" :chart-data="props.chartData" />
</template>

<script setup lang="ts">
  import { Line } from 'vue-chartjs'
  import type { TChartOptions } from 'vue-chartjs/dist/types'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
  } from 'chart.js'
  import { TLineChartData } from '../../charts/types'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
    ChartDataLabels,
  )

  const props = defineProps<{
    chartData: TLineChartData
    chartOptions?: TChartOptions<'line'>
  }>()
</script>
