<template>
  <div class="">
    <apexchart class="chart" type="line" :options="options" :series="series" />
    <q-fab
      :class="fabClass"
      @click="gotoAddUsers"
      icon="group_add"
      color="purple-5"
    />
  </div>
</template>

<script>
export default {
  name: 'TotalsChart',
  props: {
    data: Array
  },
  data () {
    return {
      fabVisible: false,
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
        stroke: { lineCap: 'round' },
        dataLabels: {
          enabled: true,
          offsetX: -2,
          offsetY: 5,
          textAnchor: 'end',
          formatter: (value, opts) => {
            if (opts.dataPointIndex === this.data.length - 1) {
              return value
            }
          }
        },
        legend: {
          floating: true,
          position: 'left',
          offsetY: 10,
          fontSize: '16px'
        },
        tooltip: { enabled: false },
        chart: {
          sparkline: { enabled: true },
          toolbar: { show: false },
          events: {
            click: () => { this.showAddUsersButton() }
          }
        }
      }
    }
  },
  computed: {
    fabClass: function () {
      if (this.fabVisible) {
        return 'absolute-center'
      } else {
        return 'hidden'
      }
    },
    series: function () {
      return [{
        // XXX: ПОПРОБУЙ НА ДЕСКТОПЕ!
        // XXX: ПОПРОБУЙ ВЫНУТЬ ИЗ КОМПОНЕНТА ОБРАТНО
        data: this.data.filter(i => true) // FIXME: IDK why it needs a copy of the data
      }]
    }
  },
  methods: {
    showAddUsersButton () {
      this.fabVisible = true
      setTimeout(() => {
        this.fabVisible = false
      }, 2000)
    },
    gotoAddUsers () {
      this.$router.push('/addusers')
    }
  }
}
</script>
