export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setTotalsChartUserData (state, totalsData) {
  state.totalsChartUserData = totalsData
}

export function setTotalsChartFriend0Data (state, totalsData) {
  state.totalsChartFriend0Data = totalsData
}

export function setTotalsChartFriends (state, users) {
  state.totalsChartFriends = users
}
