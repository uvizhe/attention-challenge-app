import { Quasar } from 'quasar'
import {
  getLastSessionDate, saveLastSessionDate,
  getAvgs, saveAvgs, getFriends, saveFriends,
  getConfig, saveConfig
} from '../../js/localdb'
import {
  getStats, postSession
} from '../../js/remotedb'
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

export function setDNDMode (context, value) {
  if (context.state.dndMode === value) return
  context.commit('setConfig', { parameter: 'dndMode', value: value })
  saveConfig('dndMode', value)
}

export function initData (context) {
  context.dispatch('maintenance')
  context.dispatch('restoreConfig')
  context.dispatch('setLocaleIfNotSet')
  context.commit('setLastSessionDate', getLastSessionDate())
  context.commit('setAvgs', getAvgs())
  context.commit('setFriends', getFriends())
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

export async function reportSession (context, payload) {
  const stats = await postSession(payload.score, payload.duration)
  let avgs = context.getters.avgsCopy
  if (!avgs.length) {
    // first ever session
    avgs = [stats.average]
  } else {
    if (stats.date === context.state.lastSessionDate) {
      // new session this day
      avgs.pop()
    }
    avgs.push(stats.average)
    if (avgs.length > 90) {
      avgs = avgs.slice(-90)
    }
  }
  context.commit('setLastSessionDate', stats.date)
  saveLastSessionDate(context.state.lastSessionDate)
  context.commit('setAvgs', avgs)
  saveAvgs(context.state.avgs)
}

export async function fetchStats (context) {
  const stats = await getStats()
  if (stats.averages.length) {
    context.commit('setAvgs', stats.averages)
    saveAvgs(context.state.avgs)
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
  // check for removed friends
  for (let i = 0; i < prevFriends.length; i++) {
    if (!newFriends.includes(prevFriends[i])) {
      // pass
    }
  }
  for (let i = 0; i < newFriends.length; i++) {
    if (prevFriends.includes(newFriends[i])) {
      continue // skip this friend as we already have it
    }
    // pass
  }
  // pass
}
