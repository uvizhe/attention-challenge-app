<template>
<q-page padding class="flex flex-center content-center">
  <q-btn
    class="q-ma-md wide300"
    :label="$t('entranceNewUser')"
    size="xl"
    color="grey-8"
    to="/signup"
  />
  <q-btn
    class="q-ma-md wide300"
    :label="$t('entranceExistingUser')"
    size="xl"
    color="grey-8"
    to="/login"
  />
</q-page>
</template>

<script>
export default {
  // name: 'PageName',
  created () {
    this.$i18n.locale = this.$q.lang.getLocale()
  }
}
</script>
