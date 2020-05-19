<template>
  <div>
    <q-btn
      flat
      round
      icon="settings"
      @click="$router.push('/settings')"
    />
    <q-btn
      flat
      round
      icon="help"
      @click="$router.push('/help')"
    />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {}
  }
}
</script>
