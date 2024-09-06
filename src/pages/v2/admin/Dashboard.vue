<template>
  <div class="layout fluid va-gutter-5">
    <div class="dashboard">
      <div class="row row-equal">
        <div class="flex xs12 lg12 xl12 py-0">
          <FilterPanel />
        </div>

        <div class="flex xs6 lg6 xl6">
          <div class="flex custom-col w-1/2" style="padding-left: 0px;">
            <TrafficFromWIM :key="trafficFromWIMDashboardRefresh" />
          </div>

        </div>

        <div class="flex xs12 lg12 xl12">
          <TruckDashboard :key="truckStatDashboardRefresh" />
        </div>

        <div class="flex xs12 lg6 xl6">
          <TotalTruckDashboard
            v-if="totalVehicleReportMethod === DASHBOARD_VIEWS.TOTAL"
            :key="totalTruckDashboardRefresh"
          />
          <TotalTruckDashboardPercent
            v-if="totalVehicleReportMethod === DASHBOARD_VIEWS.PERCENT"
            :key="totalTruckDashboardRefresh"
          />
        </div>
        <div class="flex xs12 lg6 xl6 max-h-80">
          <TopFiveExcessWeight
            v-if="excessWeightReportMethod === DASHBOARD_VIEWS.TOTAL"
            :key="totalExcessWeightDashboardRefresh"
          />
          <TopFiveExcessWeightPercent
            v-if="excessWeightReportMethod === DASHBOARD_VIEWS.PERCENT"
            :key="totalExcessWeightDashboardRefresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TrafficFromWIM from '../../../components/v2/dashboard/TrafficFromWIM.vue'
import FilterPanel from '../../../components/v2/dashboard/FilterPanel.vue'
import TruckDashboard from '../../../components/v2/dashboard/TruckDashboardFromWim.vue'
import TotalTruckDashboard from '../../../components/v2/chart/vehicle-traffic-reports/TopFiveVehicleTraffic.vue'
import TotalTruckDashboardPercent from '../../../components/v2/chart/vehicle-traffic-reports/TopFiveVehicleTrafficPercent.vue'
import TopFiveExcessWeight from '../../../components/v2/chart/excess-weight-reports/TopFiveExcessWeight.vue'
import TopFiveExcessWeightPercent from '../../../components/v2/chart/excess-weight-reports/TopFiveExcessWeightPercent.vue'
import CCTVMonitor from '../../../components/v2/dashboard/CCTVMonitor.vue'
import { DASHBOARD_VIEWS } from '../../../constants'
import { useI18n } from 'vue-i18n'
import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
import { storeToRefs } from 'pinia'
const { t } = useI18n()

const dashboardStore = useDashboardV1Store()
dashboardStore.getTruckByPeriodReport()
dashboardStore.getSummaryReportFromWIMService()
dashboardStore.getSummaryReportFrom3D()
dashboardStore.getTotalTrafficTopFive()
dashboardStore.getTotalExceedWeightTopFive()
dashboardStore.getCCTVUrls()
const {
  trafficFromWIMDashboardRefresh,
  truckStatDashboardRefresh,
  totalTruckDashboardRefresh,
  totalExcessWeightDashboardRefresh,
  excessWeightReportMethod,
  totalVehicleReportMethod,
} = storeToRefs(dashboardStore)
</script>
<style>
.custom-row {
  display: flex;
}
.custom-col {
  flex: 1;
}
</style>
