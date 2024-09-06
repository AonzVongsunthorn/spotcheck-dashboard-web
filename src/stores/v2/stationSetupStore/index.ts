// @ts-nocheck
import { defineStore } from 'pinia'
import { getSettingAPI, updateSettingAPI } from '../../../services/api/v2/setting'

const defaultErrors = {
  stationID: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล หมายเลขสถานี',
  },
  stationName: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล ชื่อสถานี',
  },
  host: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล IP เครื่อง',
  },
  wsDataLogger: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL รับข้อมูล Vehicle controller',
  },
  wsSensors: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL รับข้อมูล Trigger controller',
  },
  wheelBaseGroup: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล กำหนดระยะกลุ่มเพลา (m)',
  },
  thick: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล ความหนาของพื้น (นิ้ว)',
  },
  flir: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL รับข้อมูล flir',
  },
  flux: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล IP flux',
  },
  flux_video: {
    isError: false,
    errorMessage: 'กำหนด frame',
  },
  gvwIgnored: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล น้ำหนักที่ต้องละทิ้ง (kg)',
  },
  lengthIgnored: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล ความยาวเพลารถเล็กที่ต้องละทิ้ง (cm.)',
  },
  delayOverviewUTC: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล กำหนด delay ก่อนค้นภาพ กรณี UTC (ms)',
  },
  min: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล กำหนด min ในการเลือกภาพ (ms)',
  },
  max: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล กำหนด max ในการเลือกภาพ (ms)',
  },
  OCRServer: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL สำหรับอ่านป้ายทะเบียน',
  },
  mainServer: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL ส่งข้อมูลไปยังส่วนกลาง',
  },
  centerStation: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL ส่งข้อมูลไปยังระบบรวม',
  },
  distanceAxles2Class: {
    isError: false,
    errorMessage: 'กรุณาใส่ข้อมูล URL ส่งข้อมูลไปยังระบบรวม',
  },
}
export const useStationSetupStore = defineStore({
  id: 'stationSetupStore',
  state: () => {
    return {
      data: {
        streaming_url: [],
        stationName: '',
      },
      isLoading: false,
      roadSurfaceOptions: [
        { text: 'คอนกรีต', value: 'rigid' },
        { text: 'ยางมะตอย', value: 'flexible' },
      ],
      controllerOptions: [
        { text: 'DataLogger', value: 1 },
        { text: 'Intercomp', value: 2 },
      ],
      roadSurfaceOption: { text: 'ยางมะตอย', value: 2 },
      controllerOption: { text: 'DataLogger', value: 1 },
      stationErrors: defaultErrors,
      currentStationErrors: [],
      isStationFieldHasError: false,
      isRealTimeFieldHasError: false,
      isOverviewCameraFieldHasError: false,
      isLPRCameraFieldHasError: false,
    }
  },
  actions: {
    async getSettingAPI() {
      this.data = await getSettingAPI()
    },
    async updateSetting(data) {
      await updateSettingAPI(data)
    },
    enableLoading() {
      this.isLoading = true
    },
    disableLoading() {
      this.isLoading = false
    },
    setController() {
      this.controllerOption = this.controllerOptions.find((item) => item.value === this.data.controller)
    },
    setRoadSurfaceOption() {
      this.roadSurfaceOption = this.roadSurfaceOptions.find((item) => item.value === this.data.floor)
    },
    addRealtimeItem() {
      this.data.streaming_url.push({ _id: '', url: '' })
    },
    removeRealtimeItem(idx) {
      this.data.streaming_url = this.data.streaming_url.filter((item, index) => {
        return idx !== index
      })
    },
    addOverviewItem() {
      this.data.overviewCameras.push({ _id: '', lane: '', snapCode: '' })
    },
    removeOverviewItem(idx) {
      this.data.overviewCameras = this.data.overviewCameras.filter((item, index) => {
        return idx !== index
      })
    },
    addLprCamerasItem() {
      this.data.lprCameras.push({ _id: '', lane: '', snapCode: '' })
    },
    removeLprCamerasItem(idx) {
      this.data.lprCameras = this.data.lprCameras.filter((item, index) => {
        return idx !== index
      })
    },
    resetErrors() {
      for (const error of this.currentStationErrors) {
        this.stationErrors[error].isError = false
      }
      this.isStationFieldHasError = false
      this.currentStationErrors = []
      this.isRealTimeFieldHasError = false
      this.isOverviewCameraFieldHasError = false
      this.isLPRCameraFieldHasError = false
    },
    validationStation() {
      this.resetErrors()
      if (!this.data.stationID) {
        this.currentStationErrors.push('stationID')
      }

      if (!this.data.stationName) {
        this.currentStationErrors.push('stationName')
      }

      if (!this.data.host) {
        this.currentStationErrors.push('host')
      }

      if (!this.data.wsDataLogger) {
        this.currentStationErrors.push('wsDataLogger')
      }

      if (!this.data.wsSensors) {
        this.currentStationErrors.push('wsSensors')
      }

      if (!this.data.wheelBaseGroup) {
        this.currentStationErrors.push('wheelBaseGroup')
      }

      if (!this.data.thick) {
        this.currentStationErrors.push('thick')
      }

      if (!this.data.flir) {
        this.currentStationErrors.push('flir')
      }

      if (!this.data.flux) {
        this.currentStationErrors.push('flux')
      }

      if (!this.data.flux_video) {
        this.currentStationErrors.push('flux_video')
      }

      if (!this.data.gvwIgnored) {
        this.currentStationErrors.push('gvwIgnored')
      }

      if (!this.data.lengthIgnored) {
        this.currentStationErrors.push('lengthIgnored')
      }

      if (!this.data.delayOverviewUTC) {
        this.currentStationErrors.push('delayOverviewUTC')
      }

      if (!this.data.min) {
        this.currentStationErrors.push('min')
      }

      if (!this.data.max) {
        this.currentStationErrors.push('max')
      }

      if (!this.data.OCRServer) {
        this.currentStationErrors.push('OCRServer')
      }

      if (!this.data.mainServer) {
        this.currentStationErrors.push('mainServer')
      }

      if (!this.data.centerStation) {
        this.currentStationErrors.push('centerStation')
      }

      if (!this.data.distanceAxles2Class) {
        this.currentStationErrors.push('distanceAxles2Class')
      }

      if (this.currentStationErrors.length) {
        for (const error of this.currentStationErrors) {
          this.stationErrors[error].isError = true
        }
        this.isStationFieldHasError = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    validationRealTime() {
      const wrongItems = this.data.streaming_url.filter((item) => !item.url)
      if (wrongItems.length) {
        this.isRealTimeFieldHasError = true
      }
    },
    validationOverview() {
      const wrongItems = this.data.overviewCameras.filter((item) => !item.lane || !item.snapCode)
      if (wrongItems.length) {
        this.isOverviewCameraFieldHasError = true
      }
    },
    validationLPR() {
      const wrongItems = this.data.lprCameras.filter((item) => !item.lane || !item.snapCode)
      if (wrongItems.length) {
        this.isLPRCameraFieldHasError = true
      }
    },
  },
})
