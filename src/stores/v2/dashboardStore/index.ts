import { defineStore } from 'pinia'
import { callReportAPI, callSearchAPI, callSearchAPIFromCentralServer } from '../../../services/api/v2/dashboard'
import { call3DAPI } from '../../../services/api/v2/3d'
import { getSettingAPI } from '../../../services/api/v2/setting'
import { generatePDF, getSummaryWIMStatistic } from '../../../services/api/v1/report'
import dayjs from 'dayjs'
import alertSound from '../../../assets/alert.mp3'
import { getExecutionLogsAPI } from '../../../services/api/v1/general'
import { calculatePercent } from '../../../helpers/utilities'
const IS_3D_ENABLE = import.meta.env.VITE_IS_3D_ENABLE

export const useDashboardStore = defineStore({
  id: 'dashboardStore',
  state: () => {
    return {
      filters: {
        stationOptions: [] as any,
        weightOptions: [
          { text: 'น้ำหนักทั้งหมด', value: '' },
          { text: 'น้ำหนักเกินทั้งหมด', value: '1' },
          { text: 'น้ำหนักปกติทั้งหมด', value: '0' },
          { text: 'สถานะตรวจสอบ', value: '' },
        ],
        laneOptions: [{ text: 'เลนทั้งหมด', value: '' }],
        plateOptions: [{ text: 'ทะเบียนทั้งหมด', value: '' }],
        vehicleTypeOptions: [
          { text: 'ประเภทรถทั้งหมด', value: '' },
          { text: 'ไม่สามารถตรวจสอบได้', value: 0 },
          { text: 'รถ 4 ล้อ (9.5 ตัน)', value: 1 },
          { text: 'รถ 4 ล้อ (9.5 ตัน)', value: 2 },
          { text: 'รถ 10 ล้อ (25 ตัน)', value: 3 },
          { text: 'รถ 12 ล้อ (30 ตัน)', value: 4 },
          { text: 'รถกึ่งพ่วง 14 ล้อ (35 ตัน)', value: 5 },
          { text: 'รถกึ่งพ่วง 18 ล้อ (40.5 ตัน)', value: 6 },
          { text: 'รถกึ่งพ่วง 18 ล้อ (45 ตัน)', value: 7 },
          { text: 'รถกึ่งพ่วง 20 ล้อ (50 ตัน)', value: 8 },
          { text: 'รถกึ่งพ่วง 22 ล้อ (50.5 ตัน)', value: 9 },
          { text: 'รถกึ่งพ่วง 22 ล้อ (49 ตัน)', value: 10 },
          { text: 'รถกึ่งพ่วง 22 ล้อ (47 ตัน)', value: 11 },
          { text: 'รถกึ่งพ่วง 22 ล้อ (45 ตัน)', value: 12 },
          { text: 'รถกึ่งพ่วง 24 ล้อ (50.5 ตัน)', value: 13 },
          { text: 'รถพ่วง 14 ล้อ (37 ตัน)', value: 14 },
          { text: 'รถพ่วง 18 ล้อ (47 ตัน)', value: 15 },
          { text: 'รถพ่วง 20 ล้อ (50.5 ตัน)', value: 16 },
          { text: 'รถพ่วง 22 ล้อ (50.5 ตัน)', value: 17 },
          { text: 'รถพ่วง 24 ล้อ (50.5 ตัน)', value: 18 },
          { text: 'รถประเภทอื่นๆ', value: 19 },
        ],
        noOptions: [{ text: 'เลขที่ทั้งหมด', value: '' }],
        pageOptions: [
          { text: '5', value: 5 },
          { text: '10', value: 10 },
          { text: '20', value: 20 },
          { text: '30', value: 30 },
          { text: '50', value: 50 },
        ],
      },
      filter: {
        selectedStartDate: dayjs().format('YYYY-MM-DD'),
        selectedEndDate: dayjs().format('YYYY-MM-DD'),
        startDate: '',
        endDate: '',
        station: '',
        exceedWeight: '',
        lane: '',
        vehicleType: '',
        plate: '',
        no: '',
        pageSize: 5,
        page: 1,
        totalPage: 0,
        totalItems: 0,
      },
      alertPercentOptions: [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '15', value: 15 },
        { text: '20', value: 20 },
      ],
      selectedAlertPercent: 10,
      currentTrafficList: [] as any,
      trafficList: [],
      searchList: [],
      reportList: [],
      reportGraphData: { labels: [] as any, datasets: [] as any },
      last5DaysGraphData: { labels: [] as any, datasets: [] as any },
      isLoading: false,
      is3DEnabled: IS_3D_ENABLE,
      audio: new Audio(alertSound),
    }
  },
  actions: {
    openPopup(id, date) {
      window.open(
        `/search/traffic/${id}/${date}`,
        'Modal Popup',
        'scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=1300,height=900',
      )
    },
    openHistoryPopup(plate) {
      window.open(
        `/search/license-plate/${plate}`,
        'Modal Popup',
        'scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=1300,height=900',
      )
    },
    async processRealtimeData(data) {
      // data = '42["realtime",{CONTENT}]'
      const dataAfterRemovedFirst14Chars = data.replace(/^.{14}/g, '')
      const dataAfterRemovedLastChar = dataAfterRemovedFirst14Chars.replace(/.$/, '')
      const dataInJSON = JSON.parse(dataAfterRemovedLastChar)
      const { _id } = dataInJSON
      const isExisting = this.currentTrafficList.find((item) => item._id === _id)
      if (isExisting) {
        return
      }
      if (dataInJSON.gvw > dataInJSON.GVW_Weight_Max && !dataInJSON.warningFlags) {
        this.alertOverWeightTruck(dataInJSON.gvw, dataInJSON.GVW_Weight_Max)
      }
      dataInJSON.dataFrom3D = {}
      console.log('new data coming from web socket of', dataInJSON.id)
      this.currentTrafficList.unshift(dataInJSON)
    },
    alertOverWeightTruck(currentWeight, maxWeight) {
      if (calculatePercent(currentWeight, maxWeight) > this.selectedAlertPercent) {
        this.audio.play()
        setTimeout(() => {
          this.audio.play()
        }, 2000)
      }
    },
    async update3DInformation() {
      const startDateFor3DService = dayjs().subtract(10, 'minutes').format('DD-MM-YYYY HH:mm:ss')
      const endDateFor3DService = dayjs().add(1, 'minutes').format('DD-MM-YYYY HH:mm:ss')
      const { data: dataFrom3DService } = await call3DAPI({
        startDate: startDateFor3DService,
        stopDate: endDateFor3DService,
      })
      const currentTrafficListTemp = this.currentTrafficList
      let isHasSomeChanged = false
      for (const i in currentTrafficListTemp) {
        if (Object.values(currentTrafficListTemp[i].dataFrom3D).length) {
          continue
        }
        const plate = currentTrafficListTemp[i].plate.license_plate
        if (!plate) {
          continue
        }
        const dataFrom3DFilterByPlate = dataFrom3DService.find((item) => item.license_plate === plate)
        if (!dataFrom3DFilterByPlate) {
          continue
        }
        console.log('add 3D information of', currentTrafficListTemp[i].id)
        isHasSomeChanged = true
        currentTrafficListTemp[i].dataFrom3D = {
          width: dataFrom3DFilterByPlate.width,
          long: dataFrom3DFilterByPlate.long,
          height: dataFrom3DFilterByPlate.hight,
          imagePath: dataFrom3DFilterByPlate.pathPCDImage,
        }
      }
      if (isHasSomeChanged) {
        this.currentTrafficList = currentTrafficListTemp
      }
    },
    async generatePDF(url: string) {
      this.enableLoading()
      const { data } = await generatePDF({ url })
      this.disableLoading()
      return data
    },
    async getExecutionLogAPI() {
      return await getExecutionLogsAPI()
    },
    async getSettingAPI() {
      return await getSettingAPI()
    },
    async searchWithSpecificId(id, filter) {
      this.enableLoading()
      const { startDate, endDate, pageSize, page } = filter
      const result = await callSearchAPI({ pageSize, startDate, endDate, page, id })
      this.disableLoading()
      return result
    },
    async getWIMStatistic() {
      const result = await getSummaryWIMStatistic({
        startDate: this.filter.startDate,
        endDate: this.filter.endDate,
      })
      return result.data
    },
    async generateHistoryReportDataByTimeframe(timeFrames) {
      const histories: any[] = []
      for (const item of timeFrames) {
        const { startTime, endTime, label } = item
        const result = await callReportAPI({ startDate: startTime, endDate: endTime, reportType: 0 })
        const { data } = result
        histories.push({
          label: label,
          data,
        })
      }
      return histories
    },
    async generateHistoryReportData(startDate, endDate) {
      let addedDays = 0
      let currentDay = startDate
      const histories: any[] = []
      do {
        currentDay = dayjs(startDate).add(addedDays, 'days').format('YYYY-MM-DD')
        const tempStartDate = dayjs(startDate).add(addedDays, 'days').format('YYYY-MM-DDT00:00:00+07:00')
        const tempEndDate = dayjs(startDate).add(addedDays, 'days').format('YYYY-MM-DDT23:59:59+07:00')
        const result = await callReportAPI({ startDate: tempStartDate, endDate: tempEndDate, reportType: 0 })
        const { data } = result
        histories.push({
          label: dayjs(startDate).add(addedDays, 'days').format('DD-MM-YYYY'),
          data,
        })
        addedDays++
      } while (dayjs(currentDay).isBefore(endDate))
      return histories
    },
    async getReport(filter) {
      this.enableLoading()
      const result = await callReportAPI({ startDate: filter.startDate, endDate: filter.endDate, reportType: 0 })
      this.disableLoading()
      return result
    },
    async search(filter, isInclude3DInformation = false, isFromCentralServer = false) {
      this.enableLoading()
      const { startDate, endDate, pageSize, page } = filter
      const filterParam = { startDate, endDate, pageSize, page }
      if (filter.vehicleType) {
        filterParam['vehicleClassID'] = filter.vehicleType
      }
      if (filter.plate) {
        filterParam['licensePlate'] = filter.plate.replace('\t', '').trim()
      }
      if (filter.lane) {
        filterParam['lane'] = filter.lane
      }
      if (filter.exceedWeight.length) {
        filterParam['exceedMaxGVW'] = filter.exceedWeight
      }
      let resultFromImageAPI
      if (isFromCentralServer) {
        resultFromImageAPI = await callSearchAPIFromCentralServer(filterParam)
      } else {
        resultFromImageAPI = await callSearchAPI(filterParam)
      }
      if (isInclude3DInformation) {
        const startDateFor3D = dayjs().subtract(30, 'minutes').format('DD-MM-YYYY HH:mm:ss')
        const endDateFor3D = dayjs().format('DD-MM-YYYY HH:mm:ss')
        const { data: dataFrom3DService } = await call3DAPI({ startDate: startDateFor3D, stopDate: endDateFor3D })
        for (const i in resultFromImageAPI.data) {
          resultFromImageAPI.data[i].dataFrom3D = {}
          const plate = resultFromImageAPI.data[i].plate.license_plate
          if (plate && plate !== '') {
            const dataFrom3DFilterByPlate = dataFrom3DService.find((item) => item.license_plate === plate)
            if (dataFrom3DFilterByPlate) {
              resultFromImageAPI.data[i].dataFrom3D = {
                width: dataFrom3DFilterByPlate.width,
                long: dataFrom3DFilterByPlate.long,
                height: dataFrom3DFilterByPlate.hight,
                imagePath: dataFrom3DFilterByPlate.pathPCDImage,
              }
            }
          }
        }
      }
      this.disableLoading()
      return resultFromImageAPI
    },
    onExceedWeightOptionChange(event) {
      this.filter.exceedWeight = event.target.value
    },
    onLaneOptionChange(event) {
      this.filter.lane = event.target.value
    },
    setCurrentTrafficList(list) {
      this.currentTrafficList = list
    },
    setSearchList(list) {
      this.searchList = list
    },
    setReportList(list) {
      const { data, vehicleClass } = list
      const result: any = []
      let total = 0
      let totalOverWeight = 0
      let totalErrorFlag = 0
      let totalNormalWeight = 0
      for (const i in data) {
        const vehicleClassId = data[i].vehicleClassID
        const vehicle = vehicleClass.find((item) => item.VehicleClassID === vehicleClassId)
        const row = {
          title: vehicle.BosureDescription || '-',
          totalAxles: vehicle.NumAxles || '-',
          maxWeight: (+vehicle.AG1_Weight_Max || 0) + (+vehicle.AG2_Weight_Max || 0) + (+vehicle.AG3_Weight_Max || 0),
          total: data[i].total,
          overWeight: data[i].overWeight,
          errorFlag: data[i].errorFlag,
          normalWeight: data[i].normalWeight,
        }
        result.push(row)

        total = total + data[i].total
        totalOverWeight = totalOverWeight + data[i].overWeight
        totalErrorFlag = totalErrorFlag + data[i].errorFlag
        totalNormalWeight = totalNormalWeight + data[i].normalWeight
      }

      result.push({
        title: 'Total',
        totalAxles: '-',
        maxWeight: '-',
        total: total,
        overWeight: totalOverWeight,
        errorFlag: totalErrorFlag,
        normalWeight: totalNormalWeight,
      })
      this.reportList = result
    },
    setReportGraphData(list) {
      const { data, vehicleClass } = list
      const dataset = [
        {
          label: 'จำนวนทั้งหมด',
          backgroundColor: '#1984c5',
          data: data.map((item) => item.total),
        },
        {
          label: 'จำนวนแนวโน้มน้ำหนักเกิน',
          backgroundColor: '#FF6985',
          data: data.map((item) => item.overWeight),
        },
      ]
      this.reportGraphData.labels = vehicleClass.map((item) => item.BosureDescription)
      this.reportGraphData.datasets = dataset
    },
    setTotalPage(pages) {
      this.filter.totalPage = pages
    },
    setTotalItems(items) {
      this.filter.totalItems = items
    },
    setCurrentPage(page) {
      this.filter.page = page
    },
    setPageSize(size) {
      this.filter.pageSize = size
    },
    enableLoading() {
      this.isLoading = true
    },
    disableLoading() {
      this.isLoading = false
    },
    clearAllOptions() {
      this.filters.stationOptions = []
      this.filters.laneOptions = [{ text: 'เลนทั้งหมด', value: '' }]
    },
    setStationOption(name) {
      this.filters.stationOptions.push({ text: name, value: '' })
    },
    setLaneOption(lane) {
      this.filters.laneOptions.push({ text: lane, value: lane })
    },
    resetFilter() {
      this.filter = {
        selectedStartDate: dayjs().format('YYYY-MM-DD'),
        selectedEndDate: dayjs().format('YYYY-MM-DD'),
        startDate: '',
        endDate: '',
        station: '',
        exceedWeight: '',
        lane: '',
        vehicleType: '',
        plate: '',
        no: '',
        pageSize: 5,
        page: 1,
        totalPage: 0,
        totalItems: 0,
      }
    },
  },
})
