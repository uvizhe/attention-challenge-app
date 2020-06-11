<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="flex flex-center content-center">
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
          />
          <q-input
            outlined
            class="q-my-sm login-input"
            maxlength="500"
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            :label="$t('loginPassword')"
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
          />
        </div>
        <router-link to="/recover"
          class="absolute-bottom text-center q-mb-lg"
        >
          {{ $t('loginRecovery') }}
        </router-link>
      </q-page>
    </q-page-container>
  </q-layout>
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
      if (!(this.username && this.password)) {
        this.showError(this.$t('signupError0'))
      } else {
        try {
          await authenticate(this.username, this.password)
          this.$store.dispatch('app/fetchStats')
        } catch (e) {
          this.showError(e.message)
          return
        }
        this.$store.dispatch('app/setUsername', this.username)
        this.$router.replace('/')
      }
    }
  }
}
</script>
