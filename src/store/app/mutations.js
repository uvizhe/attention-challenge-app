export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}
