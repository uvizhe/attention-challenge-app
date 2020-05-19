import {
  getAvgs30, getTotals, getStats, getFriends,
  saveAvgs30, saveTotals, saveFriends,
  postSession, getFriendTotals,
  saveConfig, getConfig
} from '../../js/database'
import {
  appendValues, addSeries, removeSeries
} from '../../js/series'

export function setWakeLock (context, value) {
  context.commit('setConfig', { parameter: 'wakeLock', value: value })
  saveConfig('wakeLock', value)
}

export function initData (context) {
  context.dispatch('restoreConfig')
  context.commit('setAvgs30', getAvgs30())
  context.commit('setTotals', getTotals())
  context.commit('setFriends', getFriends())
  context.dispatch('syncWithFriends')
  context.commit('setInitialized')
}

export async function restoreConfig (context) {
  const config = getConfig()
  for (const [key, value] of Object.entries(config)) {
    context.commit('setConfig', { parameter: key, value: value })
  }
}

export async function syncWithFriends (context) {
  let totals = context.state.totals
  const friends = context.state.friends
  const lastDate = Object.keys(totals).sort().pop()
  for (let i = 0; i < friends.length; i++) {
    totals = appendValues(
      totals,
      await getFriendTotals(friends[i], lastDate),
      i + 1
    )
  }
  context.commit('setTotals', totals)
  saveTotals(context.state.totals)
}

export async function reportSession (context, score) {
  const stats = await postSession(score)
  let avgs30 = context.getters.avgs30Copy
  let totals = context.state.totals
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
  totals = appendValues(totals, stats.total)
  context.commit('setAvgs30', avgs30)
  context.commit('setTotals', totals)
  saveAvgs30(context.state.avgs30)
  saveTotals(context.state.totals)
}

export async function fetchStats (context) {
  const stats = await getStats()
  let totals = {}
  if (stats.averages.length) {
    context.commit('setAvgs30', stats.averages)
    totals = addSeries(
      context.state.totals,
      stats.totals,
      0
    )
    context.commit('setTotals', totals)
    saveAvgs30(context.state.avgs30)
    saveTotals(context.state.totals)
  }
}

export async function addFriends (context, friends) {
  const prevFriends = context.state.friends
  const newFriends = friends.sort()
  if (prevFriends.length === newFriends.length &&
    prevFriends.every((val, idx) => val === newFriends[idx])) {
    // if all the friends are the same
    return
  }
  context.commit('setFriends', newFriends)
  saveFriends(newFriends)
  let totals = context.state.totals
  // check for removed friends
  for (let i = 0; i < prevFriends.length; i++) {
    if (!newFriends.includes(prevFriends[i])) {
      totals = removeSeries(totals, i + 1)
    }
  }
  for (let i = 0; i < newFriends.length; i++) {
    if (prevFriends.includes(newFriends[i])) {
      continue // skip this friend as we already have it in totals
    }
    totals = addSeries(
      totals,
      await getFriendTotals(newFriends[i]),
      i + 1
    )
  }
  context.commit('setTotals', totals)
  saveTotals(context.state.totals)
}
