<template>
  <apexchart class="no-wrap" style="margin: -50px" type="line" width="120%" height="100" :options="options" :series="series" />
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
            colors: ['#f877f8', '#f899f8', '#f8bbf8', '#f8ddf8', '#ffffff']
          }
        },
        xaxis: {
          floating: true,
          labels: { show: false },
          axisBorder: { show: false }
        },
        yaxis: {
          floating: true,
          labels: { show: false },
          min: 0,
          max: 5,
          tickAmount: 5
        },
        tooltip: { enabled: false },
        chart: { toolbar: { show: false } }
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
