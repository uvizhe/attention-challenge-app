import { getFriendTotals } from '../../js/database'

export async function addUsersToTotalsChart (context, users) {
  context.commit('setTotalsChartFriends', users)
  for (const i in users) {
    context.commit('setTotalsChartFriendData', {
      idx: i,
      totalsData: await getFriendTotals(users[i])
    })
  }
}
