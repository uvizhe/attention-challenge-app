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
              <span v-if="event.date" class="eventlog-name ellipsis vertical-top">{{ event.user }}</span>
              <span v-else class="">{{ event.user }}</span>
              <span>, </span>
              <span class="">{{ event.min }}</span>
              <span> min</span>
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
