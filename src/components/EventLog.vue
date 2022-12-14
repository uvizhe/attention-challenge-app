<template>
  <div class="">
    <div class="fixed-top text-subtitle1 text-bold text-center hover">
      {{ $t('eventlogTitle') }}
      <q-icon name="help" class="text-grey-8">
        <q-tooltip :hide-delay="3000" :offset="[0,0]">
          {{ $t('eventlogHint') }}
        </q-tooltip>
      </q-icon>
    </div>
    <div>
      <q-fab
        direction="down"
        icon="people"
        padding="sm"
        color="grey-8"
        class="fixed-top-right q-ma-md hover"
      >
        <q-fab-action
          icon="group_add"
          :label="manageFriendsLabel"
          :disable="$store.state.app.offline"
          label-position="left"
          external-label
          padding="xs"
          color="grey-8"
          @click="$router.push('/app/addusers')"
        />
        <q-fab-action v-if="haveFriends"
          :icon="friendsVisibilityIcon"
          :label="friendsVisibilityLabel"
          label-position="left"
          external-label
          padding="xs"
          color="grey-8"
          @click="toggleFriends"
        />
      </q-fab>
    </div>
    <div class="fixed-top gradient"></div>
    <div class="fixed-top gradient-2"></div>
    <div class="eventlog">
      <q-list class="">
        <q-item v-for="event in eventlog"
          :key="event.id"
          class="event"
        >
          <q-item-section side class="eventlog-date">
            <div class="fit">
              <span>{{ DateI18n(event.date) }}</span>
            </div>
          </q-item-section>
          <q-item-section>
            <div :class="eventClass(event)">
              <span v-if="event.user" class="eventlog-name ellipsis vertical-top">{{ event.user }}</span>
              <span v-if="event.score === 0" class="text-mysecondary">&star;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 1" class="text-mysecondary">&starf;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 2" class="text-mysecondary">&starf;&starf;&star;&star;&star;</span>
              <span v-else-if="event.score === 3" class="text-mysecondary">&starf;&starf;&starf;&star;&star;</span>
              <span v-else-if="event.score === 4" class="text-mysecondary">&starf;&starf;&starf;&starf;&star;</span>
              <span v-else-if="event.score === 5" class="text-mysecondary">&starf;&starf;&starf;&starf;&starf;</span>
              <span v-if="event.min">, </span>
              <span v-if="event.min">{{ event.min }}</span>
              <span v-if="event.min"> {{ $t('eventlogUnitMin') }}</span>
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
export default {
  name: 'EventLog',
  data () {
    return {
    }
  },
  computed: {
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
      const eventlog = makeEL(sessionsDict, this.$store.getters['app/startOfWeekDay'])
      return eventlog
    }
  },
  methods: {
    eventClass (event) {
      const idx = this.$store.getters['app/friends'].indexOf(event.user)
      let cls = 'friend-' + idx
      if (this.unseenEvent(event)) {
        cls += ' event-new'
      }
      return cls
    },
    toggleFriends () {
      this.$store.commit('app/toggleFriends')
    },
    unseenEvent (event) {
      const prevSyncTime = this.$store.state.app.prevSyncTime
      const lastActionTime = this.$store.state.app.lastActionTime
      if (event.ts >= prevSyncTime && event.user) {
        return true
      } else if (Number(event.ts) + 1 >= lastActionTime && !event.user) {
        // event.ts must be near lastActionTime to be sure
        // it's the last user session
        return true
      }
      return false
    },
    DateI18n (date) {
      if (!date) {
        // pass
      } else if (date === 1) {
        return this.$t('eventlogToday')
      } else if (date === -1) {
        return this.$t('eventlogYesterday')
      } else {
        return this.$store.getters['app/getLocalDayString'](date)
      }
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
