<template>
  <div class="auth-layout row align-content-center">
    <div class="flex xs12">
      <div class="d-flex justify-center">
        <va-image src="/dashboard.png" max-width="128" />
      </div>
    </div>
    <div class="flex xs12">
      <div class="d-flex justify-center">
        <va-card class="auth-layout__card">
          <va-card-content>
            <va-separator />
            <div class="pa-3">
              <router-view />
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'AuthLayout',
    components: {},
    setup() {
      const { t } = useI18n()
      return { t }
    },
    data() {
      return {
        selectedTabIndex: 0,
      }
    },
    computed: {
      tabIndex: {
        set(tabName) {
          this.$router.push({ name: tabName })
        },
        get() {
          return this.$route.name
        },
      },
    },
  }
</script>

<style lang="scss">
  .auth-layout {
    min-height: 100vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

    &__card {
      width: 100%;
      max-width: 600px;
    }
  }
</style>
