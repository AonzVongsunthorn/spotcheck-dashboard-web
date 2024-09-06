<template>
  <div class="flex h-screen overflow-auto">
    <Sidebar></Sidebar>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<script>
  import Sidebar from '../../components/v2/Sidebar.vue'
  export default {
    components: {
      Sidebar,
    },
  }
</script>
