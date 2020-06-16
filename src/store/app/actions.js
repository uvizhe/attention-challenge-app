import { Quasar } from 'quasar'
import {
  getAvgs, getTotals, getFriends,
  saveAvgs, saveTotals, saveFriends,
  saveConfig, getConfig
} from '../../js/localdb'
import {
  getStats, getFriendTotals, postSession
} from '../../js/remotedb'
import {
  appendValues, addSeries, removeSeries
} from '../../js/series'
import { updateChartsData } from '../../js/maintenance'

export function maintenance (context) {
  updateChartsData()
}

export function setLocale (context, value) {
  if (context.state.locale === value) return
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
  if (context.state.sessionDuration === value) return
  context.commit('setConfig', { parameter: 'sessionDuration', value: value })
  saveConfig('sessionDuration', value)
}

export function setBellsDeferral (context, value) {
  if (context.state.bellsDeferral === value) return
  context.commit('setConfig', { parameter: 'bellsDeferral', value: value })
  saveConfig('bellsDeferral', value)
}

export function setWakeLock (context, value) {
  if (context.state.wakeLock === value) return
  context.commit('setConfig', { parameter: 'wakeLock', value: value })
  saveConfig('wakeLock', value)
}

export function initData (context) {
  context.dispatch('maintenance')
  context.dispatch('restoreConfig')
  context.dispatch('setLocaleIfNotSet')
  context.commit('setAvgs', getAvgs())
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
  let avgs = context.getters.avgsCopy
  let totals = context.state.totals
  if (!avgs.length) {
    // first ever session
    avgs = [stats.average]
  } else {
    if (stats.date in totals) {
      // new session this day
      avgs.pop()
    }
    avgs.push(stats.average)
    if (avgs.length > 90) {
      avgs = avgs.slice(-90)
    }
  }
  totals = appendValues(totals, stats.total)
  context.commit('setAvgs', avgs)
  context.commit('setTotals', totals)
  saveAvgs(context.state.avgs)
  saveTotals(context.state.totals)
}

export async function fetchStats (context) {
  const stats = await getStats()
  let totals = {}
  if (stats.averages.length) {
    context.commit('setAvgs', stats.averages)
    totals = addSeries(
      context.state.totals,
      stats.totals,
      0
    )
    context.commit('setTotals', totals)
    saveAvgs(context.state.avgs)
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
