<template>
  <div class="h-screen" id="topOfThePage">
    <loading v-model:active="isLoading"
             :is-full-page="true"/>
    <div class="top-nav pt-20 pb-5 px-5 xl:px-0 xl:p-10 flex justify-between">
      <h1 class="text-3xl">ตั้งค่าสถานี</h1>
    </div>
    <div class="top-nav p-5 xl:p-10 flex justify-between pt-0 pb-3" v-if="!isLoading">
      <div class="flex xs12">
        <va-card>
          <va-card-title><h1 class="text-xl">ข้อมูลสถานี</h1></va-card-title>
          <va-card-content>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.stationID" label="หมายเลขสถานี" :error=stationErrors.stationID.isError :error-messages="stationErrors.stationID.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.stationName" label="ชื่อสถานี" :error=stationErrors.stationName.isError :error-messages="stationErrors.stationName.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.host" label="IP เครื่อง" :error=stationErrors.host.isError :error-messages="stationErrors.host.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-select
                  v-model="controllerOption"
                  label="เลือก Controller"
                  text-by="text"
                  track-by="value"
                  :options="controllerOptions"
                />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.wsDataLogger" label="URL รับข้อมูล Vehicle controller" :error=stationErrors.wsDataLogger.isError :error-messages="stationErrors.wsDataLogger.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.wsSensors" label="URL รับข้อมูล Trigger controller" :error=stationErrors.wsSensors.isError :error-messages="stationErrors.wsSensors.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.wheelBaseGroup" label="กำหนดระยะกลุ่มเพลา (m)" :error=stationErrors.wheelBaseGroup.isError :error-messages="stationErrors.wheelBaseGroup.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-select
                  v-model="roadSurfaceOption"
                  label="เลือกพื้นถนน"
                  text-by="text"
                  track-by="value"
                  :options="roadSurfaceOptions"
                />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.thick" label="ความหนาของพื้น (นิ้ว)" :error=stationErrors.thick.isError :error-messages="stationErrors.thick.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.flir" label="url รับข้อมูล flir" :error=stationErrors.flir.isError :error-messages="stationErrors.flir.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.flux" label="ip flux" :error=stationErrors.flux.isError :error-messages="stationErrors.flux.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.flux_video" label="กำหนด frame " :error=stationErrors.flux_video.isError :error-messages="stationErrors.flux_video.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.gvwIgnored" label="น้ำหนักที่ต้องละทิ้ง (kg)" :error=stationErrors.gvwIgnored.isError :error-messages="stationErrors.gvwIgnored.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.lengthIgnored" label="ความยาวเพลารถเล็กที่ต้องละทิ้ง (cm.)" :error=stationErrors.lengthIgnored.isError :error-messages="stationErrors.lengthIgnored.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.delayOverviewUTC" label="กำหนด delay ก่อนค้นภาพ กรณี UTC (ms)" :error=stationErrors.delayOverviewUTC.isError :error-messages="stationErrors.delayOverviewUTC.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.min" label="กำหนด min ในการเลือกภาพ (ms)" :error=stationErrors.min.isError :error-messages="stationErrors.min.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.max" label="กำหนด max ในการเลือกภาพ (ms)" :error=stationErrors.max.isError :error-messages="stationErrors.max.errorMessage" />
              </div>
              <div class="flex md4 sm6 xs12">
                <va-input v-model="data.OCRServer" label="URL สำหรับอ่านป้ายทะเบียน" :error=stationErrors.OCRServer.isError :error-messages="stationErrors.OCRServer.errorMessage" />
              </div>
            </div>
            <div class="xl:row grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-3">
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.mainServer" label="url ส่งข้อมูลไปยังส่วนกลาง" :error=stationErrors.mainServer.isError :error-messages="stationErrors.mainServer.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.centerStation" label="url ส่งข้อมูลไปยังระบบรวม" :error=stationErrors.centerStation.isError :error-messages="stationErrors.centerStation.errorMessage" />
              </div>
              <div class="xl:flex md4 sm6 xs12">
                <va-input v-model="data.distanceAxles2Class" label="กำหนดระยะเพลาระหว่างรถ 4 ล้อ และ 6 ล้อ " :error=stationErrors.distanceAxles2Class.isError :error-messages="stationErrors.distanceAxles2Class.errorMessage" />
              </div>
            </div>
          </va-card-content>
        </va-card>
    </div>
  </div>
  <div class="top-nav p-5 xl:p-10 flex justify-between pt-0 pb-3">
    <div class="flex xs12">
      <va-card>
        <va-card-title>
          <div>
            <h1 class="text-xl">url แสดงภาพ Real-Time</h1>
            <h1 v-if="isRealTimeFieldHasError" class="text-xl text-red">กรุณากรอกข้อมูล url แสดงภาพ Real-Time ให้ครบ</h1>
          </div>
        </va-card-title>
        <va-card-content>
          <div class="row">
            <div class="flex md4 sm6 xs12">
              <h1 class="text-xl">URL</h1>
            </div>
          </div>
          <div class="row mt-3" v-for="(item, idx) in data.streaming_url" :key="idx">
            <div class="flex flex-initial md4 sm6 xs12">
              <va-input :key="idx" v-model="data.streaming_url[idx].url" />
              <button class="flex-none mt-1 py-1 bg-red-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.removeRealtimeItem(idx)">ลบ</button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="flex md1">
              <button class="flex-none mt-1 py-1 bg-blue-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.addRealtimeItem()">เพิ่ม</button>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
  <div class="top-nav p-5 xl:p-10 flex justify-between pt-0 pb-3">
    <div class="flex xs12">
      <va-card>
        <va-card-title>
          <div>
            <h1 class="text-xl">กล้อง overview</h1>
            <h1 v-if="isOverviewCameraFieldHasError" class="text-xl text-red">กรุณากรอกข้อมูล กล้อง overview ให้ครบ</h1>
          </div>
        </va-card-title>
        <va-card-content>
          <div class="row">
            <div class="flex md4 sm6 xs12">
              <h1 class="text-xl">ช่องจราจร</h1>
            </div>
            <div class="flex md4 sm6 xs12">
              <h1 class="text-xl">URL กล้อง</h1>
            </div>
          </div>
          <div class="row mt-3" v-for="(item, idx) in data.overviewCameras" :key="idx">
            <div class="flex md4 sm6 xs12">
              <va-input v-model="data.overviewCameras[idx].lane" />
            </div>
            <div class="flex md4 sm6 xs12">
              <va-input v-model="data.overviewCameras[idx].snapCode" />
              <button class="flex-none mt-1 py-1 bg-red-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.removeOverviewItem(idx)">ลบ</button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="flex md1">
              <button class="flex-none mt-1 py-1 bg-blue-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.addOverviewItem()">เพิ่ม</button>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
  <div class="top-nav p-5 xl:p-10 flex justify-between pt-0 pb-3">
    <div class="flex xs12">
      <va-card>
        <va-card-title>
          <div>
            <h1 class="text-xl">กล้อง LPR</h1>
            <h1 v-if="isLPRCameraFieldHasError" class="text-xl text-red">กรุณากรอกข้อมูล กล้อง LPR ให้ครบ</h1>
          </div>
        </va-card-title>
        <va-card-content>
          <div class="row">
            <div class="flex md4 sm6 xs12">
              <h1 class="text-xl">ช่องจราจร</h1>
            </div>
            <div class="flex md4 sm6 xs12">
              <h1 class="text-xl">URL กล้อง</h1>
            </div>
          </div>
          <div class="row mt-3" v-for="(item, idx) in data.lprCameras" :key="idx">
            <div class="flex md4 sm6 xs12">
              <va-input :model-value="data.lprCameras[idx].lane" />
            </div>
            <div class="flex md4 sm6 xs12">
              <va-input :model-value="data.lprCameras[idx].snapCode" />
              <button class="flex-none mt-1 py-1 bg-red-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.removeLprCamerasItem(idx)">ลบ</button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="flex md1">
              <button class="flex-none mt-1 py-1 bg-blue-500 rounded-full text-white text-md font-bold w-20" @click="stationSetupStore.addLprCamerasItem()">เพิ่ม</button>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
  <div class="top-nav p-10 flex justify-between pt-0 pb-3">
    <div class="row">
      <div class="flex md4 sm6 xs12"></div>
      <div class="flex md4 sm6 xs12"></div>
      <div class="flex md4 sm6 xs12 pb-3">
        <button class="mt-1 py-1 bg-blue-500 rounded-full text-white text-md font-bold w-20" @click="submitSetting()">บันทึก</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { onMounted } from "vue";
import { useStationSetupStore } from "../../../stores/v2/stationSetupStore";
import { storeToRefs } from "pinia";
import Loading from 'vue-loading-overlay';
import { createToast } from 'mosha-vue-toastify'
import 'vue-loading-overlay/dist/css/index.css';

const stationSetupStore = useStationSetupStore()
const {
  data,
  isLoading,
  controllerOptions,
  roadSurfaceOptions,
  roadSurfaceOption,
  controllerOption,
  isStationFieldHasError,
  isRealTimeFieldHasError,
  isOverviewCameraFieldHasError,
  isLPRCameraFieldHasError,
  stationErrors
} = storeToRefs(stationSetupStore)
onMounted(async () => {
  stationSetupStore.enableLoading()
  await stationSetupStore.getSettingAPI()
  stationSetupStore.setRoadSurfaceOption();
  stationSetupStore.setController();
  stationSetupStore.disableLoading()
});

async function submitSetting() {
  stationSetupStore.resetErrors();
  stationSetupStore.validationStation();
  stationSetupStore.validationRealTime();
  stationSetupStore.validationOverview();
  stationSetupStore.validationLPR();
  if (isStationFieldHasError.value
    || isRealTimeFieldHasError.value
    || isOverviewCameraFieldHasError.value
    || isLPRCameraFieldHasError.value)
  {
    createToast('กรุณากรอกข้อมูลให้ครบถ้วน', {
      position: 'top-right',
      type: 'danger',
    })
    return
  }
  stationSetupStore.enableLoading()
  await stationSetupStore.updateSetting(data.value)
  stationSetupStore.disableLoading()
}
</script>
<style>
.va-input-label {
  font-size: 16px;
  font-weight: bold;
}
.va-message-list__message {
  font-size: 16px;
  font-weight: bold;
}
.va-input-wrapper__container {
  width: 80%;
}
.text-red {
  color: red;
}
</style>
