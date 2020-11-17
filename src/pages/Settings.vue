<template>
  <q-page padding>
    <q-item class="q-my-md">
      <q-item-section>
        <q-item-label>{{ $t('settingsVolumeText') }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-slider
          label-always
          v-model="volume"
          :min="1"
          :max="5"
          color="grey-8"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section>
        <q-item-label>{{ $t('settingsLanguageText') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-select
          outlined
          emit-value
          map-options
          v-model="locale"
          color="grey-8"
          :options="langOptions"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section>
        <q-item-label>{{ $t('settingsStartOfWeekDayText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsStartOfWeekDayHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-select
          outlined
          emit-value
          map-options
          v-model="startOfWeekDay"
          color="grey-8"
          :options="startOfWeekOptions"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section @click="wakeLock=!wakeLock">
        <q-item-label>{{ $t('settingsWakeLockText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsWakeLockHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle
          v-model="wakeLock"
          color="grey-8"
          checked-icon="check"
          unchecked-icon="clear"
          size="lg"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section @click="dndMode=!dndMode">
        <q-item-label>{{ $t('settingsDNDModeText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsDNDModeHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle
          v-model="dndMode"
          color="grey-8"
          checked-icon="check"
          unchecked-icon="clear"
          size="lg"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section @click="publicProfile=!publicProfile">
        <q-item-label>{{ $t('settingsDataSharingText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsDataSharingHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle
          v-model="publicProfile"
          :disable="$store.state.app.offline"
          color="grey-8"
          checked-icon="check"
          unchecked-icon="clear"
          size="lg"
        />
      </q-item-section>
    </q-item>
    <q-btn
      :label="$t('settingsButton')"
      class="full-width q-mt-md fixed-bottom shadow-up-3 square-button"
      size="large"
      color="grey-8"
      @click="saveSettings"
    />
  </q-page>
</template>

<script>
import { MIN_SESSION, MAX_SESSION } from '../js/constants'
export default {
  // name: 'PageName',
  data () {
    return {
      volume: null,
      locale: '',
      startOfWeekDay: '',
      wakeLock: false,
      dndMode: true,
      publicProfile: false,
      duration: 15,
      deferral: 0
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$i18n.locale = this.locale
    next()
  },
  mounted () {
    this.volume = this.$store.state.app.soundVolume
    this.locale = this.$i18n.locale
    this.startOfWeekDay = this.$store.getters['app/startOfWeekDay']
    this.duration = this.$store.state.app.sessionDuration / 60
    this.deferral = this.$store.state.app.bellsDeferral / 60
    this.wakeLock = this.$store.state.app.wakeLock
    this.dndMode = this.$store.state.app.dndMode
    this.publicProfile = this.$store.state.app.publicProfile
  },
  computed: {
    langOptions () {
      return this.$store.state.app.languages
    },
    startOfWeekOptions () {
      return this.$store.getters['app/startOfWeekOptions']
    },
    lowerSessionLimit () {
      return this.duration === MIN_SESSION
    },
    upperSessionLimit () {
      return this.duration === MAX_SESSION
    },
    lowerDeferralLimit () {
      return this.deferral === 0
    },
    upperDeferralLimit () {
      return this.duration - this.deferral === MIN_SESSION
    }
  },
  methods: {
    adjustSession (min) {
      this.duration += Number(min)
      if (this.duration < MIN_SESSION) {
        this.duration = MIN_SESSION
      } else if (this.duration > MAX_SESSION) {
        this.duration = MAX_SESSION
      }
      if (this.duration - this.deferral < MIN_SESSION) {
        this.deferral = this.duration - MIN_SESSION
      }
    },
    adjustDeferral (min) {
      const change = Number(min)
      if (this.duration - this.deferral - change >= MIN_SESSION) {
        this.deferral += change
        if (this.deferral < 0) {
          this.deferral = 0
        }
      }
    },
    saveSettings () {
      this.$store.dispatch('app/setSoundVolume', this.volume)
      this.$store.dispatch('app/setLocale', this.locale)
      this.$store.dispatch('app/setStartOfWeekDay', this.startOfWeekDay)
      this.$store.dispatch('app/setSessionDuration', this.duration * 60)
      this.$store.dispatch('app/setBellsDeferral', this.deferral * 60)
      this.$store.dispatch('app/setWakeLock', this.wakeLock)
      this.$store.dispatch('app/setDNDMode', this.dndMode)
      this.$store.dispatch('app/setPublicProfile', this.publicProfile)
      this.$router.replace('/app')
    }
  }
}
</script>
