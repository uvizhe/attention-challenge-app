<template>
<q-dialog v-model="show">
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ $t('greetingHeader') }} {{ $store.state.app.username }}!</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ $t('greetingText1') }}<br>
      {{ $t('greetingText2') }} <q-icon name="help" /> {{ $t('greetingText3') }}
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: [
    'show'
  ],
  data () {
    return {}
  }
}
</script>
