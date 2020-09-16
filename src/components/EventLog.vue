<template>
  <div class="">
    <div class="fixed-top text-subtitle1 text-bold text-center text-primary eventlog-title">Meditation Log</div>
    <div class="fixed-top gradient"></div>
    <div class="fixed-top gradient-2"></div>
    <div class="eventlog overflow-hidden-y">
      <q-list class="">
        <q-item v-for="event in eventlog"
          :key="event.id"
          class="event"
        >
          <q-item-section side class="eventlog-date">
            <div class="fit">
              <span>{{ event.date }}</span>
              <span v-if="eventlog.new" class="float-right text-red">*</span>
            </div>
          </q-item-section>
          <q-item-section>
            <div class="eventlog-data">
              <span class="">{{ event.min }}</span>
              <span> min</span>
              <span>, </span>
              <span v-if="event.score === 0" class="text-primary">&star;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 1" class="text-primary">&starf;&star;&star;&star;&star;</span>
              <span v-else-if="event.score === 2" class="text-primary">&starf;&starf;&star;&star;&star;</span>
              <span v-else-if="event.score === 3" class="text-primary">&starf;&starf;&starf;&star;&star;</span>
              <span v-else-if="event.score === 4" class="text-primary">&starf;&starf;&starf;&starf;&star;</span>
              <span v-else-if="event.score === 5" class="text-primary">&starf;&starf;&starf;&starf;&starf;</span>
              <span class="eventlog-week float-right">
                <span v-if="event.week" class="float-left">This week: {{ event.week }}</span>
              </span>
              <span v-if="eventlog.king" class="q-mr-xs float-right">&#128081;</span>
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
    eventlog () {
      return makeEL(this.$store.state.app.sessions)
    }
  }
}
</script>
