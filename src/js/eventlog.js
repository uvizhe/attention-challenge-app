import moment from 'moment'

const TD = 'Today'
const YD = 'Yesterday'

export function userDate () {
  return moment().subtract(4, 'hours').format('YYYY-MM-DD')
}

export function makeEL (sessionsDict, startOfWeekDay) {
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
        week: thisWeekTotal|_,
        weekUnit: 'min|hr',
        leader: bool
      }, ...]
  */
  sessionsDict = JSON.parse(JSON.stringify(sessionsDict))
  const eventlog = []
  if (isEmpty(sessionsDict)) {
    return eventlog
  }
  const leaders = populateWeekStats(sessionsDict, startOfWeekDay)
  const sessions = combineSessions(sessionsDict)
  const today = userDate()
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
      week: session.week,
      weekUnit: session.weekUnit,
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

function populateWeekStats (sessionsDict, startOfWeekDay) {
  const weekStats = {}
  const weekStartShift = { 1: 0, 0: 1, 6: 2 }
  const weekStart = moment().startOf('isoWeek')
    .subtract(weekStartShift[startOfWeekDay], 'days')
    .locale('en').format('YYYY-MM-DD')
  for (const username in sessionsDict) {
    if (!sessionsDict[username].length) continue
    let weekTotal = 0
    for (const session of sessionsDict[username]) {
      if (session.date >= weekStart) {
        weekTotal += session.duration
      }
    }
    const lastSessionId = sessionsDict[username].length - 1
    const weekData = weekTotalData(weekTotal)
    sessionsDict[username][lastSessionId].week = weekData[0]
    sessionsDict[username][lastSessionId].weekUnit = weekData[1]
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
    } else if (weekStats[username] === topScore && topScore !== 0) {
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

function weekTotalData (weekTotalMinutes) {
  let weekTotal
  let weekTotalUnit
  if (weekTotalMinutes >= 60) {
    const hrs = weekTotalMinutes / 60
    weekTotal = Math.floor(hrs).toString()
    if (hrs > Math.floor(hrs)) {
      weekTotal += '+'
    }
    weekTotalUnit = 'hr'
  } else {
    weekTotal = weekTotalMinutes
    weekTotalUnit = 'min'
  }
  return [weekTotal, weekTotalUnit]
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
