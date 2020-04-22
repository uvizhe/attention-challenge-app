<template>
  <q-page padding class="flex flex-center content-start">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <div class="text-h5 q-my-md">SETTINGS</div>
    <q-btn
      label="Restore chart data"
      class="full-width q-mb-md"
      color="primary"
      @click="restoreData"
    />
    <q-btn
      label="Show debug logs"
      class="full-width q-mb-md"
      color="negative"
      @click="$router.push('/logs')"
    />
  </q-page>
</template>

<script>
import { getStats } from '../js/database'
export default {
  // name: 'PageName',
  data () {
    return {
      error: false,
      errMsg: ''
    }
  },
  computed: {
    errorBannerClass: function () {
      let cls = 'absolute-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
    }
  },
  methods: {
    showError (error) {
      this.errMsg = error
      this.error = true
      setTimeout(() => {
        this.error = false
      }, 3000)
    },
    async restoreData () {
      try {
        await getStats()
      } catch (e) {
        this.showError(e)
      }
    }
  }
}
</script>
