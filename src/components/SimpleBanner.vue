<template>
  <q-banner v-if="show"
    class="absolute-top z-top text-center text-white bg-primary-lighter"
  >
    {{ message }}
  </q-banner>
</template>

<script>
export default {
  name: 'SimpleBanner',
  props: {
    show: Boolean,
    message: String
  },
  watch: {
    show (val) {
      if (val) {
        setTimeout(() => {
          this.$emit('close')
        }, 4000)
      }
    }
  }
}
</script>
