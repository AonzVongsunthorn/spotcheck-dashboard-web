import { basedAxiosRequest as request } from '../baseRequest'

import {
  GeneratePDFBody,
  GeneratePDFResponse,
  GetTotalExceedWeightByTypeResponse,
  GetTotalTruckByTypeResponse,
  SummarizeDataResponse,
  SummarizeDataSeparateByClassObject,
  SummarizeDataSeparateByClassResponse,
  SummarizeDataSeparateByTimeSeriesResponse,
  SummaryFrom3DServiceResponse,
  SummaryFromWIMServiceResponse,
  SummaryWIMStatisticResponse,
  TruckByPeriodReportResponse,
  VehicleClassificationReportParams,
} from './api.interface'

export const getTruckByPeriodReport = async (queryParams: Record<string, string>) => {
  const response = await request.get<TruckByPeriodReportResponse>(
    `report/truck-by-period?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getSummaryReportFromWIMService = async (queryParams: Record<string, string>) => {
  const response = await request.get<SummaryFromWIMServiceResponse>(
    `report/summary-from-speed-service?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getSummaryReportFrom3D = async (queryParams: Record<string, string>) => {
  const response = await request.get<SummaryFrom3DServiceResponse>(
    `report/summary-from-3d?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getTotalTrafficTopFive = async (queryParams: Record<string, string>) => {
  const response = await request.get<GetTotalTruckByTypeResponse>(
    `report/top-five-total-traffic-by-type?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getTotalExceedWeightTopFive = async (queryParams: Record<string, string>) => {
  const response = await request.get<GetTotalExceedWeightByTypeResponse>(
    `report/top-five-total-exceed-weight-by-type?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const generatePDF = async (body: GeneratePDFBody) => {
  const defaultResponse = {
    data: {},
  }
  const response = await request.post<GeneratePDFResponse>('/report/generate-pdf', body)
  return response.data || defaultResponse
}

export const getSummaryWIMStatistic = async (queryParams: Record<string, string>) => {
  const response = await request.get<SummaryWIMStatisticResponse>(
    `report/summary-from-wim?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getVehicleClassificationSummarizeData = async (queryParams: Record<string, string>) => {
  const response = await request.get<SummarizeDataResponse>(
    `report/vehicle-classification?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getVehicleClassificationSummarizeDataSeparateByClass = async (queryParams: Record<string, string>) => {
  const response = await request.get<SummarizeDataSeparateByClassResponse>(
    `report/vehicle-classification?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}

export const getVehicleClassificationSummarizeDataSeparateByTimeSeries = async (
  queryParams: Record<string, string>,
) => {
  const response = await request.get<SummarizeDataSeparateByTimeSeriesResponse>(
    `report/vehicle-classification?${new URLSearchParams(queryParams).toString()}`,
  )
  return response.data
}
