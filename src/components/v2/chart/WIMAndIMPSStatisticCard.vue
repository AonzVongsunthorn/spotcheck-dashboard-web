<template>
  <div class="row">
    <va-card color="#20283E" class="m-3 text-center">
      <va-card-content>
        <p class="va-h2 m-0 text-white font-48">{{totalTraffic}}</p>
        <p class="text-white font-16">จำนวนรถทั้งหมด</p>
        <p class="text-white font-16">จาก WIM</p>
      </va-card-content>
    </va-card>
    <va-card color="#20283E" class="m-3 ml-1 mr-1 text-center">
      <va-card-content>
        <p class="va-h2 m-0 text-white font-48">{{totalReportStatus}}</p>
        <p class="text-white font-16">จำนวนสถานะ</p>
        <p class="text-white font-16">เข้าชั่งจาก WIM &nbsp;</p>
      </va-card-content>
    </va-card>
    <va-card color="#20283E" class="m-3 text-center">
      <va-card-content>
        <p class="va-h2 m-0 text-white font-48">{{totalIsPassStaticService}}</p>
        <p class="text-white font-16">รถที่เข้าชั่งทั้งหมด</p>
        <p class="text-white font-16">จาก Static</p>
      </va-card-content>
    </va-card>
  </div>
  <div class="row padding-bottom">
    <va-card color="#20283E" class="m-3 text-center">
      <va-card-content>
        <p class="va-h2 m-0 text-white font-48">{{totalPassFromIMPS}}</p>
        <p class="text-white font-16">ไม่เข้าชั่ง (IMPS) &nbsp;</p>
      </va-card-content>
    </va-card>
    <va-card :color="getBackgroundColorOfOverWeight(totalOverWeightFromIMPS, totalPassFromIMPS)" class="m-3 ml-1 mr-1 text-center">
      <va-card-content>
        <p class="va-h2 m-0 text-white font-48">{{totalOverWeightFromIMPS}}</p>
        <p class="text-white font-16">คาดว่านำหนักเกิน</p>
        <p class="text-white font-16">&nbsp;</p>
      </va-card-content>
    </va-card>
  </div>
</template>
<script>
export default {
  props: {
    totalTraffic: {
      type: String,
      default: 'N/A'
    },
    totalReportStatus: {
      type: String,
      default: 'N/A'
    },
    totalIsPassStaticService: {
      type: String,
      default: 'N/A'
    },
    totalPassFromIMPS: {
      type: String,
      default: 'N/A'
    },
    totalOverWeightFromIMPS: {
      type: String,
      default: 'N/A'
    },
  },
  methods: {
    getBackgroundColorOfOverWeight(overweight, total){
      const percent = (overweight/total) * 100;
      if (percent >= 21) {
        return '#AC3E31'
      } else if (percent >= 10 && percent <= 20) {
        return '#DBAE58'
      }
      return '#488A99'
    }
  }
}
</script>
