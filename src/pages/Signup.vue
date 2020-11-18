<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
  <div class="column items-center">
    <simple-banner :show="banner" :severity="bannerSeverity" :message="bannerMessage" @close="hideBanner()" />
    <div class="text-h5 q-my-sm text-uppercase">
      {{ $t('signupTitle') }}
    </div>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      v-model="username"
      color="grey-8"
      :label="$t('signupUsername')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      type="email"
      v-model="email"
      color="grey-8"
      :label="$t('signupEmail')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="500"
      v-model="password"
      color="grey-8"
      :type="isPwd ? 'password' : 'text'"
      :label="$t('signupPassword')"
      :disable="wait"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="500"
      v-model="password2"
      color="grey-8"
      :type="isPwd2 ? 'password' : 'text'"
      :label="$t('signupPassword2')"
      :disable="wait"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd2 ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd2 = !isPwd2"
        />
      </template>
    </q-input>
    <q-item>
      <q-item-section avatar top>
        <q-checkbox
          v-model="userGeneralAgreement"
          color="grey-8"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ $t('signupGeneralAgreementLabel') }}
        </q-item-label>
        <q-item-label caption>
          {{ $t('signupGeneralAgreementText') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section avatar top>
        <q-checkbox
          v-model="publicProfile"
          color="grey-8"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ $t('signupPublicProfileLabel') }}
        </q-item-label>
        <q-item-label caption>
          {{ $t('signupPublicProfileText') }}
        </q-item-label>
        <q-item-label caption class="text-italic">
          {{ $t('signupPublicProfileHint') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-btn
      class="q-ma-md entrance-button"
      :label="$t('signupButton')"
      size="xl"
      color="grey-8"
      @click="submit"
      :disable="!userGeneralAgreement || wait"
    />
  </div>
</q-page>
</template>

<script>
import { signup } from '../js/remotedb'
import SimpleBanner from 'components/SimpleBanner'
export default {
  // name: 'PageName',
  components: {
    SimpleBanner
  },
  created () {
    this.$i18n.locale = this.$q.lang.getLocale()
  },
  data () {
    return {
      username: '',
      password: '',
      password2: '',
      email: '',
      isPwd: true,
      isPwd2: true,
      userGeneralAgreement: true,
      publicProfile: false,
      banner: false,
      bannerMessage: '',
      bannerSeverity: 0,
      wait: false
    }
  },
  computed: {
    progressClass () {
      const cls = 'fixed-top'
      return this.wait ? cls : cls.concat(' invisible')
    }
  },
  methods: {
    showBanner (message, severity) {
      this.bannerMessage = message
      this.bannerSeverity = severity
      this.banner = true
    },
    hideBanner () {
      this.banner = false
    },
    async submit () {
      const username = this.username.trim()
      const email = this.email.trim()
      if (!(username && this.password && this.password2 && email)) {
        console.log('SHOW ERROR')
        this.showBanner(this.$t('signupError0'), 3)
      } else if (username.length < 2) {
        this.showBanner(this.$t('signupError1'), 3)
      } else if (!/^[\w\d\-_]+$/.test(username)) {
        this.showBanner(this.$t('signupError2'), 3)
      } else if (!/^.+@[^.]+\..+$/.test(email)) {
        this.showBanner(this.$t('signupError3'), 3)
      } else if (this.password !== this.password2) {
        this.showBanner(this.$t('signupError4'), 3)
      } else if (this.password.length < 6) {
        this.showBanner(this.$t('signupError5'), 3)
      } else {
        try {
          this.wait = true
          await signup(
            username,
            this.password,
            email,
            this.publicProfile,
            this.$q.lang.getLocale()
          )
        } catch (e) {
          this.wait = false
          this.showBanner(e.message, 3)
          return
        }
        this.wait = false
        this.$store.dispatch('app/setUsername', username)
        this.$store.dispatch('app/setPublicProfile', this.publicProfile)
        this.$router.replace('/app?newuser=1')
      }
    }
  }
}
</script>
