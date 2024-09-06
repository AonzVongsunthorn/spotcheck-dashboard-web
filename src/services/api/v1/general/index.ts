import { basedAxiosRequest as request } from "../baseRequest";
import { ExecutionLogsAPIResponse } from "./interface";

export const getExecutionLogsAPI = async () => {
  const response = await request.get<ExecutionLogsAPIResponse>('/execution-logs')
  return response.data
}

