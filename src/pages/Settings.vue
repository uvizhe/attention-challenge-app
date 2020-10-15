<template>
  <q-page padding>
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
          :options="langOptions"
        />
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section>
        <q-item-label>{{ $t('settingsDurationText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsDurationHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="row no-wrap items-center">
        <q-btn
          round
          size="sm"
          icon="remove"
          color="purple-5"
          @click="adjustSession(-1)"
          :disable="lowerSessionLimit"
        />
        <div class="settings-duration text-center">{{ duration }}</div>
        <q-btn
          round
          size="sm"
          icon="add"
          color="purple-5"
          @click="adjustSession(1)"
          :disable="upperSessionLimit"
        />
        </div>
      </q-item-section>
    </q-item>
    <q-item class="q-my-md">
      <q-item-section>
        <q-item-label>{{ $t('settingsDeferBellsText') }}</q-item-label>
        <q-item-label caption>{{ $t('settingsDeferBellsHint') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="row no-wrap items-center">
        <q-btn
          round
          size="sm"
          icon="remove"
          color="purple-5"
          @click="adjustDeferral(-1)"
          :disable="lowerDeferralLimit"
        />
        <div class="settings-duration text-center">{{ deferral }}</div>
        <q-btn
          round
          size="sm"
          icon="add"
          color="purple-5"
          @click="adjustDeferral(1)"
          :disable="upperDeferralLimit"
        />
        </div>
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
          color="purple-5"
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
          color="purple-5"
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
          color="purple-5"
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
      color="purple-5"
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
      locale: '',
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
    this.locale = this.$i18n.locale
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
      this.$store.dispatch('app/setLocale', this.locale)
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
