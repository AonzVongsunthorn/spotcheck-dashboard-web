export interface ListLogQueryParam {
  startDate: string
  endDate: string
  userId?: number
}

export interface User {
  email: string
  name: string
  role: string
  telephoneNo: string
}

export interface UserLog {
  id: number
  date: string
  service: string
  event: string
  user: User
}

export interface ListUserLogsResponse {
  data: UserLog[]
}

export interface UserLogBody {
  service: string
  event: string
}
