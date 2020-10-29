<template>
  <div>
  <q-dialog v-model="show" persistent transition-hide="scale">
    <q-card>
      <q-card-section align="center" class="rating-dialog-header">
        <div class="text-h6 text-mysecondary-dark">{{ $t('ratingHeader') }}</div>
      </q-card-section>
      <q-card-section>
        <q-rating
          v-model="score"
          size="3.5em"
          class="text-mysecondary"
          icon="star_border"
          icon-selected="star"
          :readonly="wait"
        />
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat :label="$t('ratingReset')" @click="score=0" :disable="wait || score === 0" class="text-myprimary" />
        <q-btn flat label="OK" @click="reportScore" :disable="wait" class="text-myprimary" />
      </q-card-actions>
      <q-linear-progress indeterminate :class="progressClass" />
    </q-card>
  </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'RatingDialog',
  props: {
    show: Boolean,
    wait: Boolean
  },
  data () {
    return {
      score: 0
    }
  },
  computed: {
    progressClass () {
      return this.wait ? '' : 'invisible'
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
