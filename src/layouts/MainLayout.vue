<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-mysecondary text-white">
      <q-bar :class="pageHeaderClass">
        [
        <q-btn
          flat round
          icon="arrow_back"
          @click="$router.replace('/app')"
        />
        ]
        <span class="q-ml-sm">&nbsp;{{ pageHeaderTitle }}</span>
        <q-space />
        <div v-if="$router.currentRoute.path.match('about')">
          v{{ version }}
        </div>
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      version: process.env.VERSION
    }
  },
  computed: {
    pageHeaderClass () {
      if (this.$store.state.app.pageHeader) {
        return 'q-py-md'
      } else {
        return 'hidden'
      }
    },
    pageHeaderTitle () {
      const titleString = this.$store.state.app.pageHeaderTitle
      if (titleString) {
        return this.$t(titleString)
      }
      return ''
    }
  }
}
</script>
