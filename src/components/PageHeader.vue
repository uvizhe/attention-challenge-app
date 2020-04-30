<template>
  <div class="q-mb-md row no-wrap items-center">
    <div class="col-shrink">
      <q-btn
        outline
        color="primary"
        icon="arrow_back"
        style="width: 3em"
        @click="$router.go(-1)"
      />
    </div>
    <div
      class="q-ml-lg text-h5 text-uppercase text-primary">
      {{ title }}
    </div>
  </div>
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
