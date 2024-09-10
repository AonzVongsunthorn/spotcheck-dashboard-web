import {basedAxiosRequest as request} from "../baseAuthServiceRequest";
import {ListUserLogsResponse, UserLogBody} from "./api.interface";

export const saveUserLog = async (body: UserLogBody) => {
  const response = await request.post<ListUserLogsResponse>('user-usage-log', body)
  return response.data
}
