<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
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
