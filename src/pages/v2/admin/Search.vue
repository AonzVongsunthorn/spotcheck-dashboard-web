<template>
  <div class="h-screen">
    <loading v-model:active="isLoading" :is-full-page="true" />
    <div class="top-nav pt-20 pb-5 px-5 xl:px-0 xl:p-10 flex justify-between">
      <div class="flex gap-5 items-end">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">
          <div class="flex gap-3">
            <span class="w-14 flex-initial">สถานี</span>
            <select v-model="filter.station" class="select-box">
              <option v-for="option in filters.stationOptions" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="flex gap-3">
              <span class="w-14 flex-initial">วันที่</span>
            <div class="flex gap-2">
              <input v-model="filter.selectedStartDate" type="date" placeholder="จาก" class="date-input" />
              <input v-model="filter.selectedEndDate" type="date" placeholder="ถึง" class="date-input" />
            </div>
          </div>
          <div class="flex gap-3">
            <span class="w-14 flex-initial">น้ำหนัก</span>
            <select
              v-model="filter.exceedWeight"
              class="select-box"
              @change="listCarStore.onExceedWeightOptionChange($event)"
            >
              <option v-for="option in filters.weightOptions" :value="option.value" selected>
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="flex gap-3">
            <span class="w-14 flex-initial">เลขที่</span>
            <select v-model="filter.no" class="select-box">
              <option v-for="option in filters.noOptions" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="flex gap-3">
            <span class="w-14 flex-initial">ประเภทรถ</span>
            <select v-model="filter.vehicleType" class="select-box">
              <option v-for="option in filters.vehicleTypeOptions" :value="option.value" selected>
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="flex gap-3">
            <span class="w-14 flex-initial">ทะเบียน</span>
            <va-input v-model="filter.plate" placeholder="หมายเลขทะเบียน" />
          </div>
          <div class="flex gap-3">
            <span class="w-14 flex-initial">เลน</span>
            <select v-model="filter.lane" class="select-box" @change="listCarStore.onLaneOptionChange($event)">
              <option v-for="option in filters.laneOptions" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="flex gap-3 xl:justify-self-end">
              <button class="px-3 py-1 bg-[#0F1342] text-white rounded-full flex-initial w-1/6 xl:w-full" @click="search()">
              ตกลง
            </button>

          </div>
        </div>
      </div>
      <div class="xl:flex gap-2 flex-initial hide hidden">
        <div>
          <img src="/th.png" class="h-8" />
        </div>
        <div>
          <select id="" name="" class="select-box">
            <option value="">TH</option>
            <option value="">EN</option>
          </select>
        </div>
      </div>
    </div>
    <div class="xl:px-10 px-4">
      <div class="overflow-x-scroll">
        <table class="xl:table-fixed w-full border-table">
          <tr class="thead">
            <td class="whitespace-nowrap xl:whitespace-normal">วันที่-เวลา</td>
            <td class="whitespace-nowrap xl:whitespace-normal">เลขที่</td>
            <td class="whitespace-nowrap xl:whitespace-normal">ลำดับ</td>
            <td class="whitespace-nowrap xl:whitespace-normal">เลน</td>
            <td class="whitespace-nowrap xl:whitespace-normal">ประเภทรถ</td>
            <td class="whitespace-nowrap xl:whitespace-normal">นน.พิกัด (กก.)</td>
            <td class="whitespace-nowrap xl:whitespace-normal">นน.วัดได้ (กก.)</td>
            <td class="whitespace-nowrap xl:whitespace-normal">นน.เกิน (กก.)</td>
            <td class="whitespace-nowrap xl:whitespace-normal">นน.เกิน (%)</td>
            <td class="whitespace-nowrap xl:whitespace-normal">ป้ายทะเบียน</td>
            <td class="whitespace-nowrap xl:whitespace-normal">ผลการคัดกรอง</td>
            <td class="whitespace-nowrap xl:whitespace-normal">พิมพ์</td>
          </tr>
          <tr
            v-for="(row, index) of searchList"
            :key="index"
            :class="getRowColor(index)"
            @click="listCarStore.openPopup(row.id, getDateFromTimestamp(row.stamp))"
          >
            <td class="whitespace-nowrap xl:whitespace-normal">{{ dayjs(row.stamp).format('YYYY-MM-DD HH:mm:ss') }}</td>
            <td>N/A</td>
            <td>{{ row.id }}</td>
            <td>{{ row.lane }}</td>
            <td class="whitespace-nowrap xl:whitespace-normal">{{ row.BosureDescription }}</td>
            <td>{{ (row.GVW_Weight_Max || 0).toLocaleString() }} กก.</td>
            <td class="text-right">{{ (row.gvw || 0).toLocaleString() }} กก.</td>
            <td class="text-right">{{ row.gvw <= row.GVW_Weight_Max ? '-' : row.gvw - row.GVW_Weight_Max }}</td>
            <td>
              {{
                row.gvw <= row.GVW_Weight_Max
                  ? '-'
                  : `${(((row.gvw - row.GVW_Weight_Max) / row.gvw) * 100).toFixed(2)}%`
              }}
            </td>
            <td>{{ row.plate.license_plate }} {{ row.plate.province }}</td>
            <td>{{ row.gvw <= row.GVW_Weight_Max ? 'ผ่าน' : 'ไม่ผ่าน' }}</td>
            <td>
              <va-icon class="material-icons" @click="listCarStore.openPopup(row.id, getDateFromTimestamp(row.stamp))"
                >print</va-icon
              >
            </td>
          </tr>
        </table>
      </div>
      <div class="my-3 text-right">
        <vue-awesome-paginate
          v-model="filter.page"
          :total-items="filter.totalItems"
          :items-per-page="filter.pageSize"
          :on-click="onClickHandler"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useDashboardStore } from '../../../stores/v2/dashboardStore'
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import dayjs from 'dayjs'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { TOTAL_DEFAULT_SEARCH_ROWS } from '../../../constants'
  import { getRowColor, getDateFromTimestamp } from '../../../helpers/utilities'
  const listCarStore = useDashboardStore()
  const { filters, filter, searchList, isLoading } = storeToRefs(listCarStore)

  onMounted(async () => {
    listCarStore.resetFilter()
    listCarStore.clearAllOptions()
    filter.value.startDate = dayjs().format('YYYY-MM-DDT00:00:00+07:00')
    filter.value.endDate = dayjs().format('YYYY-MM-DDT23:59:59+07:00')
    listCarStore.setTotalPage(1)
    listCarStore.setPageSize(TOTAL_DEFAULT_SEARCH_ROWS)
    const result = await listCarStore.search(filter.value)
    afterReceivedData(result)
    const setting = await listCarStore.getSettingAPI()
    if (setting.stationID && setting.stationName) {
      listCarStore.setStationOption(setting.stationName)
    }
    if (setting.lprCameras.length) {
      for (const camera of setting.lprCameras) {
        listCarStore.setLaneOption(camera.lane)
      }
    }
  })

  async function onClickHandler(page) {
    listCarStore.setCurrentPage(page)
    await search()
  }

  async function search() {
    const { selectedStartDate, selectedEndDate } = filter.value
    filter.value.startDate = `${selectedStartDate}T00:00:00+07:00`
    filter.value.endDate = `${selectedEndDate}T23:59:59+07:00`
    const result = await listCarStore.search(filter.value)
    afterReceivedData(result)
  }

  function afterReceivedData(result) {
    if (result.data) {
      listCarStore.setSearchList(result.data)
    }
    if (result.pagination) {
      listCarStore.setTotalPage(result.pagination.totalPages)
      listCarStore.setTotalItems(result.pagination.totalItems)
    }
  }
</script>
<style>
  .date-input {
    width: 45%;
  }
  .va-input-wrapper__field {
    border-color: rgb(15 19 66) !important;
  }
  .va-input-wrapper__field:after {
    background-color: white;
  }

  .va-input {
    width: 70%;
  }

  .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
  .hide {
    visibility: hidden;
  }
</style>
