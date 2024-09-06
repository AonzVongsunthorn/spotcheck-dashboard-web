import { Axle } from '../services/api/v2/dashboard/interface'
import dayjs from 'dayjs'
const BASE_API_URL = import.meta.env.VITE_BASE_IMAGE_API_URL || import.meta.env.VITE_BASE_API_V2_URL
const BASE_3D_API_URL = import.meta.env.VITE_BASE_3D_API_URL

export const getVehicleTitle = (title) => {
  return title.split('(')[0]
}

export const buildStaticURL = (url) => {
  const staticUrl = `${BASE_API_URL}/${url}`
  return staticUrl.replace(/([^:]\/)\/+/g, '$1')
}

export const build3DStaticURL = (url) => {
  const staticUrl = `${BASE_3D_API_URL}/${url}`
  return staticUrl.replace(/([^:]\/)\/+/g, '$1')
}

export const convertDateToHumanUnderstandable = (dateTime) => {
  return dayjs(dateTime).format('DD-MM-YYYY')
}

export const getDateFromTimestamp = (dateTime) => {
  return dayjs(dateTime).format('YYYY-MM-DD')
}

export const getTimeFromTimestamp = (dateTime) => {
  return dayjs(dateTime).format('HH:mm:ss')
}

export const getRowColor = (currentRow) => {
  return currentRow % 2 ? 'bg-[#0f134231]' : 'bg-[#0f134204]'
}

export const isNumber = (value) => {
  return /^-?\d+$/.test(value)
}

export const getVehicleWeight = (vehicleTypeTitle) => {
  const types = vehicleTypeTitle.split('(')
  if (types.length > 1) {
    return `(${types[1]}`
  }
  return ''
}

export const generateDatesetForCarType = (axles: Axle[]) => {
  const wheelBases: string[] = []
  for (const index in axles) {
    if (+index === 0) {
      continue
    }
    wheelBases.push(axles[index].wheelbase.toFixed(0))
  }
  return wheelBases
}

export const calculatePercent = (currentValue: number, baseValue: number): number => {
  return Math.round(((currentValue - baseValue) * 100) / baseValue)
}
