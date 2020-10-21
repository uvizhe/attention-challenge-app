<template>
  <div>
    <q-btn v-if="$store.state.app.offline"
      flat round outline disable
      icon="error"
      color="deep-orange-5"
    >
      <q-tooltip :hide-delay="1000">
        {{ $t('offlineMode') }}
      </q-tooltip>
    </q-btn>
    <q-btn
      flat
      round
      icon="settings"
      @click="navigate('/app/settings')"
    />
    <q-btn
      flat
      round
      icon="help"
      @click="navigate('/app/about')"
    />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {}
  },
  methods: {
    navigate (path) {
      if (this.$router.currentRoute.path.startsWith('/app/')) {
        // switching between children routes, don't pollute history
        this.$router.replace(path)
      } else {
        this.$router.push(path)
      }
    }
  }
}
</script>
