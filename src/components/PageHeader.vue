<template>
  <div class="full-width q-mt-xs q-mb-lg text-h5 text-center text-uppercase">{{ title }}</div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: String
  },
  data () {
    return {}
  }
}
</script>
