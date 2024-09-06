import type { TChartData as ChartData } from 'vue-chartjs/dist/types'
export type TBarChartData = ChartData<'bar'>
export type TLineChartData = ChartData<'line'>
export type TDoughnutChartData = ChartData<'doughnut'>
export type TChartData = TBarChartData | TLineChartData | TDoughnutChartData
