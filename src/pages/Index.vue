<template>
  <q-page class="flex flex-center">
    <q-btn
      @click="startSession"
      round
      :label="timeRemaining"
      size="300%"
      color="teal"
    ></q-btn>
  </q-page>
</template>

<script>
const sessionDuration = 5 * 60
export default {
  name: 'PageIndex',
  data () {
    return {
      seconds: sessionDuration
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
        this.seconds = sessionDuration
      }
    }
  }
}
</script>
