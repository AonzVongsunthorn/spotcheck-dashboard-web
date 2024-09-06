<template>
  <component :is="chartComponent" :ref="ref" class="va-chart" :chart-options="chartOptions" :chart-data="data" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { TChartOptions } from 'vue-chartjs/dist/types'
  import { defaultConfig, chartTypesMap } from './vaChartConfigs'
  import { TChartData } from '../charts/types'

  const props = defineProps<{
    // eslint-disable-next-line vue/no-reserved-props
    ref?: string
    data: TChartData
    options?: TChartOptions<'line' | 'bar' | 'doughnut'>
    type: keyof typeof chartTypesMap
  }>()
  const chartComponent = computed(() => chartTypesMap[props.type])
  const chartOptions = computed(() => ({
    ...defaultConfig,
    ...props.options,
  }))
</script>
