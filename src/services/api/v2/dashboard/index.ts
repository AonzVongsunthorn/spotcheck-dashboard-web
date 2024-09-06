import { basedAxiosRequest as request } from '../baseImageAPIRequest'
import { basedAxiosRequest as requestToCentralAPI } from '../baseCentralImageAPIRequest'
import { ReportAPIBody, ReportResponse, SearchAPIQueryBody, SearchAPIResponse } from './interface'

export const callSearchAPI = async (body: SearchAPIQueryBody) => {
  const defaultResponse = {
    pagination: {},
    data: [],
  }
  const response = await request.post<SearchAPIResponse>('/api/vehicle/search', body)
  return response.data || defaultResponse
}

export const callReportAPI = async (body: ReportAPIBody) => {
  const defaultResponse = {
    data: [],
    vehicleClass: [],
  }
  const response = await request.post<ReportResponse>(`/api/report/summary`, body)
  return response.data || defaultResponse
}

export const callSearchAPIFromCentralServer = async (body: SearchAPIQueryBody) => {
  const defaultResponse = {
    pagination: {},
    data: [],
  }
  const response = await requestToCentralAPI.post<SearchAPIResponse>('/api/vehicle/search', body)
  return response.data || defaultResponse
}
