<template>
  <q-page class="flex flex-center">
    <q-dialog v-model="ratingDialog" persistent transition-hide="scale">
      <q-card>
        <q-card-section align="center">
          <div class="text-h6">Rate your session</div>
        </q-card-section>
        <q-card-section>
          <q-rating
            v-model="sessionScore"
            size="3.5em"
            color="yellow-14"
            icon="star"
          />
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat label="Reset" color="primary" @click="sessionScore=0" />
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <apexchart class="no-wrap" style="margin: -50px" type="line" width="120%" height="250" :options="chart1Options" :series="series1" />
    </div>
    <div class="row">
      <apexchart class="no-wrap" style="margin: -50px" type="line" width="120%" height="100" :options="chart2Options" :series="series2" />
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
import { randomSignals } from '../js/rsg'
const sessionDuration = 15 * 60
const rsgSignalCount = 5
const rsgMinT = 60
const rsgMaxT = 7 * 60
export default {
  name: 'PageIndex',
  data () {
    return {
      seconds: sessionDuration,
      sessionOn: false,
      signals: [],
      ratingDialog: false,
      sessionScore: 0,
      chart1Options: { grid: { show: false }, xaxis: { floating: true, type: 'datetime', /* min: Date.parse('2020-03-29'), */ labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } }, yaxis: { floating: true, labels: { show: false } }, legend: { floating: true, position: 'left', offsetY: 10, fontSize: '16px' }, tooltip: { enabled: false }, chart: { toolbar: { show: false } } },
      chart2Options: { grid: { row: { colors: ['#f899f8', '#f8bbf8', '#f8ddf8', '#ffffff'] } }, xaxis: { floating: true, labels: { show: false }, axisBorder: { show: false } }, yaxis: { floating: true, labels: { show: false } }, tooltip: { enabled: false }, chart: { toolbar: { show: false } } },
      series1: [
        {
          name: 'me',
          data: [{ x: '2020-03-29', y: 1 }, { x: '2020-03-30', y: 3 }, { x: '2020-03-31', y: 4 }, { x: '2020-04-01', y: 5 }, { x: '2020-04-02', y: 10 }, { x: '2020-04-06', y: 15 }, { x: '2020-04-08', y: 24 }, { x: '2020-04-09', y: 33 }]
        },
        {
          name: 'Alex',
          data: [{ x: '2020-03-23', y: 10 }, { x: '2020-03-28', y: 13 }, { x: '2020-03-31', y: 24 }, { x: '2020-04-01', y: 28 }, { x: '2020-04-02', y: 30 }, { x: '2020-04-06', y: 35 }]
        }
      ],
      series2: [{
        data: [1, 3, 2.3, 4, 0, 0.5, 0.4, 1.13, 1, 2.3, 1.4, 4, 0, 1.5, 0.4, 1.3, 3.1, 3, 2.1, 1.4, 3, 2.5, 0.4, 2.1, 1, 3, 2.3, 4, 1, 1.5]
      }],
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
        cordova.plugins.backgroundMode.on('enable', () => {
          this.runTimer()
        })
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
    }
  }
}
</script>
