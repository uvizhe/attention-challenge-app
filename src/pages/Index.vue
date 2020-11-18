<template>
  <q-page padding class="flex">
    <greeting-dialog :show="greetingDialog" @close="closeGreetingDialog" />
    <rating-dialog :show="ratingDialog" :wait="ratingDialogWait" @rated="reportScore" />
    <q-page-sticky position="top-left" class="hover">
      <q-icon v-if="$store.state.app.offline"
        name="error"
        color="deep-orange-5"
        class="text-h5 q-ma-sm"
      >
        <q-tooltip :hide-delay="1000">
          {{ $t('offlineMode') }}
        </q-tooltip>
      </q-icon>
    </q-page-sticky>
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
            color="grey-8"
            class="q-ma-md"
            @click="pauseTimer(!sessionPause)"
          />
          <q-btn v-else
            round
            icon="settings"
            color="grey-8"
            class="q-ma-md"
            @click="$router.push('/app/settings')"
          />
        </q-page-sticky>
        <q-page-sticky position="bottom-right">
          <q-btn v-if="sessionOn"
            round
            icon="stop"
            color="grey-8"
            class="q-ma-md"
            @click="stopTimer"
          />
          <q-btn v-else
            round
            icon="mdi-help"
            color="grey-8"
            class="q-ma-md"
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
    // eslint-disable-next-line no-undef
    this.dingSound = new Media('/android_asset/www/sounds/Ding.ogg')
    // eslint-disable-next-line no-undef
    this.bowlSound = new Media('/android_asset/www/sounds/Bowl.ogg')
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
      greetingDialog: false,
      ratingDialog: false,
      ratingDialogWait: false,
      ringerMode: undefined,
      dingSound: undefined,
      bowlSound: undefined
    }
  },
  computed: {
    sessionDurationMin () {
      return this.sessionDuration / 60
    },
    soundVolume () {
      const volume = this.$store.state.app.soundVolume
      switch (volume) {
        case 1:
          return '0.1'
        case 2:
          return '0.3'
        case 3:
          return '0.5'
        case 4:
          return '0.7'
        case 5:
          return '1.0'
        default:
          return '0.5'
      }
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
      this.dingSound.setVolume(this.soundVolume)
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
        this.bowlSound.setVolume(this.soundVolume)
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
          this.dingSound.setVolume(this.soundVolume)
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
      this.ratingDialogWait = true
      await this.$store.dispatch('app/reportSession', {
        score: score,
        duration: this.sessionDurationMin
      })
      this.ratingDialogWait = false
      this.ratingDialog = false
      this.$store.dispatch('app/routineTasks')
      this.$store.dispatch('app/setSessionDuration', this.sessionDuration)
      this.$store.dispatch('app/setBellsDeferral', this.bellsDeferral)
    }
  }
}
</script>
