<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-spinner-tail size="lg" color="purple-5" class="fixed-center" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authorize } from '../js/remotedb'
export default {
  // name: 'PageName',
  props: ['action'],
  created () {
    if (this.action === 'auth') {
      this.authorize()
    }
  },
  methods: {
    async authorize () {
      try {
        await authorize()
      } catch (e) {
        setTimeout(() => {
          this.authorize()
        }, 1000)
        return
      }
      this.$router.replace('/app')
    }
  }
}
</script>
