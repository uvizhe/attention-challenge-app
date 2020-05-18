export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setInitialized (state) {
  state.initialized = true
}

export function setAvgs30 (state, avgs30) {
  state.avgs30 = avgs30
}

export function setTotals (state, totals) {
  state.totals = totals
}

export function setFriends (state, friends) {
  state.friends = friends
}
