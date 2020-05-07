<template>
  <div class="">
    <apexchart class="chart" type="line" :options="options" :series="series" />
    <q-btn
      round
      :class="btnClass"
      :disable="!btnClickable"
      size="large"
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
      btnVisible: false,
      btnClickable: false,
      btnTimer: null,
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
    btnClass: function () {
      if (this.btnVisible) {
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
      if (!this.btnVisible) {
        if (this.btnTimer) {
          clearTimeout(this.btnTimer)
        }
        setTimeout(() => { // this design is due to @click fires twice it seems
          this.btnVisible = true
          this.btnClickable = true
        }, 10)
        this.btnTimer = setTimeout(() => {
          this.btnVisible = false
          this.btnClickable = false
        }, 2000)
      } else {
        if (this.btnTimer) {
          clearTimeout(this.btnTimer)
        }
        setTimeout(() => {
          this.btnVisible = false
          this.btnClickable = false
        }, 10)
      }
    },
    gotoAddUsers () {
      this.$router.push('/addusers')
    }
  }
}
</script>
