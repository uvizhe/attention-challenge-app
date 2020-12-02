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
    const regex = /(\S+\s\S+)\s(\S+?)[.,]\s.+/
    const localeString = moment(date).locale(state.locale).format('llll')
    return localeString.replace(regex, '$1$2')
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
