<template>
  <q-page padding class="flex">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <greeting-dialog :show="greetingDialog" @close="closeGreetingDialog" />
    <rating-dialog :show="ratingDialog" :wait="ratingDialogWait" @rated="reportScore" />
    <div class="column justify-end full-width fixed-bottom q-px-xs">
      <div class="col-auto">
        <event-log />
      </div>
      <div class="col-auto relative-position q-mt-md">
        <avgs-chart />
      </div>
      <div class="col-auto big-red-btn-div row relative-position justify-between items-center">
        <q-btn
          icon="remove"
          round
          color="purple-5"
          :class="adjustButtonsClass"
          @click="adjustSession(-1)"
          :disable="lowerSessionLimit"
        />
        <q-btn
          class="absolute-center shadow-up-5"
          @click="startSession"
          :disable="sessionOn"
          round
          size="60px"
          color="red"
        >
          <div class="big-red-btn-title relative-position">

            <div v-if="!sessionOn">
              <q-icon name="play_arrow" />
              <div
                class="big-red-btn-subtitle absolute-bottom text-red-2 text-lowercase">
                {{ sessionDurationMin }}&nbsp;{{ $t('rbMin') }}
              </div>
            </div>
            <div v-else>
              {{ buttonTitle }}
            </div>
          </div>
          <q-tooltip
            v-model="deferralWarning"
            :no-parent-event="true"
            max-width="70%"
            content-class="text-justify"
          >
            {{ $t('indexBellsDeferralWarning') }}
          </q-tooltip>
        </q-btn>
        <q-btn
          icon="add"
          round
          color="purple-5"
          :class="adjustButtonsClass"
          @click="adjustSession(1)"
          :disable="upperSessionLimit"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import GreetingDialog from 'components/GreetingDialog'
import RatingDialog from 'components/RatingDialog'
import EventLog from 'components/EventLog'
import AvgsChart from 'components/AvgsChart'
import { randomSignals } from '../js/rsg'
import { MIN_SESSION, MAX_SESSION } from '../js/constants'
export default {
  name: 'PageIndex',
  components: {
    GreetingDialog,
    RatingDialog,
    EventLog,
    AvgsChart
  },
  created () {
    if (!this.$store.state.app.initialized) {
      this.$store.dispatch('app/initData')
      this.$i18n.locale = this.$store.state.app.locale
      document.addEventListener('resume', this.onResume, false)
    }
    this.sessionDuration = process.env.SESSION_DURATION ||
      this.$store.state.app.sessionDuration
    this.bellsDeferral = this.$store.state.app.bellsDeferral
  },
  mounted () {
    if (this.$q.platform.is.android) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media(
        '/android_asset/www/statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media(
        '/android_asset/www/statics/sounds/Bowl.mp3')
    } else if (this.$q.platform.is.ios) {
      // eslint-disable-next-line no-undef
      this.dingSound = new Media('statics/sounds/Ding.mp3')
      // eslint-disable-next-line no-undef
      this.bowlSound = new Media('statics/sounds/Bowl.mp3')
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
      next()
    }
  },
  data () {
    return {
      sessionDuration: 0,
      bellsDeferral: 0,
      seconds: 0,
      sessionOn: false,
      timer: null,
      signals: [],
      deferralWarning: false,
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
    adjustButtonsClass () {
      let cls = 'q-mx-md'
      if (this.sessionOn) {
        cls += ' invisible'
      }
      return cls
    },
    buttonTitle () {
      if (this.sessionOn) {
        return this.timeRemaining
      } else {
        return this.$t('rbText')
      }
    },
    sessionDurationMin () {
      return this.sessionDuration / 60
    },
    lowerSessionLimit () {
      return this.sessionDuration / 60 === MIN_SESSION
    },
    upperSessionLimit () {
      return this.sessionDuration / 60 === MAX_SESSION
    },
    timeRemaining () {
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
    closeGreetingDialog () {
      this.greetingDialog = false
    },
    adjustSession (min) {
      this.sessionDuration += Number(min) * 60
      if (this.sessionDuration < MIN_SESSION * 60) {
        this.sessionDuration = MIN_SESSION * 60
      } else if (this.sessionDuration > MAX_SESSION * 60) {
        this.sessionDuration = MAX_SESSION * 60
      }
      if (this.sessionDuration - this.bellsDeferral < MIN_SESSION * 60) {
        this.bellsDeferral = this.sessionDuration - MIN_SESSION * 60
        if (this.bellsDeferral < 0) {
          this.bellsDeferral = 0
        } else {
          this.deferralWarning = true
          setTimeout(() => {
            this.deferralWarning = false
          }, 3500)
        }
      }
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
    }
  }
}
</script>
