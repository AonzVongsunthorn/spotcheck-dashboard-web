<template>
  <div class="flex flex-col justify-center items-start" :style=customStyle>
    <div class="font-bold">{{ title }} {{ weight }}</div>
    <div class="relative">
      <img :src="showImg" class="object-contain">
      <div class="text-center" v-if="underline">
        {{ (dataset[0])?dataset[0]:'-' }}
      </div>
    </div>
  </div>
</template>
<script>
import img_red from "../../../assets/vehicle-type-images/type-1/red.png";
import img_yellow from "../../../assets/vehicle-type-images/type-1/yellow.png";
import img_blue from "../../../assets/vehicle-type-images/type-1/blue.png";
import img_red_no from "../../../assets/vehicle-type-images/type-1/red_no_underline.png";
import img_yellow_no from "../../../assets/vehicle-type-images/type-1/yellow_no_underline.png";
import img_blue_no from "../../../assets/vehicle-type-images/type-1/blue_no_underline.png";

export default {
  props: {
    status: {
      type: String,
      default: null
    },
    dataset: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    weight: {
      type: String,
      default: ""
    },
    customStyle: {
      type: String,
      default: ""
    },
    underline:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      img_red: img_red,
      img_yellow: img_yellow,
      img_blue: img_blue,
      img_red_no: img_red_no,
      img_yellow_no: img_yellow_no,
      img_blue_no: img_blue_no,
      showImg: null
    };
  },
  mounted() {
    this.setType();
  },
  methods: {
    setType() {
      if(this.underline){
        if (this.status === "error") {
        this.showImg = img_red;
      } else if (this.status === "warning") {
        this.showImg = img_yellow;
      } else {
        this.showImg = img_blue;
      }
      }else{
        if (this.status === "error") {
        this.showImg = img_red_no;
      } else if (this.status === "warning") {
        this.showImg = img_yellow_no;
      } else {
        this.showImg = img_blue_no;
      }
      }
    }
  }
};
</script>
