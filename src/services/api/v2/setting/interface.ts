export interface SettingAPIResponse {
  controller: number
  stationID: number
  host: string
  wsDataLogger: string
  wsSensors: string
  wheelBaseGroup: number
  flir: string
  flux: string
  flux_video: number
  gvwIgnored: number
  lengthIgnored: number
  stationName: string
  min: number
  max: number
  OCRServer: string
  mainServer: string
  centerStation: string
  delayOverviewUTC: number
  distanceAxles2Class: number
  floor: string
  thick: number
  _id: string
  streaming_url: StreamingUrl[]
  overviewCameras: OverviewCamera[]
  lprCameras: LprCamera[]
  create_at: string
  update_at: string
}

export interface StreamingUrl {
  url: string
  _id: string
}

export interface OverviewCamera {
  snapCode: string
  lane: string
  _id: string
}

export interface LprCamera {
  snapCode: string
  lane: string
  _id: string
}
