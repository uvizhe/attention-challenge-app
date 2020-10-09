<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" />
  <div class="column items-center">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <div class="text-h5 q-my-sm text-uppercase">
      {{ $t('loginTitle') }}
    </div>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      v-model="username"
      :label="$t('loginUsername')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="500"
      v-model="password"
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
      color="purple-5"
      size="xl"
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
export default {
  // name: 'PageName',
  created () {
    this.$i18n.locale = this.$q.lang.getLocale()
  },
  data () {
    return {
      username: '',
      password: '',
      isPwd: true,
      error: false,
      errMsg: '',
      wait: false
    }
  },
  computed: {
    errorBannerClass () {
      let cls = 'fixed-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
    },
    progressClass () {
      const cls = 'fixed-top'
      return this.wait ? cls : cls.concat(' invisible')
    }
  },
  methods: {
    showError (error) {
      this.errMsg = error
      this.error = true
      setTimeout(() => {
        this.error = false
      }, 3000)
    },
    async submit () {
      const username = this.username.trim()
      if (!(username && this.password)) {
        this.showError(this.$t('signupError0'))
      } else {
        try {
          this.wait = true
          await authenticate(username, this.password)
          this.$store.dispatch('app/fetchStats')
        } catch (e) {
          this.wait = false
          this.showError(e.message)
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
