<template>
  <q-page padding>
    <q-item>
      <q-item-section avatar>
        <q-toggle
          v-model="wakeLock"
          color="purple-5"
          checked-icon="check"
          unchecked-icon="clear"
          size="lg"
        />
      </q-item-section>
      <q-item-section @click="wakeLock=!wakeLock">
        <q-item-label>Keep screen on through session</q-item-label>
        <q-item-label caption>In case the timer stops when screen is off</q-item-label>
      </q-item-section>
    </q-item>
    <q-btn
      label="Save Settings"
      class="full-width q-mt-md fixed-bottom shadow-up-3 square-button"
      size="large"
      color="purple-5"
      @click="saveSettings"
    />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      wakeLock: false
    }
  },
  mounted () {
    this.wakeLock = this.$store.state.app.wakeLock
  },
  methods: {
    saveSettings () {
      this.$store.dispatch('app/setWakeLock', this.wakeLock)
      this.$router.go(-1)
    }
  }
}
</script>
