import {
  getAvgs30, getTotals, postSession, getFriendTotals, saveFriends
} from '../../js/database'

export async function reportSession (context, score) {
  const stats = await postSession(score)
  let avgs30 = getAvgs30()
  let totals = getTotals()
  if (!avgs30.length) {
    // first ever session
    avgs30 = [stats.average]
  } else {
    if (stats.date in totals) {
      // new session this day
      avgs30.pop()
    }
    avgs30.push(stats.average)
    if (avgs30.length > 30) {
      avgs30 = avgs30.slice(-30)
    }
  }
  if (!Object.keys(totals).length) {
    totals = stats.total
  } else {
    Object.assign(totals, stats.total)
  }
  context.commit('setAvgs30ChartData', avgs30)
  context.commit('setTotalsChartUserData', totals)
}

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
