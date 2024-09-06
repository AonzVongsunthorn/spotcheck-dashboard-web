<template>
  <TypeCar1 v-if="vehicleClassId === 1"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar1>
  <TypeCar2 v-if="vehicleClassId === 2"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar2>
  <TypeCar3 v-if="vehicleClassId === 3"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar3>
  <TypeCar4 v-if="vehicleClassId === 4"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar4>
  <TypeCar5 v-if="vehicleClassId === 5"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar5>
  <TypeCar6 v-if="vehicleClassId === 6"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar6>
  <TypeCar7 v-if="vehicleClassId === 7"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar7>
  <TypeCar8 v-if="vehicleClassId === 8"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar8>
  <TypeCar9 v-if="vehicleClassId === 9"  :status="status" :title="title" :weight="weight" :dataset="dataset"  :customStyle="customStyle" :underline="underline"></TypeCar9>
  <TypeCar10 v-if="vehicleClassId === 10"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar10>
  <TypeCar11 v-if="vehicleClassId === 11"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar11>
  <TypeCar12 v-if="vehicleClassId === 12"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar12>
  <TypeCar13 v-if="vehicleClassId === 13"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar13>
  <TypeCar14 v-if="vehicleClassId === 14"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar14>
  <TypeCar15 v-if="vehicleClassId === 15"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar15>
  <TypeCar16 v-if="vehicleClassId === 16"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar16>
  <TypeCar17 v-if="vehicleClassId === 17"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar17>
  <TypeCar18 v-if="vehicleClassId === 18"  :status="status" :title="title"  :weight="weight" :dataset="dataset" :customStyle="customStyle" :underline="underline"></TypeCar18>
</template>
<script setup>
import TypeCar1 from './VehicleClassID1.vue'
import TypeCar10 from './VehicleClassID10.vue'
import TypeCar11 from './VehicleClassID11.vue'
import TypeCar12 from './VehicleClassID12.vue'
import TypeCar13 from './VehicleClassID13.vue'
import TypeCar14 from './VehicleClassID14.vue'
import TypeCar15 from './VehicleClassID15.vue'
import TypeCar16 from './VehicleClassID16.vue'
import TypeCar17 from './VehicleClassID17.vue'
import TypeCar18 from './VehicleClassID18.vue'
import TypeCar2 from './VehicleClassID2.vue'
import TypeCar3 from './VehicleClassID3.vue'
import TypeCar4 from './VehicleClassID4.vue'
import TypeCar5 from './VehicleClassID5.vue'
import TypeCar6 from './VehicleClassID6.vue'
import TypeCar7 from './VehicleClassID7.vue'
import TypeCar8 from './VehicleClassID8.vue'
import TypeCar9 from './VehicleClassID9.vue'

defineProps({
  vehicleClassId:{
    type: Number,
    default: ''
  },
  status:{
    type:String,
    default: ''
  },
  title: {
    type:String,
    default: ''
  },
  weight: {
    type:String,
    default: ''
  },
  dataset:{
    type:Array,
    default:[]
  },
  customStyle: {
    type:String,
    default: ''
  },
  underline:{
    type:Boolean,
    default:false
  }
});
</script>
