<template>
  <q-page padding>
    <div>
      <div v-for="line in log" :key="line.id">
        {{ line }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { getLogs } from '../js/logging'
export default {
  // name: 'PageName',
  created () {
    this.log = getLogs()
  },
  data () {
    return {
      log: []
    }
  }
}
</script>
