import { basedAxiosRequest as request } from "../base3DRequest";
import { API3DQueryBody, API3DResponse } from "./interface";

export const call3DAPI = async (body: API3DQueryBody) => {
  const defaultResponse = {
    title: "",
    description: "",
    data: [],
  }
  const response = await request.post<API3DResponse>('/report-3d/transaction', body)
  return response.data || defaultResponse
}
