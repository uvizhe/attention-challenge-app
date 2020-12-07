<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-spinner-tail size="lg" color="grey-8" class="fixed-center" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authorize, tryout } from '../js/remotedb'
import { getConfig } from '../js/localdb'
export default {
  // name: 'PageName',
  props: ['action'],
  data () {
    return {
      offlineTimer: null
    }
  },
  created () {
    if (this.action === 'auth') {
      this.authorize()
    } else if (this.action === 'tryout') {
      this.tryout()
    }
  },
  methods: {
    async authorize () {
      if (getConfig('tryout')) {
        authorize() // don't wait for a server in tryout mode
      } else {
        try {
          await authorize()
        } catch (e) {
          setTimeout(() => {
            // retry every second until considered offline
            this.authorize()
          }, 1000)
          if (this.offlineTimer === null) {
            this.offlineTimer = setTimeout(() => {
              this.$store.commit('app/setOffline')
              this.$router.replace('/app')
            }, 5000)
          }
          return
        }
      }
      this.$router.replace('/app')
    },
    async tryout () {
      try {
        await tryout(window.device.uuid)
      } catch (e) {}
      this.$router.replace('/app')
    }
  }
}
</script>
