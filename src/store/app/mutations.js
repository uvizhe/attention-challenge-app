import { setAvgs30, setTotals } from '../../js/database'

export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setAvgs30ChartData (state, avgs30Data) {
  setAvgs30(avgs30Data)
  state.avgs30ChartData = avgs30Data
}

export function setTotalsChartUserData (state, totalsData) {
  setTotals(totalsData)
  state.totalsChartUserData = totalsData
}

export function setTotalsChartFriendData (state, payload) {
  switch (Number(payload.idx)) {
    case 0:
      state.totalsChartFriend0Data = payload.totalsData
      break
    case 1:
      state.totalsChartFriend1Data = payload.totalsData
      break
    case 2:
      state.totalsChartFriend2Data = payload.totalsData
      break
    case 3:
      state.totalsChartFriend3Data = payload.totalsData
      break
  }
}

export function setTotalsChartFriends (state, users) {
  state.totalsChartFriends = users
}
