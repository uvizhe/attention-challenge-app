<template>
  <div>
    <apexchart class="chart" type="line" height="100" :options="options" :series="series" />
  </div>
</template>

<script>
export default {
  name: 'Avgs30Chart',
  data () {
    return {
      optionsDefault: {
        grid: {
          row: {
            colors: ['#f868f8', '#f888f8', '#f8a8f8', '#f8c8f8', '#f8e8f8']
          }
        },
        xaxis: {
          floating: true,
          labels: { show: false },
          min: 1,
          max: 30,
          axisBorder: { show: false }
        },
        yaxis: {
          floating: true,
          labels: { show: false },
          min: 0,
          max: 5,
          tickAmount: 5
        },
        stroke: { lineCap: 'round' },
        tooltip: { enabled: false },
        chart: {
          sparkline: { enabled: true },
          toolbar: { show: false }
        }
      }
    }
  },
  computed: {
    options: function () {
      const avgsLength = this.series[0].data.length
      const options = JSON.parse(JSON.stringify(this.optionsDefault))
      if (avgsLength > 30) {
        options.xaxis.max = avgsLength
      }
      return options
    },
    series: function () {
      return [{
        data: this.$store.state.app.avgs30
      }]
    }
  }
}
</script>
