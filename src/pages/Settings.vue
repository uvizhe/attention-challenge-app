<template>
  <q-page padding class="flex flex-center content-start">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <page-header title="Settings" />
    <q-btn
      label="Restore chart data"
      class="full-width q-mb-lg q-py-md"
      color="purple-5"
      @click="restoreData"
    />
    <q-btn
      label="Show debug logs"
      class="full-width q-mb-lg q-py-md"
      color="red"
      @click="$router.push('/logs')"
    />
  </q-page>
</template>

<script>
import PageHeader from 'components/PageHeader'
import { getStats } from '../js/database'
export default {
  // name: 'PageName',
  components: {
    PageHeader
  },
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
        this.showError(e.message)
      }
    }
  }
}
</script>
