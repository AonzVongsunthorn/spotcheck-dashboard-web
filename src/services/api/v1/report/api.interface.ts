// ------ URL report/truck-by-period

import { getSummaryWIMStatistic } from './index'

export interface GetSummaryReportByPeriodResult {
  label: string
  backgroundColor: string
  data: number
}

export interface TruckByPeriodBarChartResult {
  labels: string[]
  datasets: GetSummaryReportByPeriodResult[]
}

export interface TruckByPeriodReportResponse {
  data: TruckByPeriodBarChartResult | never
}

// ------ URL report/summary-from-wim-service

export interface SummaryFromWIMServiceResponse {
  data: SummaryFromWIMServiceResult
}

export interface SummaryFromWIMServiceResult {
  highSpeed: number
  highSpeedWithOverWeight: number
  highSpeedWithOverWeightPercent: number
  lowSpeed: number
  lowSpeedWithOverWeight: number
  lowSpeedWithOverWeightPercent: number
  totalWrongPercent: number
  totalRecheckPercent: number
}

// ------ URL report/summary-from-3d
export interface SummaryFrom3DServiceResponse {
  data: getSummaryFrom3DReportResult
}

export interface getSummaryFrom3DReportResult {
  totalMotorcycle: number
  totalSmallSize: number
  totalMediumSize: number
  totalLargeSize: number
}

// ------ URL report/top-five-total-traffic-by-type

export interface GetTotalTruckByTypeResponse {
  data: GetTotalTruckByTypeBarChartResult
}

export interface GetTotalTruckByTypeBarChartResult {
  total: GetTotalTruckByTypeBarChartTotalResult
  percent: GetTotalTruckByTypeBarChartPercentResult
}

export interface GetTotalTruckByTypeBarChartTotalResult {
  labels: string[]
  datasets: GetTotalTruckByTypeBarChartDataset[]
}

export interface GetTotalTruckByTypeBarChartPercentResult {
  labels: string[]
  datasets: GetTotalTruckByTypeBarChartDataset[]
}

export interface GetTotalTruckByTypeBarChartDataset {
  backgroundColor: string[]
  barPercentage: number
  data: number[]
}

// ------ URL report/top-five-total-exceed-weight-by-type

export interface GetTotalExceedWeightByTypeResponse {
  data: GetTotalExceedWeightByTypeBarChartResult
}

export interface GetTotalExceedWeightByTypeBarChartResult {
  total: GetTotalExceedWeightByTypeTotalBarChartResult
  percent: GetTotalExceedWeightByTypePercentBarChartResult
}

export interface GetTotalExceedWeightByTypeTotalBarChartResult {
  labels: string[]
  datasets: GetTotalExceedWeightByTypeBarChartDataset[]
}

export interface GetTotalExceedWeightByTypePercentBarChartResult {
  labels: string[]
  datasets: GetTotalExceedWeightByTypeBarChartDataset[]
}

export interface GetTotalExceedWeightByTypeBarChartDataset {
  backgroundColor: string[]
  barPercentage: number
  data: number[]
}

export interface GeneratePDFBody {
  url: string
}

export interface GeneratePDFResult {
  base64: string
}

export interface GeneratePDFResponse {
  data: GeneratePDFResult
}

export interface SummaryWIMStatisticResult {
  totalTraffic: number
  totalByPassStatus: number
  totalReportStatus: number
  totalPlatError: number
  totalIsPassImageService: number
  totalIsPassStaticService: number
  totalDisobeyStatus: number
}

export interface SummaryWIMStatisticResponse {
  data: SummaryWIMStatisticResult
}

export interface VehicleClassificationReportParams {
  startDate: string
  endDate: string
  isSeparatedByClass?: string
  isSeparatedByTimeSeries?: string
}

export interface SummarizeDataObject {
  total: string
}

export interface SummarizeDataResponse {
  data: SummarizeDataObject
}

export interface SummarizeDataSeparateByClassObject {
  total: string
  class: string
}

export interface SummarizeDataSeparateByClassResponse {
  data: SummarizeDataSeparateByClassObject[]
}

export interface SummarizeDataSeparateByTimeSeriesObject {
  total: string
  label: string
}

export interface SummarizeDataSeparateByTimeSeriesResponse {
  data: SummarizeDataSeparateByTimeSeriesObject[]
}
