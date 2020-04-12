<template>
  <q-page class="flex flex-center">
    <rating-dialog :show="ratingDialog" @rated="reportScore" />
    <div class="row">
      <totals-chart :data="totalsChartData" />
    </div>
    <div class="row">
      <avgs30-chart :data="avgs30ChartData" />
    </div>
    <div class="row">
      <q-btn
        class="no-wrap"
        @click="startSession"
        :label="timeRemaining"
        :disable="sessionOn"
        round
        push
        size="4em"
        color="red"
      />
    </div>
  </q-page>
</template>

<script>
import RatingDialog from 'components/RatingDialog'
import TotalsChart from 'components/TotalsChart'
import Avgs30Chart from 'components/Avgs30Chart'
import { randomSignals } from '../js/rsg'
import { getTotals, getAvgs30, reportSession } from '../js/database'
const sessionDuration = 15 * 60
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
    this.totalsChartData = getTotals()
    this.avgs30ChartData = getAvgs30()
  },
  data () {
    return {
      seconds: sessionDuration,
      sessionOn: false,
      signals: [],
      ratingDialog: false,
      totalsChartData: [],
      avgs30ChartData: [],
      dingSound: new Audio('statics/sounds/Ding.mp3'),
      bowlSound: new Audio('statics/sounds/Bowl.mp3')
    }
  },
  computed: {
    timeRemaining: function () {
      const min = String(Math.floor(this.seconds / 60))
      const sec = String(this.seconds % 60)
      return min.padStart(2, '0') + ':' + sec.padStart(2, '0')
    }
  },
  methods: {
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
      const newStats = await reportSession('uvizhe', score)
      this.totalsChartData = newStats[0]
      this.avgs30ChartData = newStats[1]
      this.ratingDialog = false
    }
  }
}
</script>
