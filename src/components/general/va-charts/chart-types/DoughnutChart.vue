<template>
  <Doughnut :chart-options="chartOptions" :chart-data="props.chartData" />
</template>

<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import type { TChartOptions } from 'vue-chartjs/dist/types'
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
  import { TDoughnutChartData } from '../../charts/types'

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels)

  const props = defineProps<{
    chartData: TDoughnutChartData
    chartOptions?: TChartOptions<'doughnut'>
  }>()
</script>
