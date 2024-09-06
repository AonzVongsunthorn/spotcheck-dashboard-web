<template>
  <va-card>
    <va-card-title>
      <p class="text-xl">จำนวนที่ผ่านระบบทุกประเภทตามลำดับจำนวน มากไปน้อย (5อันดับแรก)</p>
    </va-card-title>
    <va-card-content>
      <va-chart :data="horizontalBarChartDataGenerated" type="horizontal-bar" />
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
  const horizontalBarChartDataGenerated = useChartData(dashboardStore.top5TrafficDashboard)
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
