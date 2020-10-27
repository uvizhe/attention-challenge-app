<template>
  <q-btn
    class="absolute-center shadow-up-5"
    @click="onClick"
    :disable="disabled"
    round
    size="60px"
    color="deep-orange"
  >
    <div class="big-red-btn-title relative-position">

      <div v-if="!disabled">
        <q-icon name="play_arrow" />
        <div
          class="big-red-btn-subtitle absolute-bottom text-red-2 text-lowercase">
          {{ duration }}&nbsp;{{ $t('rbMin') }}
        </div>
      </div>
      <div v-else>
        {{ remaining }}
      </div>
    </div>
    <q-tooltip
      v-model="tooltip"
      :no-parent-event="true"
      max-width="70%"
      content-class="text-justify"
    >
      {{ $t('indexBellsDeferralWarning') }}
    </q-tooltip>
  </q-btn>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: {
    disabled: Boolean,
    duration: Number,
    remaining: String,
    tooltip: Boolean
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>
