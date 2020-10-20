<template>
  <q-banner v-if="visible"
    :class="bannerClass"
  >
    {{ bannerText }}
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
  data () {
    return {
      visible: false,
      bannerText: ''
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.showNotification(this.message)
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
  },
  methods: {
    showNotification (message) {
      this.bannerText = message
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, 3000)
    }
  }
}
</script>
