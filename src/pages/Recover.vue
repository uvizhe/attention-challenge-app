<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" />
  <div class="column items-center">
    <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
    <div class="q-my-sm text-center">{{ $t('recoverInfo') }}</div>
    <q-input
      outlined
      class="q-my-sm login-input"
      maxlength="50"
      type="email"
      v-model="email"
      :label="$t('signupEmail')"
      :disable="wait"
    />
    <q-btn
      class="q-ma-md entrance-button"
      :label="$t('recoverButton')"
      color="purple-5"
      size="xl"
      @click="submit"
      :disable="wait"
    />
  </div>
</q-page>
</template>
<script>
import { recover } from '../js/remotedb'
export default {
  // name: 'PageName',
  data () {
    return {
      email: '',
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
      if (!/^.+@[^.]+\..+$/.test(this.email)) {
        this.showError(this.$t('signupError3'))
      } else {
        let status
        try {
          this.wait = true
          status = await recover(this.email, this.$q.lang.getLocale())
        } catch (e) {
          this.wait = false
          this.showError(e.message)
          return
        }
        this.wait = false
        this.$router.replace('/recover-info/' + status)
      }
    }
  }
}
</script>
