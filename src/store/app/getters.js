export function sessionsCopy (state) {
  return state.sessions.slice()
}

export function avgsCopy (state) {
  return state.avgs.slice()
}

export function friendsSessionsCopy (state) {
  return JSON.parse(JSON.stringify(state.friendsSessions))
}

export function referenceSyncTime (state) {
  if (state.lastSyncTime > state.initialSyncTime) {
    return state.initialSyncTime
  }
  return state.lastSyncTime
}
