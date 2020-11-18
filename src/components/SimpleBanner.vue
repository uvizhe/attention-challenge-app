<template>
  <q-banner v-if="show"
    :class="bannerClass"
  >
    {{ message }}
  </q-banner>
</template>

<script>
export default {
  name: 'SimpleBanner',
  props: {
    show: Boolean,
    severity: Number, // 0 - debug, 1 - notice, 2 - warning, 3 - error
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
  },
  computed: {
    bannerClass () {
      let cls = 'absolute-top z-top text-white text-center'
      if (!this.severity) cls += ' bg-dark'
      else if (this.severity === 1) cls += ' bg-info'
      else if (this.severity === 2) cls += ' bg-warning'
      else if (this.severity === 3) cls += ' bg-negative'
      return cls
    }
  }
}
</script>
