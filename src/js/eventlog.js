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
        user: username,
        min: minutes,
        score: number|_,
        week: thisWeekTotal|_
      }, ...]
  */
  const eventlog = []
  if (!Object.keys(sessionsDict).length) {
    return eventlog
  }
  populateWeekStats(sessionsDict)
  const sessions = combineSessions(sessionsDict)
  const today = moment().subtract(4, 'hours').format('YYYY-MM-DD')
  const twoDaysAgo = moment().subtract(2, 'days').format('YYYY-MM-DD')
  for (const session of sessions) {
    const date = calcDate(session.date, today, twoDaysAgo)
    const score = session.score !== undefined ? session.score : null
    eventlog.push({
      date: date,
      user: session.username,
      min: session.duration,
      score: score,
      week: session.week || ''
    })
  }
  removeDateDuplicates(eventlog)
  return eventlog
}

function populateWeekStats (sessionsDict) {
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
  }
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
