<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" />
  <div class="column items-center">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <div class="text-h5 q-my-sm text-uppercase">
      {{ $t('signupTitle') }}
    </div>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      v-model="username"
      :label="$t('signupUsername')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      type="email"
      v-model="email"
      :label="$t('signupEmail')"
      :disable="wait"
    />
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="500"
      v-model="password"
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
    <q-btn
      class="q-ma-md entrance-button"
      :label="$t('signupButton')"
      color="purple-5"
      size="xl"
      @click="submit"
      :disable="wait"
    />
  </div>
</q-page>
</template>

<script>
import { signup } from '../js/remotedb'
export default {
  // name: 'PageName',
  created () {
    this.$i18n.locale = this.$q.lang.getLocale()
  },
  data () {
    return {
      username: '',
      password: '',
      email: '',
      isPwd: true,
      error: false,
      errMsg: '',
      wait: false
    }
  },
  computed: {
    errorBannerClass: function () {
      let cls = 'fixed-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
    },
    progressClass: function () {
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
      if (!(this.username && this.password && this.email)) {
        this.showError(this.$t('signupError0'))
      } else if (this.username.length < 2) {
        this.showError(this.$t('signupError1'))
      } else if (!/^[\w\d\-_]+$/.test(this.username)) {
        this.showError(this.$t('signupError2'))
      } else if (!/^.+@[^.]+\..+$/.test(this.email)) {
        this.showError(this.$t('signupError3'))
      } else {
        try {
          this.wait = true
          await signup(this.username, this.password, this.email)
        } catch (e) {
          this.wait = false
          this.showError(e.message)
          return
        }
        this.wait = false
        this.$store.dispatch('app/setUsername', this.username)
        this.$router.replace('/app')
      }
    }
  }
}
</script>
