export function sessionsCopy (state) {
  return state.sessions.slice()
}

export function avgsCopy (state) {
  return state.avgs.slice()
}

export function friends (state) {
  return Object.keys(state.friendsSessions)
}

export function friendsSessionsCopy (state) {
  return JSON.parse(JSON.stringify(state.friendsSessions))
}

export function offlineSessionsCopy (state) {
  return state.offlineSessions.slice()
}
