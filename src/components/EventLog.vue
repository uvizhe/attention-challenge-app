<template>
  <div class="">
    <div class="fixed-top text-subtitle1 text-bold text-center text-primary eventlog-title">Meditation Log</div>
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
          label="Add friends"
          label-position="left"
          external-label
          color="purple-5"
          padding="xs"
          @click="$router.push('/app/addusers')"
        />
        <q-fab-action
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
              <span>{{ event.date }}</span>
              <span v-if="event.ts >= referenceSyncTime" class="float-right text-red">*</span>
            </div>
          </q-item-section>
          <q-item-section>
            <div class="eventlog-data">
              <span v-if="event.user" class="eventlog-name ellipsis vertical-top">{{ event.user }}</span>
              <span v-else-if="showFriends" class="eventlog-name ellipsis vertical-top">you</span>
              <span v-if="showFriends">, </span>
              <span class="">{{ event.min }}</span>
              <span> min</span>
              <span v-if="!event.user">, </span>
              <span v-if="event.score === 0" class="text-primary">&star;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 1" class="text-primary">&starf;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 2" class="text-primary">&starf;&starf;&star;&star;&star;</span>
              <span v-else-if="event.score === 3" class="text-primary">&starf;&starf;&starf;&star;&star;</span>
              <span v-else-if="event.score === 4" class="text-primary">&starf;&starf;&starf;&starf;&star;</span>
              <span v-else-if="event.score === 5" class="text-primary">&starf;&starf;&starf;&starf;&starf;</span>
              <span class="eventlog-week float-right">
                <span v-if="event.week" class="float-left">This week: {{ event.week }}</span>
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
      if (this.$store.state.app.friends.length) {
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
    friendsVisibilityIcon () {
      return this.showFriends ? 'visibility_off' : 'visibility'
    },
    friendsVisibilityLabel () {
      return this.showFriends ? 'Hide friends' : 'Show friends'
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
      const idx = this.$store.state.app.friends.indexOf(username)
      return 'event bg-' + colors[idx]
    },
    toggleFriends () {
      this.$store.commit('app/toggleFriends')
    }
  }
}
</script>
