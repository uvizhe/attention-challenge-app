<template>
  <div>
    <div class="text-center text-subtitle1 text-bold">
      {{ $t('sessionParams') }}
      <q-icon name="help" class="text-grey-8">
        <q-tooltip :hide-delay="3000" :offset="[0,0]">
          {{ $t('sessionParamsDeferralHint') }}<br/>
          {{ $t('sessionParamsDurationHint') }}
        </q-tooltip>
      </q-icon>
    </div>
    <div class="relative-position q-mb-md">
      <span class="absolute-left text-dark text-bold q-ml-sm">
        {{ $t('sessionParamsDeferral') }}:
        <span class="text-weight-regular text-dark">
          {{ values.min }} {{ $t('rbMin') }}
        </span>
      </span>
      <span class="absolute-right text-dark text-bold q-mr-sm">
        {{ $t('sessionParamsDuration') }}:
        <span class="text-weight-regular text-dark">
          {{ values.max }} {{ $t('rbMin') }}
        </span>
      </span>
    </div>
    <q-range
      :min="0"
      :max="max"
      v-model="values"
      class="session-params text-grey-8"
      @input="value => check(value)"
      :disable="disable"
    />
  </div>
</template>

<script>
import { MIN_SESSION, MAX_SESSION } from '../js/constants'
export default {
  // name: 'ComponentName',
  props: {
    disable: Boolean
  },
  data () {
    return {
      values: {}
    }
  },
  created () {
    this.values.min = this.sec2Min(this.$store.state.app.bellsDeferral)
    this.values.max = this.sec2Min(process.env.SESSION_DURATION ||
      this.$store.state.app.sessionDuration)
  },
  computed: {
    max () {
      return MAX_SESSION
    }
  },
  methods: {
    sec2Min (value) {
      return value / 60
    },
    check (value) {
      if (this.values.max < MIN_SESSION) {
        this.values.max = MIN_SESSION
      }
      if (this.values.max - this.values.min < MIN_SESSION &&
          this.values.min > 0) {
        this.values.min = this.values.max - MIN_SESSION
      }
      this.$emit('change', [this.values.min, this.values.max])
    }
  }
}
</script>
