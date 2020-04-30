<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Attention Challenge
        </q-toolbar-title>
        <toolbar-buttons />
      </q-toolbar>
      <q-bar :class="pageHeaderClass">
        <q-btn
          flat round
          icon="arrow_back"
          class="q-mr-sm"
          @click="$router.go(-1)"
        />
        {{ pageHeaderTitle }}
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import ToolbarButtons from '../components/ToolbarButtons'
export default {
  components: {
    ToolbarButtons
  },
  data () {
    return {
    }
  },
  computed: {
    pageHeaderClass: function () {
      if (this.$store.state.app.pageHeader) {
        return 'q-py-md'
      } else {
        return 'hidden'
      }
    },
    pageHeaderTitle: function () {
      return this.$store.state.app.pageHeaderTitle
    }
  }
}
</script>
