<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <offline-dialog :show="offlineDialog" @close="closeOfflineDialog" />
        <q-spinner-tail size="lg" color="grey-8" class="fixed-center" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authorize, tryout } from '../js/remotedb'
import OfflineDialog from 'components/OfflineDialog'
export default {
  // name: 'PageName',
  components: {
    OfflineDialog
  },
  props: ['action'],
  data () {
    return {
      offlineDialog: false,
      offlineTimer: null,
      retryTimer: null
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
      try {
        await authorize()
      } catch (e) {
        this.retryTimer = setTimeout(() => {
          // retry every second until considered offline
          this.authorize()
        }, 1000)
        if (this.offlineTimer === null) {
          this.offlineTimer = setTimeout(() => {
            clearTimeout(this.retryTimer)
            this.offlineDialog = true
          }, 5000)
        }
        return
      }
      this.$router.replace('/app')
    },
    async tryout () {
      try {
        await tryout(window.device.uuid)
      } catch (e) {}
      this.$router.replace('/app')
    },
    closeOfflineDialog () {
      this.$store.commit('app/setOffline')
      this.offlineDialog = false
      this.$router.replace('/app')
    }
  }
}
</script>
