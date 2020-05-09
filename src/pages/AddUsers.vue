<template>
  <q-page padding>
    <q-list dense>
      <q-item :inset-level="1" class="text-bold">
        <q-item-section>
          Username
        </q-item-section>
        <q-item-section side>
          Score
        </q-item-section>
      </q-item>
      <q-item v-for="user in users" :key="user.id" tag="label">
        <q-item-section side>
          <q-checkbox v-model="user.checked" />
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
      label="Add to chart"
      class="full-width q-mt-md fixed-bottom shadow-up-3 square-button"
      size="large"
      color="purple-5"
      @click="addUsers"
    />
  </q-page>
</template>

<script>
import { getUsers } from '../js/database'
export default {
  // name: 'PageName',
  async created () {
    const users = await getUsers()
    this.users = this.prepareUserList(users)
  },
  data () {
    return {
      users: [],
      check1: false
    }
  },
  methods: {
    prepareUserList (users) {
      const friends = this.$store.state.app.totalsChartFriends
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
      this.$store.dispatch('app/addUsersToTotalsChart', users)
      this.$router.go(-1)
    }
  }
}
</script>
