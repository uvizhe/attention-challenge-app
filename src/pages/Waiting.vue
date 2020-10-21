<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <offline-dialog :show="offlineDialog" @close="closeOfflineDialog" />
        <q-spinner-tail size="lg" color="purple-5" class="fixed-center" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { authorize } from '../js/remotedb'
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
    closeOfflineDialog () {
      this.$store.commit('app/setOffline')
      this.offlineDialog = false
      this.$router.replace('/app')
    }
  }
}
</script>
