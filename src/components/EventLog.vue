<template>
  <div class="">
    <div class="fixed-top text-subtitle1 text-bold text-center text-primary eventlog-title">Meditation Log</div>
    <div class="fixed-top gradient"></div>
    <div class="fixed-top gradient-2"></div>
    <div class="eventlog overflow-hidden-y">
      <q-list class="">
        <q-item v-for="(event, idx) in eventlog"
          :key="event.id"
          class="event"
        >
          <q-item-section side class="eventlog-date">
            <div class="fit">
              <span>{{ event.date }}</span>
              <span v-if="idx >= eventlog.length - 2" class="float-right text-red">*</span>
            </div>
          </q-item-section>
          <q-item-section>
            <div class="eventlog-data">
              <span v-if="event.date" class="eventlog-name ellipsis vertical-top">{{ event.user }}</span>
              <span v-else class="">{{ event.user }}</span>
              <span>, </span>
              <span class="">{{ event.min }}</span>
              <span> min</span>
              <span class="float-right" style="width: 8.5em">
                <span v-if="event.week" class="float-left">Last week: {{ event.week }}</span>
              </span>
              <span v-if="idx === eventlog.length -2" class="q-mr-xs float-right">&#128081;</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventLog',
  data () {
    return {
      eventlog: [
        { date: '', user: 'you', min: 15, week: '' },
        { date: '', user: 'VasyachandraSuperhero', min: 20, week: '' },
        { date: '', user: 'Ann', min: 7, week: '' },
        { date: '', user: 'you', min: 15, week: '' },
        { date: '', user: 'you', min: 15, week: '' },
        { date: '', user: 'VasyachandraSuperhero', min: 30, week: '' },
        { date: '', user: 'VasyachandraSuperhero', min: 20, week: '' },
        { date: '', user: 'VasyachandraSuperhero', min: 10, week: '' },
        { date: '', user: 'VasyachandraSuperhero', min: 20, week: '' },
        { date: 'Earlier↑↑↑', user: 'Ann', min: 7, week: '' },
        { date: 'Yesterday', user: 'you', min: 15, week: '' },
        { date: '', user: 'Ann', min: 7, week: '49 min' },
        { date: '', user: 'you', min: 15, week: '' },
        { date: 'Today', user: 'VasyachandraSuperhero', min: 30, week: '3+ hr' },
        { date: '', user: 'you', min: 15, week: '2+ hr' }
      ]
    }
  }
}
</script>
