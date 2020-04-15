<template>
  <apexchart class="no-wrap" style="margin: -50px" type="line" width="120%" height="250" :options="options" :series="series" />
</template>

<script>
export default {
  name: 'TotalsChart',
  props: {
    data: Array
  },
  data () {
    return {
      options: {
        grid: { show: false },
        xaxis: {
          floating: true,
          type: 'datetime',
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          floating: true,
          labels: { show: false }
        },
        legend: {
          floating: true,
          position: 'left',
          offsetY: 10,
          fontSize: '16px'
        },
        tooltip: { enabled: false },
        chart: { toolbar: { show: false } }
      }
    }
  },
  computed: {
    series: function () {
      return [{
        // XXX: ПОПРОБУЙ НА ДЕСКТОПЕ!
        // XXX: ПОПРОБУЙ ВЫНУТЬ ИЗ КОМПОНЕНТА ОБРАТНО
        data: this.data.filter(i => true) // FIXME: IDK why it needs a copy of the data
      }]
    }
  }
}
</script>
