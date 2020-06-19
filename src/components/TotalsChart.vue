<template>
  <div class="">
    <apexchart class="chart" type="area" :options="options" :series="series" />
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
  data () {
    return {
      btnVisible: false,
      btnClickable: false,
      btnTimer: null,
      options: {
        grid: { show: false },
        xaxis: {
          floating: true,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          floating: true,
          labels: { show: false }
        },
        stroke: {
          curve: 'straight',
          lineCap: 'round'
        },
        dataLabels: {
          enabled: true,
          offsetX: -2,
          textAnchor: 'end',
          formatter: (value, { seriesIndex, dataPointIndex }) => {
            return this.dataPointLabel(value, seriesIndex, dataPointIndex)
          }
        },
        tooltip: { enabled: false },
        chart: {
          sparkline: { enabled: true },
          toolbar: { show: false },
          events: {
            click: () => { this.showAddUsersButton() }
          }
        },
        noData: {
          text: this.$t('totalsChartPlaceholder'),
          offsetY: -10,
          style: { color: '#ab47bc' }
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
      const series = [
        {
          name: 'me',
          data: this.getSeries(0)
        }
      ]
      const friends = this.$store.state.app.friends
      if (friends.length) {
        series.push({
          name: friends[0],
          data: this.getSeries(1)
        })
      }
      if (friends.length > 1) {
        series.push({
          name: friends[1],
          data: this.getSeries(2)
        })
      }
      if (friends.length > 2) {
        series.push({
          name: friends[2],
          data: this.getSeries(3)
        })
      }
      if (friends.length > 3) {
        series.push({
          name: friends[3],
          data: this.getSeries(4)
        })
      }
      return series
    }
  },
  methods: {
    getSeries (pos) {
      const multiUserSeries = this.$store.state.app.totals
      return Object.keys(multiUserSeries).sort()
        .map(date => multiUserSeries[date][pos])
    },
    dataPointLabel (value, seriesIndex, dataPointIndex) {
      const dataSeries = this.series[seriesIndex].data
      const name = this.series[seriesIndex].name
      const friendsAmount = this.series.length - 1
      const seriesLength = dataSeries.length
      const offset = Math.floor(0.15 * seriesLength) || 1
      const spaceRequired = friendsAmount * offset
      if (dataPointIndex === dataSeries.length - 1) {
        if (name !== 'me' && spaceRequired >= 2 / 3 * seriesLength) {
          return name + '(' + value + ')'
        } else {
          return value
        }
      } else if (name !== 'me') {
        if (spaceRequired < 2 / 3 * seriesLength) {
          const spot = seriesLength - offset * seriesIndex - 1
          if (dataPointIndex === spot) {
            return name
          }
        }
      }
    },
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
      this.$router.push('/app/addusers')
    }
  }
}
</script>
