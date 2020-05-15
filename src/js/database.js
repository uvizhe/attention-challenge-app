import axios from 'axios'
import { sha256 as SHA256 } from 'sha.js'
import { LocalStorage } from 'quasar'

axios.defaults.baseURL = process.env.BACKEND
if (LocalStorage.has('auth-token')) {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + LocalStorage.getItem('auth-token')
}

function DatabaseConnectionError (message) {
  this.message = message || 'Unknown error'
}

export const authenticated = async () => {
  if (LocalStorage.has('auth-token')) {
    try {
      await axios.get('/ping')
      return true
    } catch (e) {
      // FIXME: Call 911
    }
  }
  return false
}

export const authenticate = async (user, pass) => {
  const passHash = new SHA256().update(pass).digest('hex')
  const data = {
    username: user,
    password: passHash
  }
  let res
  try {
    res = await axios.post('/auth', data)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  if (res.status === 200) {
    LocalStorage.set('auth-token', res.data.token)
    axios.defaults.headers.common.Authorization =
      'Bearer ' + res.data.token
    return true
  }
}

export const signup = async (user, pass, email) => {
  const passHash = new SHA256().update(pass).digest('hex')
  const data = {
    username: user,
    password: passHash,
    email: email
  }
  let res
  try {
    res = await axios.post('/newuser', data)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  if (res.status === 200) {
    LocalStorage.set('auth-token', res.data.token)
    axios.defaults.headers.common.Authorization =
      'Bearer ' + res.data.token
    return true
  }
}

export const getTotals = () => {
  let totals = {}
  if (LocalStorage.has('totals')) {
    totals = LocalStorage.getItem('totals')
  }
  return totals
}

export const getAvgs30 = () => {
  let avgs30 = []
  if (LocalStorage.has('avgs30')) {
    avgs30 = LocalStorage.getItem('avgs30')
  }
  return avgs30
}

export const reportSession = async (user, score) => {
  const date = new Date()
  const data = {
    userid: user,
    score: score,
    timestamp: date.getTime(),
    tzoffset: date.getTimezoneOffset()
  }
  let res
  try {
    res = await axios.post('/session', data)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  let stats
  if (!LocalStorage.has('totals')) {
    // first ever session
    LocalStorage.set(
      'totals', res.data.total)
    LocalStorage.set(
      'avgs30', [res.data.average])
    stats = [res.data.total, [res.data.average]]
  } else {
    const totals = LocalStorage.getItem('totals')
    let avgs30 = LocalStorage.getItem('avgs30')
    if (res.data.date in totals) {
      // new session this day
      avgs30.pop()
    }
    Object.assign(totals, res.data.total)
    avgs30.push(res.data.average)
    if (avgs30.length > 30) {
      avgs30 = avgs30.slice(-30)
    }
    LocalStorage.set('totals', totals)
    LocalStorage.set('avgs30', avgs30)
    stats = [totals, avgs30]
  }
  return stats
}

export const getStats = async () => {
  let res
  try {
    res = await axios.get('/score')
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  if (res.data.averages.length) {
    LocalStorage.set('totals', res.data.totals)
    LocalStorage.set('avgs30', res.data.averages)
  }
}

export const getUsers = async () => {
  let res
  try {
    res = await axios.get('/users')
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.users
}

export const saveFriends = (usersArray) => {
  LocalStorage.set('friends', usersArray)
}

export const getFriends = () => {
  let users = []
  if (LocalStorage.has('friends')) {
    users = LocalStorage.getItem('friends')
  }
  return users
}

export const getFriendTotals = async (user) => {
  const userTotals = getTotals()
  const since = Object.keys(userTotals).length >= 7
    ? Object.keys(userTotals).sort().pop()
    : undefined
  const last = since
    ? undefined
    : 7
  const params = {
    since: since,
    last: last
  }
  let res
  try {
    res = await axios.get('/totals/' + user, { params: params })
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.totals
}
