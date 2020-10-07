<template>
  <div class="">
    <div class="fixed-top text-subtitle1 text-bold text-center text-primary eventlog-title">{{ $t('eventlogTitle') }}</div>
    <div>
      <q-fab
        direction="down"
        icon="people"
        color="primary"
        padding="xs"
        class="fixed-top-right q-ma-md eventlog-title"
      >
        <q-fab-action
          icon="group_add"
          :label="manageFriendsLabel"
          label-position="left"
          external-label
          color="purple-5"
          padding="xs"
          @click="$router.push('/app/addusers')"
        />
        <q-fab-action v-if="haveFriends"
          :icon="friendsVisibilityIcon"
          :label="friendsVisibilityLabel"
          label-position="left"
          external-label
          color="purple-5"
          padding="xs"
          @click="toggleFriends"
        />
      </q-fab>
    </div>
    <div class="fixed-top gradient"></div>
    <div class="fixed-top gradient-2"></div>
    <div class="eventlog overflow-hidden-y">
      <q-list class="">
        <q-item v-for="event in eventlog"
          :key="event.id"
          :class="eventClass(event.user)"
        >
          <q-item-section side class="eventlog-date">
            <div class="fit">
              <span>{{ DateI18n(event.date) }}</span>
              <span v-if="event.ts >= referenceSyncTime" class="float-right text-red">*</span>
            </div>
          </q-item-section>
          <q-item-section>
            <div>
              <span v-if="event.user" class="eventlog-name ellipsis vertical-top">{{ event.user }}</span>
              <span v-if="event.score === 0" class="text-primary">&star;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 1" class="text-primary">&starf;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 2" class="text-primary">&starf;&starf;&star;&star;&star;</span>
              <span v-else-if="event.score === 3" class="text-primary">&starf;&starf;&starf;&star;&star;</span>
              <span v-else-if="event.score === 4" class="text-primary">&starf;&starf;&starf;&starf;&star;</span>
              <span v-else-if="event.score === 5" class="text-primary">&starf;&starf;&starf;&starf;&starf;</span>
              <span>, </span>
              <span class="">{{ event.min }}</span>
              <span> {{ $t('eventlogUnitMin') }}</span>
              <span class="eventlog-week float-right">
                <span v-if="event.week !== undefined" class="float-left">{{ $t('eventlogThisWeek') }}: {{ event.week }} {{ weekUnitI18n(event.weekUnit) }}</span>
              </span>
              <span v-if="showFriends && event.leader" class="q-mr-xs float-right">&#128081;</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { makeEL } from '../js/eventlog'
const colors = ['pinky', 'yellow-3', 'blue-1', 'orange-2']
export default {
  name: 'EventLog',
  data () {
    return {
    }
  },
  computed: {
    referenceSyncTime () {
      return this.$store.getters['app/referenceSyncTime']
    },
    haveFriends () {
      if (this.$store.getters['app/friends'].length) {
        return true
      }
      return false
    },
    showFriends () {
      if (this.haveFriends && this.$store.state.app.showFriends) {
        return true
      }
      return false
    },
    manageFriendsLabel () {
      if (this.haveFriends) {
        return this.$t('eventlogEditFriends')
      }
      return this.$t('eventlogAddFriends')
    },
    friendsVisibilityIcon () {
      return this.showFriends ? 'visibility_off' : 'visibility'
    },
    friendsVisibilityLabel () {
      return this.showFriends
        ? this.$t('eventlogHideFriends')
        : this.$t('eventlogShowFriends')
    },
    eventlog () {
      let sessionsDict = {
        '': this.$store.state.app.sessions
      }
      if (this.showFriends) {
        sessionsDict = {
          ...sessionsDict,
          ...this.$store.state.app.friendsSessions
        }
      }
      const eventlog = makeEL(sessionsDict)
      return eventlog
    }
  },
  methods: {
    eventClass (username) {
      const idx = this.$store.getters['app/friends'].indexOf(username)
      return 'event bg-' + colors[idx]
    },
    toggleFriends () {
      this.$store.commit('app/toggleFriends')
    },
    DateI18n (date) {
      if (date === 'Today') {
        return this.$t('eventlogToday')
      } else if (date === 'Yesterday') {
        return this.$t('eventlogYesterday')
      }
      return date
    },
    weekUnitI18n (unit) {
      if (unit === 'hr') {
        return this.$t('eventlogUnitHr')
      }
      return this.$t('eventlogUnitMin')
    }
  }
}
</script>
