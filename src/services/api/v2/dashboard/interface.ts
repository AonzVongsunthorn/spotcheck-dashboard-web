export interface SearchAPIQueryBody {
  startDate?: string
  endDate?: string
  lane?: string
  exceedMaxGVW?: string
  vehicleClassID?: string
  licensePlate?: string
  id?: string
  page?: number
  pageSize?: number
}

export interface SearchAPIResponse {
  pagination: SearchAPIPaginationResponse
  data: SearchAPIDataResponse[]
}

export interface SearchAPIPaginationResponse {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface SearchAPIDataResponse {
  _id: string
  sendStatus: number
  errorFlags: number
  warningFlags: number
  errorFlag: any[]
  warningFlag: WarningFlag[]
  esal: number
  axles: Axle[]
  axlesAfterAllowance: AxlesAfterAllowance[]
  gvw: number
  axlesCount: number
  id: number
  lane: string
  leftWeight: number
  rightWeight: number
  length: number
  speed: number
  images: Image[]
  stamp: string
  violation: number
  stationID: number
  station: Station
  plate: Plate
  VehicleClassID: number
  DisplayID: number
  BosureDescription: string
  LongDescription: string
  GVW_Weight_Max: number
  Reference: string
  images_01: string
  __v: number
  dataFrom3D: ObjectFrom3D
}

export interface ObjectFrom3D {
  width?: number
  long?: number
  height?: number
  imagePath?: string
}

export interface WarningFlag {
  bit: number
  name: string
  description: string
}

export interface Axle {
  dualTire: boolean
  _id: string
  number: number
  speedLeft: number
  speedRight: number
  weightLeft: number
  weightRight: number
  wheelbase: number
  weight: number
  groupID: number
}

export interface AxlesAfterAllowance {
  _id: string
  allowance: number
  axleWeight: number
  number: number
}

export interface Image {
  _id: string
  url: string
  path: any
}

export interface Station {
  stationName: string
  stationID: number
  stationIP: string
}

export interface Plate {
  plate_path: string
  license_plate: string
  province: string
}

export interface ReportAPIBody {
  startDate: string
  endDate: string
  reportType: number
}

export interface ReportResponse {
  data: Report[]
  vehicleClass: any[]
}

export interface Report {
  _id: ID
  overWeight: number
  normalWeight: number
  total: number
  errorFlag: number
}

export interface ID {
  VehicleClassID: number
}
