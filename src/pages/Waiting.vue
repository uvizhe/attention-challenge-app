<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-spinner-tail size="lg" color="purple-5" class="fixed-center" />
        <div :class="feedbackClass">
          {{ feedbackMsg }}
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authorize } from '../js/remotedb'
export default {
  // name: 'PageName',
  props: ['action'],
  data () {
    return {
      feedbackMsg: ''
    }
  },
  created () {
    if (this.action === 'auth') {
      this.authorize()
    }
  },
  computed: {
    feedbackClass () {
      const cls = 'absolute-center q-mt-xl text-center full-width'
      return this.feedbackMsg ? cls : 'hidden'
    }
  },
  methods: {
    async authorize () {
      try {
        await authorize()
      } catch (e) {
        setTimeout(() => {
          this.feedback()
        }, 5000)
        setTimeout(() => {
          this.authorize()
        }, 1000)
        return
      }
      this.$router.replace('/app')
    },
    feedback () {
      this.feedbackMsg = this.$t('waitingHint')
    }
  }
}
</script>
