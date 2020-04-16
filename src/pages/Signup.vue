<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="flex flex-center content-center">
        <div class="column items-center">
          <q-banner :class="errorBannerClass">{{ errMsg }}</q-banner>
          <div class="text-h5 q-my-sm">NEW USER</div>
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
            maxlength="50"
            type="email"
            v-model="email"
            label="Email"
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
import { signup } from '../js/database'
export default {
  // name: 'PageName',
  data () {
    return {
      username: '',
      password: '',
      email: '',
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
    async submit () {
      if (!(this.username && this.password && this.email)) {
        this.errMsg = 'Please fill in all fields!'
      } else if (this.username.length < 2) {
        this.errMsg = 'Username can\'t be shorter than 2 characters!'
      } else if (!/^[\w\d\-_]+$/.test(this.username)) {
        this.errMsg = 'Username can contain _ - and ' +
          'alphanumeric characters only!'
      } else if (!/^.+@[^.]+\..+$/.test(this.email)) {
        this.errMsg = 'Please provide a valid email!'
      } else {
        if (await signup(this.username, this.password, this.email)) {
          this.$router.push('/')
          return
        } else {
          this.errMsg = 'This username already exists!'
        }
      }
      this.error = true
    }
  }
}
</script>
