<template>
  <q-layout>
    <q-page padding class="flex flex-center content-center">
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
        />
        <q-btn
          class="q-ma-md entrance-button"
          :label="$t('recoverButton')"
          color="purple-5"
          size="xl"
          @click="submit"
        />
      </div>
    </q-page>
  </q-layout>
</template>
<script>
import { recover } from '../js/remotedb'
export default {
  // name: 'PageName',
  data () {
    return {
      email: '',
      error: false,
      errMsg: ''
    }
  },
  computed: {
    errorBannerClass: function () {
      let cls = 'fixed-top bg-red text-white text-center'
      if (!this.error) {
        cls += ' hidden'
      }
      return cls
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
        try {
          await recover(this.email, this.$q.lang.getLocale())
        } catch (e) {
          this.showError(e.message)
          return
        }
        this.$router.replace('/recover-info')
      }
    }
  }
}
</script>
