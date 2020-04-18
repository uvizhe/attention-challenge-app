import axios from 'axios'
import { sha256 as SHA256 } from 'sha.js'
import { LocalStorage } from 'quasar'
import { log } from './logging'

axios.defaults.baseURL = 'http://192.168.0.233:5000'
if (LocalStorage.has('auth-token')) {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + LocalStorage.getItem('auth-token')
}

export const authenticated = async () => {
  if (LocalStorage.has('auth-token')) {
    try {
      await axios.get('/ping')
      return true
    } catch (e) {
      // FIXME: do something like this
      if (e.response) {
        log(e.response.status)
        log(e.response.data.msg)
      } else {
        // FIXME: timeout? what should we do?
        log(e.message)
      }
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
    // FIXME: do something
    return false
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
    // FIXME: do something better
    if (e.response) {
      return false
    }
    throw Error
  }
  if (res.status === 200) {
    LocalStorage.set('auth-token', res.data.token)
    axios.defaults.headers.common.Authorization =
      'Bearer ' + res.data.token
    return true
  }
}

export const getTotals = () => {
  let totals = []
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
    // FIXME: do something
    // Если мы не получаем ответ от сервера, мы не прячем scoreDialog
  }
  let stats
  if (!LocalStorage.has('totals')) {
    // first ever session
    LocalStorage.set(
      'totals', [res.data.total])
    LocalStorage.set(
      'avgs30', [res.data.average])
    stats = [[res.data.total], [res.data.average]]
  } else {
    const totals = LocalStorage.getItem('totals')
    let avgs30 = LocalStorage.getItem('avgs30')
    const lastSessionDate = totals.slice(-1).pop().x
    if (lastSessionDate === res.data.date) {
      // new session this day
      totals.pop()
      avgs30.pop()
    }
    totals.push(res.data.total)
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
    // FIXME: do something better
    if (e.response) {
      return
    }
    throw Error
  }
  LocalStorage.set('totals', res.data.totals)
  LocalStorage.set('avgs30', res.data.averages)
}
