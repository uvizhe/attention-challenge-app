export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setConfig (state, { parameter, value }) {
  state[parameter] = value
}

export function setInitialized (state) {
  state.initialized = true
}

export function setLastSessionDate (state, date) {
  state.lastSessionDate = date
}

export function setAvgs (state, avgs) {
  state.avgs = avgs
}

export function setFriends (state, friends) {
  state.friends = friends
}
