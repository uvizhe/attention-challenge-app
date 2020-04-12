<template>
  <q-dialog v-model="show" persistent transition-hide="scale">
    <q-card>
      <q-card-section align="center">
        <div class="text-h6">Rate your session</div>
      </q-card-section>
      <q-card-section>
        <q-rating
          v-model="score"
          size="3.5em"
          color="yellow-14"
          icon="star"
        />
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat label="Reset" color="primary" @click="score=0" />
        <q-btn flat label="OK" color="primary" @click="reportScore" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'RatingDialog',
  props: {
    show: Boolean
  },
  data () {
    return {
      score: 0
    }
  },
  methods: {
    reportScore () {
      this.$emit('rated', this.score)
      this.score = 0
    }
  }
}
</script>
