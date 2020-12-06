<template>
<q-page padding class="flex flex-center content-center">
  <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
  <div class="column items-center">
    <simple-banner :show="banner" :message="bannerMessage" @close="hideBanner()" />
    <div class="q-my-sm text-center">{{ $t('recoverInfo') }}</div>
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
    <q-btn
      class="q-ma-md wide250"
      :label="$t('recoverButton')"
      size="lg"
      color="grey-8"
      @click="submit"
      :disable="wait"
    />
  </div>
</q-page>
</template>
<script>
import { recover } from '../js/remotedb'
import SimpleBanner from 'components/SimpleBanner'
export default {
  // name: 'PageName',
  components: {
    SimpleBanner
  },
  data () {
    return {
      email: '',
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
      if (!/^.+@[^.]+\..+$/.test(this.email)) {
        this.showBanner(this.$t('signupError3'))
      } else {
        let status
        try {
          this.wait = true
          status = await recover(this.email, this.$q.lang.getLocale())
        } catch (e) {
          this.wait = false
          this.showBanner(e.message, 3)
          return
        }
        this.wait = false
        this.$router.replace('/recover-info/' + status)
      }
    }
  }
}
</script>
