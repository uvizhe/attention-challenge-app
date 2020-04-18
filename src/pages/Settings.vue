<template>
  <q-page padding class="flex flex-center content-start">
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
  methods: {
    restoreData () {
      getStats()
    }
  }
}
</script>
