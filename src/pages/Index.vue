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
    <q-btn
      @click="startSession"
      :label="timeRemaining"
      :disable="sessionOn"
      round
      push
      size="4em"
      color="red"
    />
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
