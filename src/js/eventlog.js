import moment from 'moment'

const TD = 'Today'
const YD = 'Yesterday'

export function makeEL (sessionsDict) {
  /* Convert sessions:
      { username0: [
        {
          date: YYYY-MM-DD,
          ts: unixtime,
          duration: minutes,
          score: number
        }, ...],
        username1: [...],
        ...
      }
     to eventlog:
      [{
        date: 'Today|Yesterday|date|_',
        ts: unixtime,
        user: username,
        min: minutes,
        score: number|_,
        week: thisWeekTotal|_
      }, ...]
  */
  sessionsDict = JSON.parse(JSON.stringify(sessionsDict))
  const eventlog = []
  if (isEmpty(sessionsDict)) {
    return eventlog
  }
  const leaders = populateWeekStats(sessionsDict)
  const sessions = combineSessions(sessionsDict)
  const today = moment().subtract(4, 'hours').format('YYYY-MM-DD')
  const twoDaysAgo = moment().subtract(2, 'days').format('YYYY-MM-DD')
  for (const session of sessions) {
    const date = calcDate(session.date, today, twoDaysAgo)
    const score = session.score !== undefined ? session.score : null
    eventlog.push({
      date: date,
      ts: session.ts,
      user: session.username,
      min: session.duration,
      score: score,
      week: session.week || '',
      leader: session.week && leaders.includes(session.username)
    })
  }
  removeDateDuplicates(eventlog)
  return eventlog
}

function isEmpty (sessionsDict) {
  if (!Object.keys(sessionsDict).length) {
    return true
  } else {
    for (const sessions of Object.values(sessionsDict)) {
      if (sessions.length) {
        return false
      }
    }
  }
  return true
}

function populateWeekStats (sessionsDict) {
  const weekStats = {}
  // TODO: let users choose the first day of week (Mon, Sun or Sat)
  // or, even better, guess from user locale.
  const weekAgo = moment().startOf('isoWeek').format('YYYY-MM-DD')
  for (const username in sessionsDict) {
    let weekTotal = 0
    for (const session of sessionsDict[username]) {
      if (session.date > weekAgo) {
        weekTotal += session.duration
      }
    }
    const lastSessionId = sessionsDict[username].length - 1
    sessionsDict[username][lastSessionId].week = weekTotalString(weekTotal)
    weekStats[username] = weekTotal
  }
  const leaders = nominateLeaders(weekStats)
  return leaders
}

function nominateLeaders (weekStats) {
  let leaders = []
  let topScore = 0
  for (const username in weekStats) {
    if (weekStats[username] > topScore) {
      topScore = weekStats[username]
      leaders = [username]
    } else if (weekStats[username] === topScore) {
      leaders.push(username)
    }
  }
  return leaders
}

function combineSessions (sessionsDict) {
  const sessions = []
  function compareSessions (a, b) {
    if (a.ts < b.ts) {
      return -1
    } else if (a.ts > b.ts) {
      return 1
    } else if (a.ts === b.ts && a.score !== undefined) {
      // user is always placed last in case of tied ts
      return 1
    }
    return 0
  }
  for (const username in sessionsDict) {
    if (!sessionsDict[username].length) continue
    for (const session of sessionsDict[username]) {
      session.username = username
      sessions.push(session)
    }
  }
  sessions.sort(compareSessions)
  return sessions
}

function calcDate (sessionDate, today, twoDaysAgo) {
  let date = sessionDate
  if (sessionDate === today) {
    date = TD
  } else if (sessionDate < today && sessionDate > twoDaysAgo) {
    date = YD
  }
  return date
}

function weekTotalString (weekTotalMinutes) {
  let weekTotalString
  if (weekTotalMinutes >= 60) {
    const hrs = weekTotalMinutes / 60
    weekTotalString = Math.floor(hrs).toString()
    if (hrs > Math.floor(hrs)) {
      weekTotalString += '+'
    }
    weekTotalString += ' hr'
  } else {
    weekTotalString = weekTotalMinutes + ' min'
  }
  return weekTotalString
}

/* XXX: Save for possible future use
export function displayDate (date, prevDate) {
  if (date === prevDate) {
    return ''
  } else {
    return date
  }
}
*/

function removeDateDuplicates (eventlog) {
  let isTDFound = false
  let isYDFound = false
  let date
  for (let i = 0; i < eventlog.length; i++) {
    let dup = false
    if (eventlog[i].date === TD) {
      if (!isTDFound) {
        isTDFound = true
      } else {
        dup = true
      }
    } else if (eventlog[i].date === YD) {
      if (!isYDFound) {
        isYDFound = true
      } else {
        dup = true
      }
    } else if (eventlog[i].date === date) {
      dup = true
    }
    date = eventlog[i].date
    if (dup) eventlog[i].date = ''
  }
}
