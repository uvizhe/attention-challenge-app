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
      <div class="col-grow relative-position">
        <q-btn
          class="absolute-center shadow-up-5"
          @click="startSession"
          :label="buttonTitle"
          :disable="sessionOn"
          round
          size="4em"
          color="red"
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
const sessionDuration = process.env.SESSION_DURATION
const rsgSignalCount = 5
const rsgMinT = 60
const rsgMaxT = 7 * 60
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
      document.addEventListener('resume', this.onResume, false)
    }
  },
  data () {
    return {
      seconds: sessionDuration,
      sessionOn: false,
      signals: [],
      error: false,
      errMsg: '',
      ratingDialog: false,
      dingSound: new Audio('statics/sounds/Ding.mp3'),
      bowlSound: new Audio('statics/sounds/Bowl.mp3')
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
        return 'Go'
      }
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
    startSession () {
      this.signals = randomSignals(this.seconds, rsgSignalCount, rsgMinT, rsgMaxT)
      this.sessionOn = true
      this.dingSound.play()
      if (this.$q.platform.is.mobile) {
        cordova.plugins.backgroundMode.on('enable', this.runTimer)
        cordova.plugins.backgroundMode.enable()
        if (this.$store.state.app.wakeLock) {
          window.plugins.insomnia.keepAwake()
        }
      } else {
        this.runTimer()
      }
    },
    runTimer () {
      const timer = setInterval(() => {
        this.seconds -= 1
        this.checkTime(timer)
      }, 1000)
    },
    checkTime (timer) {
      if (!this.seconds) {
        clearInterval(timer)
        if (this.$q.platform.is.mobile) {
          if (this.$store.state.app.wakeLock) {
            window.plugins.insomnia.allowSleepAgain()
          }
          cordova.plugins.backgroundMode.un('enable', this.runTimer)
          cordova.plugins.backgroundMode.disable()
        }
        this.bowlSound.play()
        this.seconds = sessionDuration
        this.sessionOn = false
        this.ratingDialog = true
      } else {
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
