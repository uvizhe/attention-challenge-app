export function sessionsCopy (state) {
  return state.sessions.slice()
}

export function avgsCopy (state) {
  return state.avgs.slice()
}

export function friendsSessionsCopy (state) {
  return { ...Object.assign(state.friendsSessions) }
}
