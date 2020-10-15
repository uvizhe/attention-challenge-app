import { Quasar } from 'quasar'
import {
  getConfig, saveConfig, getData, saveData
} from '../../js/localdb'
import {
  getServerData, setProfilePublic, getStats,
  getSessions, postSession, getPublicStatus
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
  context.dispatch('syncServerData')
  context.dispatch('syncWithFriends')
  context.commit('setInitialized')
}

export function restoreConfig (context) {
  const config = getConfig()
  for (const [key, value] of Object.entries(config)) {
    context.commit('setStateValue', {
      key: key,
      value: value
    })
  }
}

export function restoreData (context) {
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

export async function setPublicProfile (context, isPublic) {
  await setProfilePublic(isPublic)
  saveConfig('publicProfile', isPublic)
  context.commit('setStateValue', {
    key: 'publicProfile',
    value: isPublic
  })
}

export async function syncServerData (context) {
  if (context.state.offline) return
  const data = await getServerData()
  for (let key of Object.keys(data)) {
    const value = data[key]
    if (key === 'public') key = 'publicProfile'
    saveConfig(key, value)
    context.commit('setStateValue', {
      key: key,
      value: value
    })
  }
}

export async function reportSession (context, payload) {
  if (context.state.offline) {
    // save session locally
  }
  const stats = await postSession(payload.score, payload.duration)
  console.log(JSON.stringify(stats))
  const ts = Math.floor(Date.now() / 1000)
  let sessions = context.getters.sessionsCopy
  let avgs = context.getters.avgsCopy
  if (!sessions.length) {
    // first ever session
    sessions = [{
      date: stats.date,
      ts: ts,
      duration: payload.duration,
      score: payload.score
    }]
    avgs = [stats.average]
  } else {
    sessions.push({
      date: stats.date,
      ts: ts,
      duration: payload.duration,
      score: payload.score
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
  if (context.state.offline) return
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
  const prevFriends = context.getters.friends
  const newFriends = friends.sort()
  if (prevFriends.length === newFriends.length &&
    prevFriends.every((val, idx) => val === newFriends[idx])) {
    // if all the friends are the same
    return
  }
  const friendsSessions = context.getters.friendsSessionsCopy
  // check for removed friends
  for (const username of prevFriends) {
    if (!newFriends.includes(username)) {
      delete friendsSessions[username]
    }
  }
  for (const username of newFriends) {
    if (prevFriends.includes(username)) {
      continue // skip this friend as we already have it
    }
    friendsSessions[username] = await getSessions(username)
  }
  saveData('friendsSessions', friendsSessions)
  context.commit('setStateValue', {
    key: 'friendsSessions',
    value: friendsSessions
  })
}

export async function syncWithFriends (context) {
  if (context.state.offline) return
  const friendsSessions = context.getters.friendsSessionsCopy
  const friends = context.getters.friends
  // TODO: Check if friends are still public
  if (Object.keys(friendsSessions).length) {
    const publicArray = await getPublicStatus(friends)
    for (const idx in publicArray) {
      if (!publicArray[idx]) { // friend is not public anymore
        delete friendsSessions[friends[idx]]
      }
    }
    for (const username in friendsSessions) {
      const lastSession = friendsSessions[username].slice(-1).pop()
      const sessions = await getSessions(
        username, lastSession.date, lastSession.ts
      )
      friendsSessions[username].push(...sessions)
    }
    saveData('friendsSessions', friendsSessions)
    context.commit('setStateValue', {
      key: 'friendsSessions',
      value: friendsSessions
    })
  }
  const ts = Math.floor(Date.now() / 1000)
  saveData('prevSyncTime', context.state.lastSyncTime)
  context.commit('setStateValue', {
    key: 'prevSyncTime',
    value: context.state.lastSyncTime
  })
  saveData('lastSyncTime', ts)
  context.commit('setStateValue', {
    key: 'lastSyncTime',
    value: ts
  })
}
