<template>
<q-page padding class="flex flex-center">
  <div class="column items-center">
    <div v-if="numStatus === 0" class="col text-center">
      {{ $t('recoverInfo2') }}
    </div>
    <div v-else-if="numStatus === 1" class="col text-center">
      {{ $t('recoverInfo2Error') }}
    </div>
    <div v-if="numStatus > 0" class="col q-my-lg">
      <router-link to="/recover" replace>{{ $t('recoverInfo2Back') }}</router-link>
    </div>
  </div>
</q-page>
</template>
<script>
export default {
  // name: 'PageName',
  props: {
    status: String
  },
  computed: {
    numStatus () {
      if (this.status === 'ok') {
        return 0
      } else if (this.status === 'bad email') {
        return 1
      }
      return 2
    }
  }
}
</script>
