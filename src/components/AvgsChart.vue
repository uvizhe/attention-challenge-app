<template>
  <div>
    <div class="text-subtitle1 text-bold text-center text-mysecondary-dark">
      {{ $t('avgsChartTitle') }}
      <q-icon name="help" class="text-myprimary">
        <q-tooltip :hide-delay="2000" offset="[0,0]">
          {{ $t('avgsChartHint') }}
        </q-tooltip>
      </q-icon>
    </div>
    <apexchart class="chart" type="line" height="100" :options="options()" :series="series()" />
  </div>
</template>

<script>
export default {
  name: 'AvgsChart',
  data () {
    return {
      dataLength: 0
    }
  },
  methods: {
    series () {
      const avgs = this.$store.state.app.avgs
      this.dataLength = avgs.length
      return [{
        data: avgs
      }]
    },
    options () {
      const axisLength = 90
      const xaxisMin = this.dataLength - axisLength - 1
      let strokeWidth = 3
      if (this.dataLength <= 2) {
        strokeWidth = 6 - this.dataLength
      }
      return {
        grid: {
          row: {
            colors: ['#f868f8', '#f888f8', '#f8a8f8', '#f8c8f8', '#f8e8f8']
          }
        },
        xaxis: {
          floating: true,
          labels: { show: false },
          min: xaxisMin,
          max: this.dataLength,
          axisBorder: { show: false }
        },
        yaxis: {
          floating: true,
          labels: { show: false },
          min: 0,
          max: 5,
          tickAmount: 5
        },
        stroke: { lineCap: 'round', width: strokeWidth },
        colors: ['#d65fa9'],
        // colors: ['#c357c5'],
        tooltip: { enabled: false },
        chart: {
          sparkline: { enabled: true },
          toolbar: { show: false }
        },
        noData: {
          text: this.$t('avgsChartPlaceholder'),
          offsetY: -10,
          style: { color: '#ab47bc' }
        }
      }
    }
  }
}
</script>
