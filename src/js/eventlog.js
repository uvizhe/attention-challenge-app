import moment from 'moment'

const TD = 'Today'
const YD = 'Yesterday'

export function makeEL (sessions) {
  /* Convert sessions:
      [{
        date: YYYY-MM-DD,
        ts: unixtime,
        duration: minutes,
        score: number
      }, ...]
     to eventlog:
      [{
        date: 'Todate|Yesterdate|Earlier|_',
        min: minutes,
        score: number,
        week: thisWeekTotal|_
      }, ...]
  */
  const eventlog = []
  if (!sessions.length) {
    return eventlog
  }
  const today = moment().subtract(4, 'hours').format('YYYY-MM-DD')
  const twoDaysAgo = moment().subtract(2, 'days').format('YYYY-MM-DD')
  // TODO: let users choose the first day of week (Mon, Sun or Sat)
  // or, even better, guess from user locale.
  const weekAgo = moment().startOf('isoWeek').format('YYYY-MM-DD')
  let weekTotal = 0
  for (const s of sessions) {
    const date = calcDate(s.date, today, twoDaysAgo)
    if (s.date > weekAgo) {
      weekTotal += s.duration
    }
    eventlog.push({
      date: date,
      min: s.duration,
      score: s.score,
      week: ''
    })
  }
  const lastId = eventlog.length - 1
  eventlog[lastId].week = weekTotalString(weekTotal)
  removeDateDuplicates(eventlog)
  return eventlog
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
