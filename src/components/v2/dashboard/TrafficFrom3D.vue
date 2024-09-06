<template>
  <va-card>
    <va-card-title>{{ t('dashboard.3DTitle') }}</va-card-title>
    <div class="row">
      <va-alert color="#167288" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFrom3DDashboard.totalMotorcycle || 0).toLocaleString() }}</h4>
        </template>
        <va-divider />
        รถจักรยานยนต์
      </va-alert>
      <va-alert color="#3DB464" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFrom3DDashboard.totalSmallSize || 0).toLocaleString() }}</h4>
        </template>
        <va-divider />
        รถยนต์ 4-6 ล้อ
      </va-alert>
    </div>
    <div class="row padding-bottom">
      <va-alert color="#B45248" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFrom3DDashboard.totalMediumSize || 0).toLocaleString() }}</h4>
        </template>
        <va-divider />
        รถบรรทุกขนาดกลาง รถ 10-12 ล้อ , รถบัส
      </va-alert>
      <va-alert color="#836394" text-color="#FFFFFF" class="flex flex-col md5">
        <template #title>
          <h4 class="va-h4">{{ (trafficFrom3DDashboard.totalLargeSize || 0).toLocaleString() }}</h4>
        </template>
        <va-divider />
        รถบรรทุกขนาดใหญ่ รถพ่วง รถกึ่งพ่วง
      </va-alert>
    </div>
  </va-card>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
  const { t } = useI18n()

  const { trafficFrom3DDashboard } = useDashboardV1Store()
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
</style>
