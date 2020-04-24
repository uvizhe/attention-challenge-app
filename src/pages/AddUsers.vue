<template>
  <q-page padding>
    <q-item v-for="user in users" :key="user.id" tag="label">
      <q-item-section side top>
        <q-checkbox v-model="check1" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ user[0] }}</q-item-label>
        <q-item-label caption>
          {{ user[1] }}
        </q-item-label>
      </q-item-section>
      </q-item>
  </q-page>
</template>

<script>
import { getUsers } from '../js/database'
export default {
  // name: 'PageName',
  async created () {
    this.users = await getUsers()
  },
  data () {
    return {
      users: [],
      check1: false
    }
  }
}
</script>
