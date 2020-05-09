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
