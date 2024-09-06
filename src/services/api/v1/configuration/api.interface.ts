export interface ConfigurationCCTVValueObject {
  title: string
  url: string
}

export interface ConfigurationRecord {
  key: string
  value: ConfigurationCCTVValueObject
}

export interface ConfigurationResult {
  key: string
  values: ConfigurationCCTVValueObject[]
}

export interface GetConfigurationResponse {
  data: ConfigurationResult
}
