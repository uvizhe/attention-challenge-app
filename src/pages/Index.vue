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
  mounted () {
    if (this.$q.platform.is.android) {
      // eslint-disable-next-line no-undef
      this.silentSound = new Media(
        '/android_asset/www/statics/sounds/Silence.mp3')
      // eslint-disable-next-line no-undef
      this.dingSound = new Media(
        '/android_asset/www/statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media(
        '/android_asset/www/statics/sounds/Bowl.mp3')
    } else if (this.$q.platform.is.ios) {
      // eslint-disable-next-line no-undef
      this.silentSound = new Media('statics/sounds/Silence.mp3')
      // eslint-disable-next-line no-undef
      this.dingSound = new Media('statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media('statics/sounds/Bowl.mp3')
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
      silentSound: undefined,
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
      if (this.$store.state.app.wakeLock) {
        window.plugins.insomnia.keepAwake()
      } else {
        // IDK why background service stops so this 15min silent track
        // is an attempt to fix the issue
        this.silentSound.play()
      }
      this.signals = randomSignals(this.seconds, rsgSignalCount, rsgMinT, rsgMaxT)
      this.sessionOn = true
      this.dingSound.play()
      cordova.plugins.backgroundMode.on('enable', this.runTimer)
      cordova.plugins.backgroundMode.enable()
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
        if (this.$store.state.app.wakeLock) {
          window.plugins.insomnia.allowSleepAgain()
        }
        cordova.plugins.backgroundMode.un('enable', this.runTimer)
        cordova.plugins.backgroundMode.disable()
        this.silentSound.stop()
        this.silentSound.release()
        this.bowlSound.play()
        this.seconds = sessionDuration
        this.sessionOn = false
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
