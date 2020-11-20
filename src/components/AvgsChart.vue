<template>
  <div>
    <div class="text-subtitle1 text-bold text-center">
      {{ $t('avgsChartTitle') }}
      <q-icon name="help" class="text-grey-8">
        <q-tooltip :hide-delay="2000" :offset="[0,0]">
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
            colors: ['#eccb7f', '#efd495', '#f5e0ad', '#faebc6', '#fff6df'],
            opacity: 1
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
        colors: ['#616161'],
        tooltip: { enabled: false },
        chart: {
          sparkline: { enabled: true },
          toolbar: { show: false }
        },
        noData: {
          text: this.$t('avgsChartPlaceholder'),
          offsetY: -10,
          style: { color: '#616161' }
        }
      }
    }
  }
}
</script>
