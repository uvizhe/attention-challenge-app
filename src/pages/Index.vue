<template>
  <q-page padding class="flex">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <rating-dialog :show="ratingDialog" @rated="reportScore" />
    <div class="column justify-between full-width">
      <div class="col-5 relative-position">
        <totals-chart />
      </div>
      <div class="col-shrink relative-position">
        <avgs30-chart :data="avgs30ChartData" />
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
import { getTotals, getAvgs30, getFriends, reportSession }
  from '../js/database'
const sessionDuration = process.env.SESSION_DURATION
const rsgSignalCount = 5
const rsgMinT = 60
const rsgMaxT = 7 * 60
let permissions
export default {
  name: 'PageIndex',
  components: {
    RatingDialog,
    TotalsChart,
    Avgs30Chart
  },
  created () {
    if (this.$q.platform.is.mobile) {
      permissions = cordova.plugins.permissions
    }
    this.$store.dispatch('app/addUsersToTotalsChart', getFriends())
    this.$store.commit('app/setTotalsChartUserData', getTotals())
    this.avgs30ChartData = getAvgs30()
  },
  mounted () {
    if (this.$q.platform.is.mobile) {
      permissions.checkPermission(permissions.FOREGROUND_SERVICE, function (status) {
        if (!status.hasPermission) {
          permissions.requestPermission(permissions.FOREGROUND_SERVICE, null, null)
        }
      })
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
      avgs30ChartData: [],
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
      let newStats
      try {
        newStats = await reportSession('uvizhe', score)
      } catch (e) {
        this.showError(e.message)
        return
      }
      this.$store.commit('app/setTotalsChartUserData', newStats[0])
      this.avgs30ChartData = newStats[1]
      this.ratingDialog = false
    }
  }
}
</script>
