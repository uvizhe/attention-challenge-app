<template>
  <q-page>
    <simple-banner :show="banner" :message="bannerMessage" @close="hideBanner()" />
    <q-linear-progress indeterminate :class="progressClass" color="grey-8" />
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
            <q-checkbox
              v-model="user.checked"
              @input="checkSelected(idx)"
              color="grey-8"
            />
          </q-item-section>
          <q-item-section>
            {{ user.user }}
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <q-footer elevated>
      <q-btn
        :label="$t('addUsersButton')"
        class="full-width square-button"
        color="grey-8"
        size="large"
        @click="addUsers"
      />
    </q-footer>
  </q-page>
</template>

<script>
import { getUsers } from '../js/remotedb'
import SimpleBanner from 'components/SimpleBanner'
export default {
  // name: 'PageName',
  components: {
    SimpleBanner
  },
  async created () {
    this.wait = true
    let users = []
    try {
      users = await getUsers()
    } catch (e) {
      this.showBanner(this.$t('networkError'))
      this.$store.commit('app/setOffline')
    }
    this.users = this.prepareUserList(users)
    this.wait = false
  },
  data () {
    return {
      users: [],
      search: '',
      wait: false,
      banner: false,
      bannerMessage: ''
    }
  },
  watch: {
    search () {
      this.filterUsers()
    }
  },
  computed: {
    progressClass () {
      return this.wait ? '' : 'invisible'
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
        this.showBanner(this.$t('addUsersBanner'))
      } else if (!this.users[idx].checked) {
        this.users[idx].friend = false
      }
    },
    prepareUserList (users) {
      const friends = this.$store.getters['app/friends']
      return users.map(user => {
        const friend = friends.includes(user)
        return {
          user: user,
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
      this.$router.replace('/app')
    }
  }
}
</script>
