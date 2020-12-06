<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
  <p class="q-my-sm wide250">{{ $t('tryoutInfo') }}</p>
  <p class="q-my-sm wide250">{{ $t('tryoutInfo2') }}</p>
  <q-btn
    class="q-ma-md wide250"
    :label="$t('tryoutButton')"
    size="lg"
    color="grey-8"
    @click="proceed"
  />
</q-page>
</template>
<script>
import { tryout } from '../js/remotedb'
export default {
  // name: 'PageName',
  data () {
    return {
      wait: false
    }
  },
  computed: {
    progressClass () {
      const cls = 'fixed-top'
      return this.wait ? cls : cls.concat(' invisible')
    }
  },
  methods: {
    async proceed () {
      try {
        this.wait = true
        await tryout(window.device.uuid)
      } catch (e) {}
      this.$store.dispatch('app/setTryout')
      this.$router.replace('/app')
    }
  }
}
</script>
