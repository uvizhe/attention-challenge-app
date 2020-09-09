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

export function setInitialized (state) {
  state.initialized = true
}
