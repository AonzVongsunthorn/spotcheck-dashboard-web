<template>
  <div v-for="(item, index) in cctvUrls || []" :key="index" class="flex xs12 lg12 xl12 padding-bottom cctv-panel" style="padding-right: 0px;">
    <va-card :id="generateCCTVPanelId(index)">
      <va-card-title>{{ item.title }}</va-card-title>
      <va-card-content class="cctv-container">
        <canvas :id="generateCCTVId(index)" style="width: 99.99%"></canvas>
      </va-card-content>
    </va-card>
  </div>
  <div v-if="!cctvUrls.length" class="flex xs12 lg12 xl12" style="padding-right: 0px;">
    <va-card>
      <va-card-content class="cctv-container">
        <va-alert color="warning">
          <template #icon>
            <va-badge color="warning" text="Warning" />
          </template>
          ไม่พบการตั้งค่า CCTV
        </va-alert>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useDashboardV1Store } from '../../../stores/v1/dashboardStore'
  import Jsmpeg from '@cycjimmy/jsmpeg-player'
  import { ConfigurationCCTVValueObject } from '../../../services/api/v1/configuration/api.interface'
  import { onMounted, ref } from 'vue'
  const dashboardStore = useDashboardV1Store()
  const cctvUrls = ref<ConfigurationCCTVValueObject[]>([])
  const CCTVStreamPrefix = 'CCTVStream'
  const CCTVStreamPanelPrefix = 'CCTVStreamPanel'

  onMounted(async () => {
    const cctvConfigurationResponse = await dashboardStore.getCCTVUrls()
    const CCTVConfigs = ((cctvConfigurationResponse.values || []) as ConfigurationCCTVValueObject[]).map((item) => {
      return {
        title: item.title,
        url: item.url,
      }
    })
    cctvUrls.value = CCTVConfigs
    delay(1000).then(() => {
      for (const index in CCTVConfigs) {
        const config = CCTVConfigs[index]
        const { url } = config
        if (url) {
          console.log(`initialize cctv from url, ${url}`)
          new Jsmpeg.Player(url, { canvas: document.getElementById(generateCCTVId(+index)) })
        }
      }
    })
  })

  function generateCCTVId(index: number) {
    return `${CCTVStreamPrefix}${index}`
  }

  function generateCCTVPanelId(index: number) {
    return `${CCTVStreamPanelPrefix}${index}`
  }

  function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
</script>
<style lang="scss" scoped>
  .padding-bottom {
    padding-bottom: 20px;
  }
  .va-card-title {
    font-size: 18px;
  }
  .va-card__content {
    height: 400px;
  }
  .cctv-container {
    position: relative;
    height: auto;
  }
  .cctv-panel {
    display: flex;
  }
</style>
