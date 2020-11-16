<template>
  <q-btn
    class="absolute-center shadow-up-5 big-red-btn"
    @click="onClick"
    size="60px"
    color="grey-8"
    :disable="disabled"
    rounded
  >
    <div class="big-red-btn-title relative-position">

      <div v-if="!disabled">
        <q-icon name="play_arrow" />
        <div
          class="big-red-btn-subtitle absolute-bottom text-lowercase">
          {{ duration }}&nbsp;{{ $t('rbMin') }}
        </div>
      </div>
      <div v-else>
        {{ remaining }}
      </div>
    </div>
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
