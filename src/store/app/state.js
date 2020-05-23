export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    /* Config variables BEGIN */
    wakeLock: false,
    username: '',
    /* Config variables END */
    initialized: false,
    // TODO: move these below to config variables
    avgs30: [],
    totals: {},
    friends: []
  }
}
