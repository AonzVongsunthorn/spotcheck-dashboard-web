<template>
  <va-card>
    <va-card-title>
      <div v-if="chartDisplayMode === totalTrafficMode">Top 5 ประเภทรถที่วิ่งผ่านระบบ IMPS</div>
      <div v-if="chartDisplayMode === totalOverWeightMode">Top 5 ประเภทรถที่คาดว่าน้ำหนักเกิน</div>
      <va-button
        v-if="chartDisplayMode === totalTrafficMode"
        size="medium"
        class="btn-position"
        @click="showTotalOverWeightChart()"
      >
        น้ำหนักเกิน
      </va-button>
      <va-button
        v-if="chartDisplayMode === totalOverWeightMode"
        size="medium"
        class="btn-position"
        @click="showTotalTrafficChart()"
      >
        ทั้งหมด
      </va-button>
    </va-card-title>
    <va-card-content v-if="top5OfTrafficData">
      <va-chart
        v-if="chartDisplayMode === totalTrafficMode"
        ref="doughnutChart"
        class="chart chart--donut"
        :data="top5OfTrafficData"
        type="doughnut"
        :options="defaultOption"
      />
      <va-chart
        v-if="chartDisplayMode === totalOverWeightMode"
        ref="doughnutChart"
        class="chart chart--donut"
        :data="top5OfOverWeightData"
        type="doughnut"
        :options="defaultOption"
      />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../general/charts/composables/useChartData'
  import { ref } from 'vue'
  const props = defineProps<{ data: any }>()
  const totalTrafficMode = 'total-traffic'
  const totalOverWeightMode = 'total-over-weight'
  const chartDisplayMode = ref(totalTrafficMode)
  const { data, vehicleClass } = props.data
  const chartColours: any[] = ['#E7373D', '#3D61C7', '#FFD850', '#539B23', '#6affd6', '#ff9900']
  const vehicleClasses: any[] = []
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
  for (const item of vehicleClass) {
    vehicleClasses[item.VehicleClassID] = item.BosureDescription
  }

  const top5OfTrafficData = buildTop5TrafficDataset(data, vehicleClasses)
  const top5OfOverWeightData = buildTop5OverWeightDataset(data, vehicleClasses)

  function buildTop5OverWeightDataset(data, vehicleClasses) {
    const orderingTraffic = data
      .slice()
      .filter((item) => item.total > 0)
      .sort((a, b) => {
        return b.overWeight - a.overWeight
      })

    const top5OfOverWeight = orderingTraffic.slice(0, 5)
    const otherFromTop5 = orderingTraffic.slice(5, orderingTraffic.length)

    const top5OfOverWeightLabels = top5OfOverWeight.map((item) => vehicleClasses[item.vehicleClassID])
    const top5OfOverWeightData = top5OfOverWeight.map((item) => item.overWeight)

    const otherFromTop5Data = otherFromTop5
      .map((item) => item.overWeight)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    top5OfOverWeightLabels.push('อื่นๆ')
    top5OfOverWeightData.push(otherFromTop5Data)

    const top5OfOverWeightDataset = {
      labels: top5OfOverWeightLabels,
      datasets: [
        {
          backgroundColor: chartColours,
          data: top5OfOverWeightData,
        },
      ],
    }
    return useChartData(top5OfOverWeightDataset, 0.7)
  }
  function buildTop5TrafficDataset(data, vehicleClasses) {
    const orderingTraffic = data
      .slice()
      .filter((item) => item.total > 0)
      .sort((a, b) => {
        return b.total - a.total
      })

    const top5OfTraffic = orderingTraffic.slice(0, 5)
    const otherFromTop5 = orderingTraffic.slice(5, orderingTraffic.length)

    const top5OfTrafficLabels = top5OfTraffic.map((item) => vehicleClasses[item.vehicleClassID])
    const top5OfTrafficData = top5OfTraffic.map((item) => item.total)
    const otherFromTop5Data = otherFromTop5
      .map((item) => item.total)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    top5OfTrafficLabels.push('อื่นๆ')
    top5OfTrafficData.push(otherFromTop5Data)

    const top5TrafficDataset = {
      labels: top5OfTrafficLabels,
      datasets: [
        {
          backgroundColor: chartColours,
          data: top5OfTrafficData,
        },
      ],
    }
    return useChartData(top5TrafficDataset, 0.7)
  }

  function showTotalOverWeightChart() {
    chartDisplayMode.value = totalOverWeightMode
  }

  function showTotalTrafficChart() {
    chartDisplayMode.value = totalTrafficMode
  }
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
  .btn-position {
    position: absolute;
    right: 0;
    margin-right: 4%;
  }
</style>
