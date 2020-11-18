<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
  <div class="column items-center">
    <simple-banner :show="banner" :severity="bannerSeverity" :message="bannerMessage" @close="hideBanner()" />
    <div class="text-h5 q-my-sm text-uppercase">
      {{ $t('loginTitle') }}
    </div>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      v-model="username"
      color="grey-8"
      :label="$t('loginUsername')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="500"
      v-model="password"
      color="grey-8"
      :type="isPwd ? 'password' : 'text'"
      :label="$t('loginPassword')"
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
    <q-btn
      class="q-ma-md entrance-button"
      :label="$t('loginButton')"
      size="xl"
      color="grey-8"
      @click="submit"
      :disable="wait"
    />
  </div>
  <router-link to="/recover"
    class="absolute-bottom text-center q-mb-lg"
    :disabled="wait"
    :event="wait ? '' : 'click'"
  >
    {{ $t('loginRecovery') }}
  </router-link>
</q-page>
</template>

<script>
import { authenticate } from '../js/remotedb'
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
      isPwd: true,
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
      if (!(username && this.password)) {
        this.showBanner(this.$t('signupError0'), 3)
      } else {
        try {
          this.wait = true
          await authenticate(username, this.password)
          this.$store.dispatch('app/fetchStats')
        } catch (e) {
          this.wait = false
          this.showBanner(e.message, 3)
          return
        }
        this.wait = false
        this.$store.dispatch('app/setUsername', username)
        this.$router.replace('/app')
      }
    }
  }
}
</script>
