import { defineStore } from 'pinia'
import { callReportAPI } from '../../../services/api/v2/dashboard'
import dayjs from 'dayjs'
import {
  getVehicleClassificationSummarizeData,
  getVehicleClassificationSummarizeDataSeparateByClass,
  getVehicleClassificationSummarizeDataSeparateByTimeSeries,
} from '../../../services/api/v1/report'

export const useImageServiceDashboardStore = defineStore({
  id: 'imageServiceDashboardStore',
  state: () => {
    return {
      data: {},
      filter: {
        selectedStartDate: dayjs().format('YYYY-MM-DD'),
        selectedEndDate: dayjs().format('YYYY-MM-DD'),
      },
      top5TrafficDashboardRefresh: 0,
      top5OverWeightDashboardRefresh: 0,
      totalPassWeightStation: 0,
      totalNotPassWeightStation: 0,
      totalOverWeight: 0,
      isMultipleDay: false,
      isLoading: false,
      top5TrafficDashboard: { labels: [] as any, datasets: [] as any },
      top5TrafficDashboardForDoughnutChart: { labels: [] as any, datasets: [] as any },
      totalTrafficCompareWithTotalOverweightBarChart: { labels: [] as any, datasets: [] as any },
      top5OverWeightDashboard: { labels: [] as any, datasets: [] as any },
    }
  },
  actions: {
    async callReportAPI(startDate, endDate) {
      const selectedStartDate = dayjs(startDate).format('YYYY-MM-DDT00:00:00+07:00')
      const selectedEndDate = dayjs(endDate).format('YYYY-MM-DDT23:59:59+07:00')
      return await callReportAPI({ startDate: selectedStartDate, endDate: selectedEndDate, reportType: 0 })
    },
    setTop5TrafficDashboardData(reportData) {
      const { data, vehicleClass } = reportData
      const vehicleClasses: any[] = []
      for (const item of vehicleClass) {
        vehicleClasses[item.VehicleClassID] = item.BosureDescription
      }
      const top5OfTraffic = data
        .slice()
        .filter((item) => item.total > 0)
        .sort((a, b) => {
          return b.total - a.total
        })
        .slice(0, 5)
      const top5OfTrafficLabels = top5OfTraffic.map((item) => vehicleClasses[item.vehicleClassID])
      const top5OfTrafficData = top5OfTraffic.map((item) => item.total)
      const datasets = {
        data: top5OfTrafficData,
        backgroundColor: ['#F3C089', '#F3C089', '#F3C089', '#F3C089', '#F3C089'],
      }
      this.top5TrafficDashboard = { labels: top5OfTrafficLabels, datasets: [datasets] }
      const datasetsForDoughnutChart = {
        data: top5OfTrafficData,
        backgroundColor: ['#90BECB', '#F3C089', '#88C2C8', '#EB6D65', '#90cb9d'],
      }
      this.top5TrafficDashboardForDoughnutChart = { labels: top5OfTrafficLabels, datasets: [datasetsForDoughnutChart] }
    },
    setTop5OverWeightDashboardData(reportData) {
      const { data, vehicleClass } = reportData
      const vehicleClasses: any[] = []
      for (const item of vehicleClass) {
        vehicleClasses[item.VehicleClassID] = item.BosureDescription
      }
      const top5OfTraffic = data
        .slice()
        .filter((item) => item.overWeight > 0)
        .sort((a, b) => {
          return b.overWeight - a.overWeight
        })
        .slice(0, 5)
      const top5OfOverWeightLabels = top5OfTraffic.map((item) => vehicleClasses[item.vehicleClassID])
      const top5OfOverWeightData = top5OfTraffic.map((item) => item.overWeight)
      const datasets = {
        data: top5OfOverWeightData,
        backgroundColor: ['#0AA0E1', '#0AA0E1', '#0AA0E1', '#0AA0E1', '#0AA0E1'],
      }
      this.top5OverWeightDashboard = { labels: top5OfOverWeightLabels, datasets: [datasets] }
    },
    setTotalTrafficCompareWithTotalOverweightBarChart(reportData) {
      const { data } = reportData
      const totalTraffic = data.map((item) => item.total).reduce((partialSum, a) => partialSum + a, 0)
      const totalOverWeight = data.map((item) => item.overWeight).reduce((partialSum, a) => partialSum + a, 0)
      const totalTrafficData = { data: [totalTraffic], backgroundColor: ['#0AA0E1'], label: 'รถที่ผ่านระบบ' }
      const totalOverweightData = { data: [totalOverWeight], backgroundColor: ['#EB6D65'], label: 'รถที่น้ำหนักเกิน' }
      const labels = ['']
      this.totalTrafficCompareWithTotalOverweightBarChart = {
        labels,
        datasets: [totalTrafficData, totalOverweightData],
      }
    },
    async callVehicleClassificationSummarizeData(startDate, endDate) {
      return await getVehicleClassificationSummarizeData({ startDate, endDate, isSeparatedByClass: 'false' })
    },
    async callVehicleClassificationSummarizeDataSeparateByClass(startDate, endDate) {
      return await getVehicleClassificationSummarizeDataSeparateByClass({
        startDate,
        endDate,
        isSeparatedByClass: 'true',
      })
    },
    async callVehicleClassificationSummarizeDataSeparateByTimeSeries(startDate, endDate) {
      return await getVehicleClassificationSummarizeDataSeparateByTimeSeries({
        startDate,
        endDate,
        isSeparatedByTimeSeries: 'true',
      })
    },
    setTotalNotPassWeightStation(reportData) {
      const { data } = reportData
      this.totalNotPassWeightStation = data.map((item) => item.total).reduce((partialSum, a) => partialSum + a, 0)
    },
    setTotalOverWeight(reportData) {
      const { data } = reportData
      this.totalOverWeight = data.map((item) => item.overWeight).reduce((partialSum, a) => partialSum + a, 0)
    },
    setTotalPassWeightStation(totalTraffic) {
      this.totalPassWeightStation = totalTraffic
    },
    setIsMultipleDay() {
      return (this.isMultipleDay = this.filter.selectedEndDate !== this.filter.selectedStartDate)
    },
    enableLoading() {
      return (this.isLoading = true)
    },
    disableLoading() {
      return (this.isLoading = false)
    },
    forceRerender() {
      this.top5TrafficDashboardRefresh = this.top5TrafficDashboardRefresh + 1
      this.top5OverWeightDashboardRefresh = this.top5OverWeightDashboardRefresh + 1
    },
  },
})
