<template>
<q-dialog v-model="show">
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ $t('offlineDialogHeader') }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row justify-evenly">
        <div class="col-shrink self-center on-left">
          <q-icon name="error" color="deep-orange" size="md" />
        </div>
        <div class="col">
          {{ $t('offlineDialogText') }}
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" @click="close" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: {
    show: Boolean
  },
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
