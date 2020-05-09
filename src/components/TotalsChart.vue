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
    <q-card flat class="absolute-top-left">
      <q-card-section>
        <div class="text-primary">
          me
        </div>
        <div class="text-green">
          you
        </div>
      </q-card-section>
    </q-card>
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
          type: 'datetime',
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
          offsetY: 5,
          textAnchor: 'end',
          formatter: (value, opts) => {
            const dataSeries = this.series[opts.seriesIndex].data
            if (opts.dataPointIndex === dataSeries.length - 1) {
              return value
            }
          }
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
      const series = [
        {
          name: 'me',
          data: this.$store.state.app.totalsChartUserData.slice()
          // Apex chart somehow interfers with data so we need a copy
          // to avoid unintentional Vuex state changes.
        }
      ]
      const friends = this.$store.state.app.totalsChartFriends
      if (friends.length) {
        series.push({
          name: friends[0],
          data: this.$store.state.app.totalsChartFriend0Data.slice()
        })
      }
      if (friends.length > 1) {
        series.push({
          name: friends[1],
          data: this.$store.state.app.totalsChartFriend1Data.slice()
        })
      }
      if (friends.length > 2) {
        series.push({
          name: friends[2],
          data: this.$store.state.app.totalsChartFriend2Data.slice()
        })
      }
      if (friends.length > 3) {
        series.push({
          name: friends[3],
          data: this.$store.state.app.totalsChartFriend3Data.slice()
        })
      }
      return series
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
