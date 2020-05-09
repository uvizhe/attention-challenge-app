import { getFriendTotals, saveFriends } from '../../js/database'

export async function addUsersToTotalsChart (context, users) {
  const prevFriends = context.state.totalsChartFriends
  const newFriends = users.sort()
  if (prevFriends.length === newFriends.length &&
    prevFriends.every((val, idx) => val === newFriends[idx])) {
    return
  }
  context.commit('setTotalsChartFriends', newFriends)
  saveFriends(newFriends)
  for (const i in newFriends) {
    context.commit('setTotalsChartFriendData', {
      idx: i,
      totalsData: await getFriendTotals(newFriends[i])
    })
  }
}
