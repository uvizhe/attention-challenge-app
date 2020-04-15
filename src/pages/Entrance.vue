<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="flex flex-center content-center">
        <q-btn
          class="q-ma-md entrance-button"
          label="New user"
          color="purple-5"
          size="xl"
          @click="$router.push('/signup')"
        />
        <q-btn
          class="q-ma-md entrance-button"
          label="Existing user"
          color="purple-5"
          size="xl"
          @click="$router.push('/login')"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>
