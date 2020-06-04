<template>
  <q-page padding class="flex">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <rating-dialog :show="ratingDialog" @rated="reportScore" />
    <div class="column justify-between full-width">
      <div class="col-5 relative-position">
        <totals-chart />
      </div>
      <div class="col-shrink relative-position">
        <avgs30-chart />
      </div>
      <div class="row col-grow relative-position justify-between items-center">
        <q-btn v-if="!sessionOn"
          icon="remove"
          round
          color="purple-5"
          class="q-mx-md"
          @click="adjustSession(-1)"
        />
        <q-btn
          class="absolute-center shadow-up-5"
          @click="startSession"
          :disable="sessionOn"
          round
          size="60px"
          color="red"
        >
          <div class="big-red-btn-title relative-position">

            <div v-if="!sessionOn">
              <q-icon name="play_arrow" />
              <div
                class="big-red-btn-subtitle absolute-bottom text-red-2 text-lowercase">
                {{ sessionDurationMin }}&nbsp;{{ $t('rbMin') }}
              </div>
            </div>
            <div v-else>
              {{ buttonTitle }}
            </div>
          </div>
        </q-btn>
        <q-btn v-if="!sessionOn"
          icon="add"
          round
          color="purple-5"
          class="q-mx-md"
          @click="adjustSession(1)"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import RatingDialog from 'components/RatingDialog'
import TotalsChart from 'components/TotalsChart'
import Avgs30Chart from 'components/Avgs30Chart'
import { randomSignals } from '../js/rsg'
export default {
  name: 'PageIndex',
  components: {
    RatingDialog,
    TotalsChart,
    Avgs30Chart
  },
  created () {
    if (!this.$store.state.app.initialized) {
      this.$store.dispatch('app/initData')
      this.$i18n.locale = this.$store.state.app.locale
      document.addEventListener('resume', this.onResume, false)
    }
    this.sessionDuration = process.env.SESSION_DURATION ||
      this.$store.state.app.sessionDuration
    this.seconds = this.sessionDuration
  },
  mounted () {
    if (this.$q.platform.is.android) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media(
        '/android_asset/www/statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media(
        '/android_asset/www/statics/sounds/Bowl.mp3')
    } else if (this.$q.platform.is.ios) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media('statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media('statics/sounds/Bowl.mp3')
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.sessionOn) {
      this.stopTimer()
    }
    next()
  },
  data () {
    return {
      sessionDuration: 0,
      seconds: 0,
      sessionOn: false,
      timer: null,
      signals: [],
      error: false,
      errMsg: '',
      ratingDialog: false,
      dingSound: undefined,
      bowlSound: undefined
    }
  },
  computed: {
    errorBannerClass: function () {
      let cls = 'absolute-top z-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
    },
    buttonTitle: function () {
      if (this.sessionOn) {
        return this.timeRemaining
      } else {
        return this.$t('rbText')
      }
    },
    sessionDurationMin: function () {
      return this.seconds / 60
    },
    timeRemaining: function () {
      const min = String(Math.floor(this.seconds / 60))
      const sec = String(this.seconds % 60)
      return min.padStart(2, '0') + ':' + sec.padStart(2, '0')
    }
  },
  methods: {
    onResume () {
      this.$store.dispatch('app/syncWithFriends')
    },
    showError (error) {
      this.errMsg = error
      this.error = true
      setTimeout(() => {
        this.error = false
      }, 3000)
    },
    adjustSession (min) {
      this.seconds += Number(min) * 60
      if (this.seconds < 5 * 60) {
        this.seconds = 5 * 60
      } else if (this.seconds > 30 * 60) {
        this.seconds = 30 * 60
      }
    },
    startSession () {
      if (this.$store.state.app.wakeLock) {
        window.plugins.insomnia.keepAwake()
      }
      this.signals = randomSignals(this.seconds)
      this.sessionOn = true
      this.dingSound.play()
      cordova.plugins.backgroundMode.on('activate', function () {
        cordova.plugins.backgroundMode.disableWebViewOptimizations()
      })
      cordova.plugins.backgroundMode.enable()
      this.runTimer()
    },
    runTimer () {
      this.timer = setInterval(() => {
        this.seconds -= 1
        this.checkTime()
      }, 1000)
    },
    stopTimer () {
      clearInterval(this.timer)
      if (this.$store.state.app.wakeLock) {
        window.plugins.insomnia.allowSleepAgain()
      }
      cordova.plugins.backgroundMode.disable()
      this.seconds = this.sessionDuration
      this.sessionOn = false
    },
    checkTime () {
      if (!this.seconds) {
        this.stopTimer()
        this.bowlSound.play()
        this.ratingDialog = true
      } else {
        /* XXX: this should work but it's not :( Investigate it
        if (cordova.plugins.backgroundMode.isActive()) {
          // handle background process notification
          cordova.plugins.backgroundMode.configure({
            title: this.timeRemaining,
            text: this.timeRemaining
          })
        }
        */
        // play sound at defined timestamps
        const ts = this.signals[this.signals.length - 1] - this.seconds
        if (this.signals.includes(ts)) {
          this.dingSound.play()
        }
      }
    },
    async reportScore (score) {
      try {
        await this.$store.dispatch('app/reportSession', score)
      } catch (e) {
        this.showError(e.message)
        return
      }
      this.ratingDialog = false
    }
  }
}
</script>
