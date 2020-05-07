<template>
  <div>
    <apexchart class="chart" type="line" height="100" :options="options" :series="series" />
  </div>
</template>

<script>
export default {
  name: 'Avgs30Chart',
  props: {
    data: Array
  },
  data () {
    return {
      options: {
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
    series: function () {
      return [{
        data: this.data
      }]
    }
  }
}
</script>
