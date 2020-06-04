<template>
  <q-page padding>
    <q-banner :class="noticeBannerClass">{{ $t('addUsersBanner') }}</q-banner>
    <q-list dense>
      <q-item :inset-level="1" class="text-bold">
        <q-item-section>
          {{ $t('addUsersTableUsername') }}
        </q-item-section>
        <q-item-section side>
          {{ $t('addUsersTableScore') }}
        </q-item-section>
      </q-item>
      <q-item v-for="(user, idx) in users" :key="user.id" tag="label">
        <q-item-section side>
          <q-checkbox v-model="user.checked" @input="checkSelected(idx)" />
        </q-item-section>
        <q-item-section>
          {{ user.user }}
        </q-item-section>
        <q-item-section side>
          {{ user.score }}
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      :label="$t('addUsersButton')"
      class="full-width q-mt-md fixed-bottom shadow-up-3 square-button"
      size="large"
      color="purple-5"
      @click="addUsers"
    />
  </q-page>
</template>

<script>
import { getUsers } from '../js/remotedb'
export default {
  // name: 'PageName',
  async created () {
    const users = await getUsers()
    this.users = this.prepareUserList(users)
  },
  data () {
    return {
      users: [],
      limitNotification: false
    }
  },
  computed: {
    noticeBannerClass: function () {
      let cls = 'absolute-top z-top bg-warning text-white text-center'
      if (!this.limitNotification) {
        cls += ' hidden'
      }
      return cls
    }
  },
  methods: {
    showNotification () {
      this.limitNotification = true
      setTimeout(() => {
        this.limitNotification = false
      }, 3000)
    },
    checkSelected (idx) {
      if (this.users.filter(i => i.checked).length > 4) {
        this.users[idx].checked = !this.users[idx].checked
        this.showNotification()
      }
    },
    prepareUserList (users) {
      const friends = this.$store.state.app.friends
      return users.map(i => {
        return {
          user: i[0],
          score: i[1],
          checked: friends.includes(i[0])
        }
      })
    },
    addUsers () {
      const users = this.users
        .filter(i => i.checked)
        .map(i => i.user)
      this.$store.dispatch('app/addFriends', users)
      this.$router.go(-1)
    }
  }
}
</script>
