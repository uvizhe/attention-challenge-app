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

export async function tryout (uuid) {
  const data = {
    uuid: uuid
  }
  let res
  try {
    res = await axios.post('/newid', data)
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

export async function signup (user, pass, email, publicProfile, locale) {
  const passHash = new SHA256().update(pass).digest('hex')
  const data = {
    username: user,
    password: passHash,
    email: email,
    public: publicProfile,
    locale: locale
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
  let res
  const data = {
    email: email,
    locale: locale
  }
  try {
    res = await axios.post('/recover', data)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.status
}

export async function getServerData () {
  let res
  try {
    res = await axios.get('/userdata')
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.userdata
}

export async function setProfilePublic (isPublic) {
  const data = {
    public: isPublic
  }
  try {
    await axios.post('/gopublic', data)
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

export async function postSessions (sessions) {
  const data = { sessions: [] }
  const date = new Date()
  for (const session of sessions) {
    data.sessions.push({
      score: session.score,
      duration: session.duration,
      timestamp: session.ts * 1000,
      tzoffset: date.getTimezoneOffset()
    })
  }
  let res
  try {
    res = await axios.post('/sessions', data)
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

export async function getPublicStatus (usernames) {
  let res
  let handle = '/ispublic?'
  usernames.forEach(i => {
    handle += '&usernames=' + i
  })
  try {
    res = await axios.get(handle)
  } catch (e) {
    if (e.response) {
      throw new DatabaseConnectionError(e.response.data.msg)
    } else {
      throw new DatabaseConnectionError(e.message)
    }
  }
  return res.data.public
}

export function translateServerError (msg) {
  /* Translate server/network errors to vue-i18n strings */
  switch (msg) {
    case 'Network Error':
      return 'networkError'
    case 'This username is already registered':
      return 'serverError1'
    case 'This email is already registered':
      return 'serverError2'
    case 'Wrong username or password':
      return 'serverError3'
    default:
      return msg
  }
}
