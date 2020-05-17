<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="flex flex-center content-center">
        <div class="column items-center">
          <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
          <div class="text-h5 q-my-sm">LOGIN</div>
          <q-input
            outlined
            class="q-my-sm login-input"
            maxlength="50"
            v-model="username"
            label="Username"
          />
          <q-input
            outlined
            class="q-my-sm login-input"
            maxlength="500"
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
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
            label="Enter"
            color="purple-5"
            size="xl"
            @click="submit"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authenticate } from '../js/database'
export default {
  // name: 'PageName',
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
        this.showError('Please fill in all fields!')
      } else {
        try {
          await authenticate(this.username, this.password)
          this.$store.dispatch('app/fetchStats')
        } catch (e) {
          this.showError(e.message)
          return
        }
        this.$router.push('/')
      }
    }
  }
}
</script>
