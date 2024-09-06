import { defineStore } from 'pinia'
import {
  getSummaryReportFrom3D,
  getSummaryReportFromWIMService,
  getTotalExceedWeightTopFive,
  getTotalTrafficTopFive,
  getTruckByPeriodReport,
} from '../../services/api/v1/report'

import { getConfigurations } from '../../services/api/v1/configuration'

import dayjs from 'dayjs'
import {
  GetTotalExceedWeightByTypeResponse,
  GetTotalTruckByTypeResponse,
  SummaryFrom3DServiceResponse,
  SummaryFromWIMServiceResponse,
  TruckByPeriodReportResponse,
} from '../../services/api/v1/report/api.interface'
import { GetConfigurationResponse } from '../../services/api/v1/configuration/api.interface'
import { DASHBOARD_VIEWS } from '../../constants'

export const useDashboardV1Store = defineStore('dashboardStoreV1', {
  state: () => {
    return {
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      truckByTimePeriod: { labels: [], datasets: [] },
      totalTruckDashboard: { labels: [], datasets: [] },
      totalTruckPercentDashboard: { labels: [], datasets: [] },
      totalExcessWeightDashboard: { labels: [], datasets: [] },
      totalExcessWeightPercentDashboard: { labels: [], datasets: [] },
      trafficFromWIMDashboard: {
        highSpeed: 0,
        highSpeedWithOverWeight: 0,
        highSpeedWithOverWeightPercent: 0,
        lowSpeed: 0,
        lowSpeedWithOverWeight: 0,
        lowSpeedWithOverWeightPercent: 0,
        totalWrongPercent: 0,
        totalRecheckPercent: 0,
      },
      trafficFrom3DDashboard: {
        totalMotorcycle: 0,
        totalSmallSize: 0,
        totalMediumSize: 0,
        totalLargeSize: 0,
      },
      trafficFromWIMDashboardRefresh: 0,
      trafficFrom3DDashboardRefresh: 0,
      truckStatDashboardRefresh: 0,
      totalTruckDashboardRefresh: 0,
      totalExcessWeightDashboardRefresh: 0,
      excessWeightReportMethod: DASHBOARD_VIEWS.TOTAL,
      totalVehicleReportMethod: DASHBOARD_VIEWS.TOTAL,
    }
  },
  actions: {
    async search() {
      this.getTruckByPeriodReport()
      this.getSummaryReportFromWIMService()
      this.getSummaryReportFrom3D()
      this.getTotalTrafficTopFive()
      this.getTotalExceedWeightTopFive()
    },
    async getTruckByPeriodReport() {
      const response: TruckByPeriodReportResponse = await getTruckByPeriodReport({ startDate: this.startDate, endDate: this.endDate })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.truckByTimePeriod = response.data
      this.truckStatDashboardRefresh = this.truckStatDashboardRefresh + 1
    },
    async getSummaryReportFromWIMService() {
      const response: SummaryFromWIMServiceResponse = await getSummaryReportFromWIMService({ startDate: this.startDate, endDate: this.endDate })
      this.trafficFromWIMDashboard = response.data
      this.trafficFromWIMDashboardRefresh = this.trafficFromWIMDashboardRefresh + 1
    },
    async getSummaryReportFrom3D() {
      const response: SummaryFrom3DServiceResponse = await getSummaryReportFrom3D({ startDate: this.startDate, endDate: this.endDate })
      this.trafficFrom3DDashboard = response.data
      this.trafficFrom3DDashboardRefresh = this.trafficFrom3DDashboardRefresh + 1
    },
    async getTotalTrafficTopFive() {
      const response: GetTotalTruckByTypeResponse = await getTotalTrafficTopFive({ startDate: this.startDate, endDate: this.endDate })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.totalTruckDashboard = response.data.total
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.totalTruckPercentDashboard = response.data.percent
      this.totalTruckDashboardRefresh = this.totalTruckDashboardRefresh + 1
    },
    async getTotalExceedWeightTopFive() {
      const response: GetTotalExceedWeightByTypeResponse = await getTotalExceedWeightTopFive({ startDate: this.startDate, endDate: this.endDate })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.totalExcessWeightDashboard = response.data.total
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.totalExcessWeightPercentDashboard = response.data.percent
      this.totalExcessWeightDashboardRefresh = this.totalExcessWeightDashboardRefresh + 1
    },
    async getCCTVUrls() {
      const response: GetConfigurationResponse = await getConfigurations('CCTV_URLS')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return response?.data
    },
    forceRerender() {
      this.trafficFromWIMDashboardRefresh = this.trafficFromWIMDashboardRefresh + 1
      this.trafficFrom3DDashboardRefresh = this.trafficFrom3DDashboardRefresh + 1
      this.truckStatDashboardRefresh = this.truckStatDashboardRefresh + 1
      this.totalTruckDashboardRefresh = this.totalTruckDashboardRefresh + 1
      this.totalExcessWeightDashboardRefresh = this.totalExcessWeightDashboardRefresh + 1
    },
    changeExcessWeightDashboardToPercentView() {
      this.excessWeightReportMethod = DASHBOARD_VIEWS.PERCENT
    },
    changeExcessWeightDashboardToTotalView() {
      this.excessWeightReportMethod = DASHBOARD_VIEWS.TOTAL
    },
    changeTotalVehicleDashboardToPercentView() {
      this.totalVehicleReportMethod = DASHBOARD_VIEWS.PERCENT
    },
    changeTotalVehicleDashboardToTotalView() {
      this.totalVehicleReportMethod = DASHBOARD_VIEWS.TOTAL
    },
    convertHumanDateToSystemDate(date) {
      const originalDataArray = date.split('-')
      return `${originalDataArray[2]}-${originalDataArray[1]}-${originalDataArray[0]}`
    }
  },
})
