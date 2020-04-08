<template>
  <q-page class="flex flex-center">
    <q-btn
      @click="startSession"
      :label="timeRemaining"
      :disable="sessionOn"
      round
      size="300%"
      color="teal"
    ></q-btn>
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
