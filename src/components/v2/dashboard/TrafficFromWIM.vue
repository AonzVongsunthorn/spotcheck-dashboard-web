<template>
  <va-card>
    <va-card-title>{{ t('dashboard.wimTitle') }}</va-card-title>
    <div class="row">
      <va-alert color="#1984C5" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFromWIMDashboard.highSpeed || 0).toLocaleString() }} คัน</h4>
        </template>
        <va-divider />
        ปริมาณที่รถผ่านระบบ High Speed (คัน)
      </va-alert>
      <va-alert color="#1984C5" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">
            {{ (trafficFromWIMDashboard.highSpeedWithOverWeight || 0).toLocaleString() }} คัน /
            {{ (trafficFromWIMDashboard.highSpeedWithOverWeightPercent || 0).toLocaleString() }} %
          </h4>
        </template>
        <va-divider />
        ปริมาณรถน้ำหนักเกิน (คัน)
      </va-alert>
    </div>
    <div class="row">
      <va-alert color="#BC76D1" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFromWIMDashboard.lowSpeed || 0).toLocaleString() }} คัน</h4>
        </template>
        <va-divider />
        ปริมาณที่รถผ่านระบบ Low Speed (คัน)
      </va-alert>
      <va-alert color="#BC76D1" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">
            {{ (trafficFromWIMDashboard.lowSpeedWithOverWeight || 0).toLocaleString() }} คัน /
            {{ (trafficFromWIMDashboard.lowSpeedWithOverWeightPercent || 0).toLocaleString() }} %
          </h4>
        </template>
        <va-divider />
        ปริมาณรถน้ำหนักเกิน (คัน)
      </va-alert>
    </div>
    <div class="row padding-bottom">
      <va-alert color="#FFA600" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFromWIMDashboard.totalWrongPercent || 0).toLocaleString() }} %</h4>
        </template>
        <va-divider />
        อัตราวิ่งคล่อมช่องจราจร (%)
      </va-alert>
      <va-alert color="#FF6985" text-color="#FFFFFF" class="flex flex-col md5 hide">
        <template #title>
          <h4 class="va-h4">{{ (trafficFromWIMDashboard.totalRecheckPercent || 0).toLocaleString() }} %</h4>
        </template>
        <va-divider />
        อัตราเข้าชั่ง Low Speed (%)
      </va-alert>
    </div>
  </va-card>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
  const { t } = useI18n()

  const { trafficFromWIMDashboard } = useDashboardV1Store()
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
  .hide {
    visibility: hidden;
  }
</style>
