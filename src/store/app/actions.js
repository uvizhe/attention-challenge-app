import { Quasar } from 'quasar'
import {
  getConfig, saveConfig, getData, saveData
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
  saveConfig('locale', value)
  context.commit('setStateValue', {
    key: 'locale',
    value: value
  })
}

export function setLocaleIfNotSet (context) {
  if (!context.state.locale) {
    context.commit('setStateValue', {
      key: 'locale',
      value: Quasar.lang.getLocale()
    })
  }
}

export function setSessionDuration (context, value) {
  if (context.state.sessionDuration === value) return
  saveConfig('sessionDuration', value)
  context.commit('setStateValue', {
    key: 'sessionDuration',
    value: value
  })
}

export function setBellsDeferral (context, value) {
  if (context.state.bellsDeferral === value) return
  saveConfig('bellsDeferral', value)
  context.commit('setStateValue', {
    key: 'bellsDeferral',
    value: value
  })
}

export function setWakeLock (context, value) {
  if (context.state.wakeLock === value) return
  saveConfig('wakeLock', value)
  context.commit('setStateValue', {
    key: 'wakeLock',
    value: value
  })
}

export function setDNDMode (context, value) {
  if (context.state.dndMode === value) return
  saveConfig('dndMode', value)
  context.commit('setStateValue', {
    key: 'dndMode',
    value: value
  })
}

export function initData (context) {
  context.dispatch('maintenance')
  context.dispatch('restoreConfig')
  context.dispatch('restoreData')
  context.dispatch('setLocaleIfNotSet')
  context.commit('setInitialized')
}

export async function restoreConfig (context) {
  const config = getConfig()
  for (const [key, value] of Object.entries(config)) {
    context.commit('setStateValue', {
      key: key,
      value: value
    })
  }
}

export async function restoreData (context) {
  const data = getData()
  for (const [key, value] of Object.entries(data)) {
    context.commit('setStateValue', {
      key: key,
      value: value
    })
  }
}

export function setUsername (context, username) {
  saveConfig('username', username)
  context.commit('setStateValue', {
    key: 'username',
    value: username
  })
}

export async function reportSession (context, payload) {
  const stats = await postSession(payload.score, payload.duration)
  const ts = Math.floor(new Date().getTime() / 1000)
  let sessions = context.state.sessions
  let avgs = context.getters.avgsCopy
  if (!sessions.length) {
    // first ever session
    sessions = [{
      date: stats.date,
      ts: ts,
      duration: payload.duration
    }]
    avgs = [stats.average]
  } else {
    sessions.push({
      date: stats.date,
      ts: ts,
      duration: payload.duration
    })
    if (stats.date === context.state.lastSessionDate) {
      // new session this day
      avgs.pop()
    }
    avgs.push(stats.average)
    if (avgs.length > 90) {
      avgs = avgs.slice(-90)
    }
  }
  saveData('lastSessionDate', stats.date)
  context.commit('setStateValue', {
    key: 'lastSessionDate',
    value: stats.date
  })
  saveData('sessions', sessions)
  context.commit('setStateValue', {
    key: 'sessions',
    value: sessions
  })
  saveData('avgs', avgs)
  context.commit('setStateValue', {
    key: 'avgs',
    value: avgs
  })
}

export async function fetchStats (context) {
  const stats = await getStats()
  if (stats.averages.length) {
    const lastSessionDate = stats.sessions.slice(-1).pop().date
    saveData('lastSessionDate', lastSessionDate)
    saveData('sessions', stats.sessions)
    saveData('avgs', stats.averages)
    context.commit('setStateValue', {
      key: 'lastSessionDate',
      value: lastSessionDate
    })
    context.commit('setStateValue', {
      key: 'sessions',
      value: stats.sessions
    })
    context.commit('setStateValue', {
      key: 'avgs',
      value: stats.averages
    })
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
  saveData('friends', newFriends)
  context.commit('setStateValue', {
    key: 'friends',
    value: newFriends
  })
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
