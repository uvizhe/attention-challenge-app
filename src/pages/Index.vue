<template>
  <q-page padding class="flex">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <greeting-dialog :show="greetingDialog" @close="closeGreetingDialog" />
    <rating-dialog :show="ratingDialog" :wait="ratingDialogWait" @rated="reportScore" />
    <div class="column justify-end full-width fixed-bottom q-px-xs">
      <div class="col-auto">
        <event-log />
      </div>
      <div class="col-auto relative-position q-mt-md q-pb-md">
        <avgs-chart />
      </div>
      <div class="col-auto">
        <session-params @change="changeSessionParams"/>
      </div>
      <div class="col-auto big-red-btn-div row relative-position justify-between items-center">
        <big-button
          :disabled="sessionOn"
          :duration="sessionDurationMin"
          :remaining="timeRemaining"
          @click="startSession"
        />
        <q-page-sticky position="bottom-left">
          <q-btn v-if="sessionOn"
            round
            icon="pause"
            class="q-ma-md text-white bg-myprimary"
            @click="pauseTimer(!sessionPause)"
          />
          <q-btn v-else
            round
            icon="settings"
            class="q-ma-md text-white bg-myprimary"
            @click="$router.push('/app/settings')"
          />
        </q-page-sticky>
        <q-page-sticky position="bottom-right">
          <q-btn v-if="sessionOn"
            round
            icon="stop"
            class="q-ma-md text-white bg-myprimary"
            @click="stopTimer"
          />
          <q-btn v-else
            round
            icon="mdi-help"
            class="q-ma-md text-white bg-myprimary"
            @click="$router.push('/app/about')"
          />
        </q-page-sticky>
      </div>
    </div>
  </q-page>
</template>

<script>
import GreetingDialog from 'components/GreetingDialog'
import RatingDialog from 'components/RatingDialog'
import EventLog from 'components/EventLog'
import AvgsChart from 'components/AvgsChart'
import SessionParams from 'components/SessionParams'
import BigButton from 'components/BigButton'
import { randomSignals } from '../js/rsg'
export default {
  name: 'PageIndex',
  components: {
    GreetingDialog,
    RatingDialog,
    EventLog,
    AvgsChart,
    SessionParams,
    BigButton
  },
  created () {
    if (!this.$store.state.app.initialized) {
      this.$store.dispatch('app/initData')
      this.$i18n.locale = this.$store.state.app.locale
      document.addEventListener('resume', this.onResume, false)
    } else {
      this.$store.dispatch('app/routineTasks')
    }
    this.sessionDuration = process.env.SESSION_DURATION ||
      this.$store.state.app.sessionDuration
    this.bellsDeferral = this.$store.state.app.bellsDeferral
  },
  mounted () {
    if (this.$q.platform.is.android) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media(
        '/android_asset/www/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media(
        '/android_asset/www/sounds/Bowl.mp3')
    } else if (this.$q.platform.is.ios) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media('sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media('sounds/Bowl.mp3')
    }
    if (this.$router.currentRoute.query.newuser) {
      this.greetingDialog = true
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!to.path.startsWith('/app')) {
      next(false)
    } else {
      if (this.sessionOn) {
        this.stopTimer()
      }
      this.$store.dispatch('app/setSessionDuration', this.sessionDuration)
      this.$store.dispatch('app/setBellsDeferral', this.bellsDeferral)
      next()
    }
  },
  data () {
    return {
      sessionDuration: 0,
      bellsDeferral: 0,
      seconds: 0,
      sessionOn: false,
      sessionPause: false,
      timer: null,
      signals: [],
      error: false,
      errMsg: '',
      greetingDialog: false,
      ratingDialog: false,
      ratingDialogWait: false,
      ringerMode: undefined,
      dingSound: undefined,
      bowlSound: undefined
    }
  },
  computed: {
    errorBannerClass () {
      let cls = 'absolute-top z-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
    },
    sessionDurationMin () {
      return this.sessionDuration / 60
    },
    timeRemaining () {
      const min = String(Math.floor(this.seconds / 60))
      const sec = String(this.seconds % 60)
      return min.padStart(2, '0') + ':' + sec.padStart(2, '0')
    }
  },
  methods: {
    onResume () {
      if (this.$route.path === '/app') {
        this.$store.dispatch('app/routineTasks')
      }
    },
    showError (error) {
      this.errMsg = error
      this.error = true
      setTimeout(() => {
        this.error = false
      }, 3000)
    },
    closeGreetingDialog () {
      this.greetingDialog = false
    },
    changeSessionParams (values) {
      const duration = values[1]
      const deferral = values[0]
      this.sessionDuration = duration * 60
      this.bellsDeferral = deferral * 60
    },
    startSession () {
      this.seconds = this.sessionDuration
      if (this.$store.state.app.wakeLock) {
        window.plugins.insomnia.keepAwake()
      }
      this.signals = randomSignals(this.sessionDuration - this.bellsDeferral, this.bellsDeferral)
      this.sessionOn = true
      this.dingSound.play()
      cordova.plugins.backgroundMode.on('activate', function () {
        cordova.plugins.backgroundMode.disableWebViewOptimizations()
      })
      cordova.plugins.backgroundMode.enable()
      if (this.$store.state.app.dndMode) {
        window.AudioManagement.getAudioMode((result) => {
          this.ringerMode = result.audioMode
          window.AudioManagement.setAudioMode(0, null, null)
        }, null)
      }
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
      if (this.$store.state.app.dndMode) {
        window.AudioManagement.setAudioMode(this.ringerMode, null, null)
      }
      this.sessionOn = false
      this.sessionPause = false
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
    pauseTimer (on) {
      if (on) {
        this.sessionPause = true
        clearInterval(this.timer)
      } else {
        this.sessionPause = false
        this.runTimer()
      }
    },
    async reportScore (score) {
      try {
        this.ratingDialogWait = true
        await this.$store.dispatch('app/reportSession', {
          score: score,
          duration: this.sessionDurationMin
        })
      } catch (e) {
        this.ratingDialogWait = false
        this.showError(e.message)
        return
      }
      this.ratingDialogWait = false
      this.ratingDialog = false
      this.$store.dispatch('app/routineTasks')
      this.$store.dispatch('app/setSessionDuration', this.sessionDuration)
      this.$store.dispatch('app/setBellsDeferral', this.bellsDeferral)
    }
  }
}
</script>
