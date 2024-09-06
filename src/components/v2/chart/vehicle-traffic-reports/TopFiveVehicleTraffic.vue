<template>
  <va-card>
    <va-card-title>
      ข้อมูลจำนวนรถบรรทุก (คัน) แบ่งตามประเภทรถ
      <va-button size="small" class="btn-position" @click="dashboardStore.changeTotalVehicleDashboardToPercentView()">
        {{ t('dashboard.switchToPercentView') }}
      </va-button>
    </va-card-title>
    <va-card-content>
      <va-chart :data="horizontalBarChartDataGenerated" type="horizontal-bar" />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import VaChart from '../../../general/va-charts/VaChart.vue'
  import { useChartData } from '../../../general/charts/composables/useChartData'
  import { useDashboardV1Store } from '../../../../stores/v1/dashboardStore'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const dashboardStore = useDashboardV1Store()
  const horizontalBarChartDataGenerated = useChartData(dashboardStore.totalTruckDashboard)
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
