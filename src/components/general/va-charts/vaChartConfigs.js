import { defineAsyncComponent } from 'vue'

export const defaultConfig = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          color: '#34495e',
          family: 'sans-serif',
          size: 14,
        },
        usePointStyle: true,
      },
    },
    tooltip: {
      bodyFont: {
        size: 14,
        family: 'sans-serif',
      },
      boxPadding: 4,
    },
    datalabels: {
      display: function (context) {
        return context.dataset.data[context.dataIndex] > 0
      },
      color: 'black',
      anchor: 'end',
      align: 'bottom',
      padding: {
        top: 20,
      },
    },
  },
  datasets: {
    line: {
      fill: false,
      tension: 0.2,
    },
    bar: {
      borderColor: 'transparent',
    },
  },
  maintainAspectRatio: false,
  animation: true,
  responsive: true,
}

export const chartTypesMap = {
  bar: defineAsyncComponent(() => import('./chart-types/BarChart.vue')),
  doughnut: defineAsyncComponent(() => import('./chart-types/DoughnutChart.vue')),
  'horizontal-bar': defineAsyncComponent(() => import('./chart-types/HorizontalBarChart.vue')),
  line: defineAsyncComponent(() => import('./chart-types/LineChart.vue')),
}
