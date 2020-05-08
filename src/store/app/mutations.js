export function setPageHeaderVisible (state, title) {
  state.pageHeaderTitle = title
  state.pageHeader = true
}

export function setPageHeaderInvisible (state) {
  state.pageHeaderTitle = ''
  state.pageHeader = false
}

export function setTotalsChartUser0Data (state, totalsData) {
  state.totalsChartUser0Data = totalsData
}
