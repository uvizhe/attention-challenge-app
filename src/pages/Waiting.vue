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
      offlineDialog: false
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
        setTimeout(() => {
          this.offlineDialog = true
        }, 5000)
        setTimeout(() => {
          this.authorize()
        }, 1000)
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
