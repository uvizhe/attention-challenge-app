import moment from 'moment'

export function startOfWeekOptions (state) {
  return [
    {
      label: moment().startOf('isoWeek').subtract(1, 'day')
        .locale(state.locale).format('dddd'),
      value: 0
    },
    {
      label: moment().startOf('isoWeek')
        .locale(state.locale).format('dddd'),
      value: 1
    },
    {
      label: moment().startOf('isoWeek').add(5, 'days')
        .locale(state.locale).format('dddd'),
      value: 6
    }
  ]
}

export function startOfWeekDay (state) {
  if (state.startOfWeekDay === '') {
    return Number(moment().locale(state.locale).startOf('week').format('d'))
  } else {
    return Number(state.startOfWeekDay)
  }
}

export function getLocalDayString (state) {
  return function (date) {
    let dateStr
    // Moment.js l10n isn't good
    if (state.locale === 'en-us') {
      dateStr = moment(date).locale(state.locale).format('MMM DD|dd')
    } else {
      dateStr = moment(date).locale(state.locale).format('DD MMM|dd').replace('.', '')
    }
    return dateStr
  }
}

export function sessionsCopy (state) {
  return state.sessions.slice()
}

export function avgsCopy (state) {
  return state.avgs.slice()
}

export function friends (state) {
  return Object.keys(state.friendsSessions)
}

export function friendsSessionsCopy (state) {
  return JSON.parse(JSON.stringify(state.friendsSessions))
}

export function offlineSessionsCopy (state) {
  return state.offlineSessions.slice()
}
