import axios from 'axios'
import { sha256 as SHA256 } from 'sha.js'
import { LocalStorage } from 'quasar'
import { getTotals } from './localdb'

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

export const postSession = async (score) => {
  const date = new Date()
  const data = {
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
  return res.data
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
  return res.data
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

export const getFriendTotals = async (user, since = undefined) => {
  const userTotals = getTotals()
  if (!since && Object.keys(userTotals).length >= 7) {
    since = Object.keys(userTotals).sort().shift()
  }
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
