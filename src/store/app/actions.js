import { getFriendTotals } from '../../js/database'

export async function addUsersToTotalsChart (context, users) {
  console.log('users: ' + users)
  context.commit('setTotalsChartFriends', users)
  context.commit('setTotalsChartFriend0Data', await getFriendTotals(users[0]))
  console.log(context.state.totalsChartFriends[0])
  console.log(context.state.totalsChartFriends[1])
  console.log(context.state.totalsChartFriend0Data)
}
