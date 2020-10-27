<template>
  <div>
    <div class="text-center text-primary text-subtitle1 text-bold">
    {{ $t('sessionParams') }}
    <q-icon name="help">
      <q-tooltip :hide-delay="2000" offset="[0,0]">
        {{ $t('sessionParamsDeferralHint') }}<br/>
        {{ $t('sessionParamsDurationHint') }}
      </q-tooltip>
    </q-icon>
    </div>
    <div class="relative-position q-mb-md">
      <span class="absolute-left text-primary text-bold q-ml-sm">
        {{ $t('sessionParamsDeferral') }}:
        <span class="text-purple-6">
          {{ values.min }} {{ $t('rbMin') }}
        </span>
      </span>
      <span class="absolute-right text-primary text-bold q-mr-sm">
        {{ $t('sessionParamsDuration') }}:
        <span class="text-purple-6">
          {{ values.max }} {{ $t('rbMin') }}
        </span>
      </span>
    </div>
    <q-range
      :min="0"
      :max="max"
      v-model="values"
      color="purple-5"
      class="session-params"
      @input="value => check(value)"
    />
  </div>
</template>

<script>
import { MIN_SESSION, MAX_SESSION } from '../js/constants'
export default {
  // name: 'ComponentName',
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
