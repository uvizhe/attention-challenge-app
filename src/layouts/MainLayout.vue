<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Attention Challenge
        </q-toolbar-title>
        <toolbar-buttons />
      </q-toolbar>
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
  }
}
</script>
