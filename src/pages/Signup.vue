<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
  <div class="column items-center">
    <simple-banner :show="banner" :message="bannerMessage" @close="hideBanner()" />
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
    <q-input v-if="password.length >= MIN_PASS_LENGTH"
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
    <q-item class="wide300">
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
    <q-item class="wide300">
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
      class="q-mt-md q-mb-sm wide250"
      :label="$t('signupButton')"
      size="lg"
      color="grey-8"
      @click="submit"
      :disable="!userGeneralAgreement || wait"
    />
    <div v-if="!$store.state.app.tryout"
      class="text-center"
    >
      {{ $t('signupOptionLabel') }}
    </div>
    <q-btn v-if="!$store.state.app.tryout"
      class="q-mt-sm q-mb-md wide250"
      :label="$t('signupTryoutButton')"
      size="lg"
      color="grey-8"
      to="/tryout"
    />
    <div v-if="$store.state.app.tryout"
      class="q-my-lg"
    >
      <a href="javascript:void(0)" @click="$router.back()">{{ $t('recoverInfo2Back') }}</a>
    </div>
  </div>
</q-page>
</template>

<script>
import { signup, translateServerError } from '../js/remotedb'
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
      MIN_PASS_LENGTH: 6,
      username: '',
      password: '',
      password2: '',
      email: '',
      isPwd: true,
      isPwd2: true,
      userGeneralAgreement: false,
      publicProfile: false,
      banner: false,
      bannerMessage: '',
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
    showBanner (message) {
      this.bannerMessage = message
      this.banner = true
    },
    hideBanner () {
      this.banner = false
    },
    async submit () {
      const username = this.username.trim()
      const email = this.email.trim()
      if (!(username && this.password && this.password2 && email)) {
        this.showBanner(this.$t('signupError0'))
      } else if (username.length < 2) {
        this.showBanner(this.$t('signupError1'))
      } else if (!/^[\w\d\-_]+$/.test(username)) {
        this.showBanner(this.$t('signupError2'))
      } else if (!/^.+@[^.]+\..+$/.test(email)) {
        this.showBanner(this.$t('signupError3'))
      } else if (this.password !== this.password2) {
        this.showBanner(this.$t('signupError4'))
      } else if (this.password.length < this.MIN_PASS_LENGTH) {
        this.showBanner(this.$t('signupError5'))
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
          this.showBanner(this.$t(translateServerError(e.message)))
          return
        }
        this.wait = false
        this.$store.dispatch('app/setUsername', username)
        this.$store.dispatch('app/setPublicProfile', this.publicProfile)
        if (this.$store.state.app.tryout) {
          this.$store.dispatch('app/setTryout', false)
        } else {
          this.$store.commit('app/setNewUser')
        }
        this.$router.replace('/app')
      }
    }
  }
}
</script>
