import { Quasar } from 'quasar'
import {
  getConfig, saveConfig, getData, saveData
} from '../../js/localdb'
import {
  getServerData, setProfilePublic, getStats,
  getSessions, postSession, getPublicStatus,
  postSessions, authorize
} from '../../js/remotedb'
import { userDate } from '../../js/eventlog'
import { updateChartsData } from '../../js/maintenance'

export function maintenance (context) {
  updateChartsData()
}

export function setSoundVolume (context, value) {
  if (context.state.soundVolume === value) return
  saveConfig('soundVolume', value)
  context.commit('setStateValue', {
    key: 'soundVolume',
    value: value
  })
}

export function setLocale (context, value) {
  if (context.state.locale === value) return
  saveConfig('locale', value)
  context.commit('setStateValue', {
    key: 'locale',
    value: value
  })
}

export function setStartOfWeekDay (context, value) {
  if (context.state.startOfWeekDay === value) return
  saveConfig('startOfWeekDay', value)
  context.commit('setStateValue', {
    key: 'startOfWeekDay',
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

export async function initData (context) {
  context.dispatch('maintenance')
  context.dispatch('restoreConfig')
  context.dispatch('restoreData')
  context.dispatch('setLocaleIfNotSet')
  context.dispatch('syncServerData')
  context.dispatch('routineTasks')
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
  try {
    await setProfilePublic(isPublic)
  } catch (e) {
    context.commit('setOffline')
    return
  }
  saveConfig('publicProfile', isPublic)
  context.commit('setStateValue', {
    key: 'publicProfile',
    value: isPublic
  })
}

export async function syncServerData (context) {
  let data = {}
  try {
    data = await getServerData()
    if (context.state.offline) {
      context.commit('setOffline', false)
    }
  } catch (e) {
    context.commit('setOffline')
    return
  }
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

export async function routineTasks (context) {
  if (context.state.offlineSessions.length) {
    try {
      await authorize()
      if (context.state.offline) {
        context.commit('setOffline', false)
      }
    } catch (e) {
      context.commit('setOffline')
    }
    if (!context.state.offline) {
      await context.dispatch('reportOfflineSessions')
      context.dispatch('fetchStats')
    }
  }
  context.dispatch('updateLastActionTime')
  context.dispatch('syncWithFriends')
}

export async function reportSession (context, payload) {
  try {
    await postSession(payload.score, payload.duration)
    if (context.state.offline) {
      context.commit('setOffline', false)
    }
  } catch (e) {
    context.commit('setOffline')
  }
  const date = userDate()
  const ts = Math.floor(Date.now() / 1000)
  let sessionsToday = context.state.sessionsToday
  let sessions = context.getters.sessionsCopy
  let avgs = context.getters.avgsCopy
  const session = {
    date: date,
    ts: ts,
    duration: payload.duration,
    score: payload.score
  }
  if (!sessions.length) {
    // first ever session
    sessions = [session]
    avgs = [payload.score]
  } else {
    let average
    if (date === context.state.lastSessionDate) {
      // new session this day
      average = avgs.pop()
      average =
        (average * sessionsToday + payload.score) /
          (sessionsToday + 1)
      sessionsToday += 1
    } else {
      // first session this day
      average = payload.score
      sessionsToday = 1
    }
    sessions.push(session)
    avgs.push(average)
    if (avgs.length > 90) {
      avgs = avgs.slice(-90)
    }
  }
  saveData('lastSessionDate', date)
  context.commit('setStateValue', {
    key: 'lastSessionDate',
    value: date
  })
  saveData('sessionsToday', sessionsToday)
  context.commit('setStateValue', {
    key: 'sessionsToday',
    value: sessionsToday
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
  if (context.state.offline) {
    const offlineSessions = context.getters.offlineSessionsCopy
    offlineSessions.push(session)
    saveData('offlineSessions', offlineSessions)
    context.commit('setStateValue', {
      key: 'offlineSessions',
      value: offlineSessions
    })
  }
}

export async function reportOfflineSessions (context) {
  let result = {}
  try {
    result = await postSessions(context.state.offlineSessions)
  } catch (e) {
    context.commit('setOffline')
    return
  }
  if (result.status === 'ok') {
    saveData('offlineSessions', [])
    context.commit('setStateValue', {
      key: 'offlineSessions',
      value: []
    })
  }
}

export async function fetchStats (context) {
  let stats = {}
  try {
    stats = await getStats()
    if (context.state.offline) {
      context.commit('setOffline', false)
    }
  } catch (e) {
    context.commit('setOffline')
    return
  }
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
    try {
      friendsSessions[username] = await getSessions(username)
    } catch (e) {
      context.commit('setOffline')
      break
    }
  }
  if (context.state.offline) {
    for (const username of newFriends) {
      friendsSessions[username] = []
    }
  }
  saveData('friendsSessions', friendsSessions)
  context.commit('setStateValue', {
    key: 'friendsSessions',
    value: friendsSessions
  })
}

export function updateLastActionTime (context) {
  const ts = Math.floor(Date.now() / 1000)
  saveData('lastActionTime', ts)
  context.commit('setStateValue', {
    key: 'lastActionTime',
    value: ts
  })
}

export async function syncWithFriends (context) {
  const friendsSessions = context.getters.friendsSessionsCopy
  const friends = context.getters.friends
  if (Object.keys(friendsSessions).length) {
    let publicArray = []
    try {
      publicArray = await getPublicStatus(friends)
      if (context.state.offline) {
        context.commit('setOffline', false)
      }
    } catch (e) {
      context.commit('setOffline')
      return
    }
    for (const idx in publicArray) {
      if (!publicArray[idx]) { // friend is not public anymore
        delete friendsSessions[friends[idx]]
      }
    }
    for (const username in friendsSessions) {
      const lastSession = friendsSessions[username].slice(-1).pop()
      let sessions = []
      try {
        if (lastSession) {
          sessions = await getSessions(
            username, lastSession.date, lastSession.ts
          )
        } else {
          sessions = await getSessions(username)
        }
      } catch (e) {
        context.commit('setOffline')
      }
      friendsSessions[username].push(...sessions)
    }
    saveData('friendsSessions', friendsSessions)
    context.commit('setStateValue', {
      key: 'friendsSessions',
      value: friendsSessions
    })
  }
  if (context.state.offline) return
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
