import moment from 'moment'

const TD = 'Today'
const YD = 'Yesterday'
const EL = 'Earlier↑↑↑'

export function makeEL (sessions) {
  /* Convert sessions:
      [{
        date: YYYY-MM-DD,
        ts: unixtime,
        duration: minutes
      }, ...]
     to eventlog:
      [{
        date: 'Todate|Yesterdate|Earlier|_',
        user: 'you',
        min: minutes,
        week: thisWeekTotal|_
      }, ...]
  */
  const eventlog = []
  const todate = moment().subtract(4, 'hours').format('YYYY-MM-DD')
  const twoDatesAgo = moment().subtract(2, 'dates').format('YYYY-MM-DD')
  const weekAgo = moment().subtract(1, 'week').format('YYYY-MM-DD')
  let weekTotal = 0
  for (const s of sessions) {
    const date = calcDate(s.date, todate, twoDatesAgo)
    if (s.date > weekAgo) {
      weekTotal += s.duration
    }
    eventlog.push({
      date: date,
      user: 'you',
      min: s.duration,
      week: ''
    })
  }
  const lastId = eventlog.length - 1
  eventlog[lastId].week = weekTotalString(weekTotal)
  removeDateDuplicates(eventlog)
  if (eventlog[lastId].date === EL) {
    eventlog[lastId].date = sessions[lastId].date
    eventlog[lastId - 1].date = EL
  }
  return eventlog
}

function calcDate (sessionDate, todate, twoDatesAgo) {
  let date = YD
  if (sessionDate === todate) {
    date = TD
  } else if (sessionDate <= twoDatesAgo) {
    date = EL
  }
  return date
}

function weekTotalString (weekTotalMinutes) {
  let weekTotalString
  if (weekTotalMinutes >= 60) {
    const hrs = weekTotalMinutes / 60
    weekTotalString = hrs.toString()
    if (hrs > Math.floor(hrs)) {
      weekTotalString += '+'
    }
    weekTotalString += ' hr'
  } else {
    weekTotalString = weekTotalMinutes + ' min'
  }
  return weekTotalString
}

function removeDateDuplicates (eventlog) {
  let isTDFound = false
  let isYDFound = false
  for (let i = 0; i < eventlog.length; i++) {
    const date = eventlog[i].date
    if (date === TD) {
      if (!isTDFound) {
        isTDFound = true
      } else {
        eventlog[i].date = ''
      }
    } else if (date === YD) {
      if (!isYDFound) {
        isYDFound = true
      } else {
        eventlog[i].date = ''
      }
    } else if (date === EL) {
      if (i < eventlog.length - 1) {
        if (eventlog[i + 1].date === EL) {
          eventlog[i].date = ''
        }
      }
    }
  }
}
