<template>
  <q-page padding>
    <q-item class="q-my-md">
      <q-item-section avatar>
        <div class="row no-wrap items-center">
        <q-btn
          round
          size="sm"
          icon="remove"
          color="purple-5"
          @click="adjustSession(-1)"
        />
        <div class="settings-duration text-center">{{ duration }}</div>
        <q-btn
          round
          size="sm"
          icon="add"
          color="purple-5"
          @click="adjustSession(1)"
        />
        </div>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t('settingsDurationText') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
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
        <q-item-label>{{ $t('settingsWakeLockText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsWakeLockHint') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-btn
      :label="$t('settingsButton')"
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
      wakeLock: false,
      duration: 15
    }
  },
  mounted () {
    this.duration = this.$store.state.app.sessionDuration / 60
    this.wakeLock = this.$store.state.app.wakeLock
  },
  methods: {
    adjustSession (min) {
      this.duration += Number(min)
      if (this.duration < 5) {
        this.duration = 5
      } else if (this.duration > 30) {
        this.duration = 30
      }
    },
    saveSettings () {
      this.$store.dispatch('app/setSessionDuration', this.duration * 60)
      this.$store.dispatch('app/setWakeLock', this.wakeLock)
      this.$router.go(-1)
    }
  }
}
</script>
