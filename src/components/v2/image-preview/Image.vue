<template>
  <a href="#" @click="isOpen = true">
    <img :src="url" alt="image" :class="styleClass" :style="customStyle" />
  </a>
  <teleport to="body">
    <Lightbox v-if="isOpen" :url="url" @click="closeLightBox" />
  </teleport>
</template>

<script>
  import Lightbox from './Lightbox.vue'
  export default {
    components: {
      Lightbox,
    },
    props: {
      url: {
        type: String,
      },
      styleClass: {
        type: String,
        default: '',
      },
      customStyle: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isOpen: false,
      }
    },
    methods: {
      closeLightBox(e) {
        if (e.target.tagName === 'DIV') {
          this.isOpen = false
        }
      },
    },
  }
</script>

<style scoped>
  img {
    width: 160px;
    height: 160px;
    object-fit: cover;
  }
</style>
