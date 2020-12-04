<template>
<q-page padding class="flex flex-center content-center">
    <p class="q-my-sm entrance-button">{{ $t('tryoutInfo') }}</p>
    <p class="q-my-sm entrance-button">{{ $t('tryoutInfo2') }}</p>
    <q-btn
      class="q-ma-md entrance-button"
      :label="$t('tryoutButton')"
      size="xl"
      color="grey-8"
      @click="proceed"
    />
</q-page>
</template>
<script>
export default {
  // name: 'PageName',
  data () {
    return {}
  },
  methods: {
    proceed () {
      this.$store.commit('app/setTryoutMode')
      this.$router.replace('/app')
    }
  }
}
</script>
