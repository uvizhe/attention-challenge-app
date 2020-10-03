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

export async function authorize () {
  try {
    await axios.get('/ping')
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
}

export async function authenticate (user, pass) {
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

export async function signup (user, pass, email) {
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

export async function recover (email, locale) {
  const data = {
    email: email,
    locale: locale
  }
  try {
    await axios.post('/recover', data)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
}

export async function postSession (score, duration) {
  const date = new Date()
  const data = {
    score: score,
    duration: duration,
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

export async function getStats () {
  let ress
  try {
    ress = await Promise.all([
      axios.get('/sessions'),
      axios.get('/averages')
    ])
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return { ...ress[0].data, ...ress[1].data }
}

export async function getSessions (user, since = '', sinceTs = '') {
  let res
  let handle = '/sessions/' + user
  if (since && sinceTs) {
    handle += '?since=' + since + '&since_ts=' + sinceTs
  } else if (since) {
    handle += '?since=' + since
  }
  try {
    res = await axios.get(handle)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.sessions
}

export async function getUsers () {
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
