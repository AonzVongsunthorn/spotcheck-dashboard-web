<template>
  <va-card class="min-w-[600px]">
    <va-card-title
      >รายงานสรุปผลการตรวจวัดน้ำหนักรถบรรทุก ระหว่างวันที่
      {{ convertDateToHumanUnderstandable(getDateFromTimestamp(filter.startDate)) }} ถึง
      {{ convertDateToHumanUnderstandable(getDateFromTimestamp(filter.endDate)) }}</va-card-title
    >
    <va-card-content>
      <va-chart
        v-if="barChartDataGenerated"
        :data="barChartDataGenerated"
        :options="options"
        type="bar"
        class="min-w-[550px]"
      />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../general/charts/composables/useChartData'
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { storeToRefs } from 'pinia'
  import { getDateFromTimestamp, convertDateToHumanUnderstandable } from '../../../helpers/utilities'
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
          text: 'ประเภทรถ',
          font: {
            size: 14,
            weight: 'bolder',
          },
        },
      },
    },
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
          top: 0,
        },
        color: 'black',
        anchor: 'end',
        align: 'end',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  }
  const dashboardStore = useDashboardStore()
  const { filter } = storeToRefs(dashboardStore)
  const barChartDataGenerated = useChartData(dashboardStore.reportGraphData)
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
</style>
