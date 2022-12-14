export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setStateValue (state, { key, value }) {
  state[key] = value
}

export function setNewUser (state, bool = true) {
  state.newUser = bool
}

export function setOffline (state, offline = true) {
  state.offline = offline
}

export function setInitialized (state) {
  state.initialized = true
}

export function toggleFriends (state) {
  state.showFriends = !state.showFriends
}
