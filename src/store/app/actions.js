import { Quasar } from 'quasar'
import {
  getAvgs30, getTotals, getFriends,
  saveAvgs30, saveTotals, saveFriends,
  saveConfig, getConfig
} from '../../js/localdb'
import {
  getStats, getFriendTotals, postSession
} from '../../js/remotedb'
import {
  appendValues, addSeries, removeSeries
} from '../../js/series'

export function setLocale (context, value) {
  context.commit('setConfig', { parameter: 'locale', value: value })
  saveConfig('locale', value)
}

export function setLocaleIfNotSet (context) {
  if (!context.state.locale) {
    context.commit('setConfig', {
      parameter: 'locale',
      value: Quasar.lang.getLocale()
    })
  }
}

export function setSessionDuration (context, value) {
  context.commit('setConfig', { parameter: 'sessionDuration', value: value })
  saveConfig('sessionDuration', value)
}

export function setWakeLock (context, value) {
  context.commit('setConfig', { parameter: 'wakeLock', value: value })
  saveConfig('wakeLock', value)
}

export function initData (context) {
  context.dispatch('restoreConfig')
  context.dispatch('setLocaleIfNotSet')
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

export function setUsername (context, username) {
  context.commit('setConfig', { parameter: 'username', value: username })
  saveConfig('username', username)
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

export async function reportSession (context, payload) {
  const stats = await postSession(payload.score, payload.duration)
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
