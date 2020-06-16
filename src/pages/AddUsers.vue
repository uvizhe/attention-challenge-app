<template>
  <q-page>
    <q-banner :class="noticeBannerClass">{{ $t('addUsersBanner') }}</q-banner>
    <q-linear-progress indeterminate :class="progressClass" />
    <q-input v-model="search" type="search"
      square outlined dense
      :placeholder="$t('addUsersSearch')"
      debounce="500"
      class="q-mx-sm q-my-xs"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-if="search" v-slot:append>
        <q-icon name="cancel" @click.stop="search = ''" class="cursor-pointer" />
      </template>
    </q-input>
    <q-list dense>
      <q-item :inset-level="1" class="text-bold">
        <q-item-section>
          {{ $t('addUsersTableUsername') }}
        </q-item-section>
        <q-item-section side>
          {{ $t('addUsersTableScore') }}
        </q-item-section>
      </q-item>
      <div class="column">
        <q-item v-for="(user, idx) in users"
          :key="user.id"
          :class="user.show ? '' : 'hidden'"
          :style="poppingRule(idx)"
          tag="label"
          dense
        >
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
      </div>
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
    this.wait = true
    const users = await getUsers()
    this.users = this.prepareUserList(users)
    this.wait = false
  },
  data () {
    return {
      users: [],
      limitNotification: false,
      search: '',
      wait: false
    }
  },
  watch: {
    search: function () {
      this.filterUsers()
    }
  },
  computed: {
    noticeBannerClass: function () {
      let cls = 'absolute-top z-top bg-warning text-white text-center'
      if (!this.limitNotification) {
        cls += ' hidden'
      }
      return cls
    },
    progressClass: function () {
      return this.wait ? '' : 'invisible'
    }
  },
  methods: {
    showNotification () {
      this.limitNotification = true
      setTimeout(() => {
        this.limitNotification = false
      }, 3000)
    },
    poppingRule (idx) {
      if (this.users[idx].friend) {
        return 'order: -2'
      } else if (this.users[idx].pop) {
        return 'order: -1'
      }
      return ''
    },
    checkSelected (idx) {
      if (this.users.filter(i => i.checked).length > 4) {
        this.users[idx].checked = !this.users[idx].checked
        this.showNotification()
      } else if (!this.users[idx].checked) {
        this.users[idx].friend = false
      }
    },
    prepareUserList (users) {
      const friends = this.$store.state.app.friends
      return users.map(i => {
        const friend = friends.includes(i[0])
        return {
          user: i[0],
          score: i[1],
          checked: friend,
          friend: friend,
          show: true,
          pop: false
        }
      })
    },
    filterUsers () {
      /* UX:
        1) on page load search selected usernames on top of the list
        2) if username is unchecked remove it from top
        3) if username is checked leave it in place (don't pop on top)
        4) if search criterium is set filter usernames and pop all selected
        5) pop filtered usernames starting with search string
      */
      const search = this.search.trim().toLowerCase()
      if (!search) {
        this.users.forEach(i => {
          i.show = true
          i.pop = false
        })
      } else if (search.length < 3) {
        this.users.forEach(i => {
          i.show = i.user.toLowerCase().startsWith(search)
        })
      } else {
        const rex = RegExp(search)
        this.users.forEach(i => {
          if (i.user.toLowerCase().startsWith(search)) {
            i.show = true
            i.pop = true
          } else if (rex.test(i.user.toLowerCase())) {
            i.show = true
          } else {
            i.show = false
          }
        })
      }
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
