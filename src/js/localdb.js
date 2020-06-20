import { LocalStorage } from 'quasar'

export function authenticated () {
  return LocalStorage.has('auth-token')
}

export function saveAvgs (avgs) {
  LocalStorage.set('avgs', avgs)
}

export function getAvgs () {
  let avgs = []
  if (LocalStorage.has('avgs')) {
    avgs = LocalStorage.getItem('avgs')
  }
  return avgs
}

export function saveTotals (totals) {
  LocalStorage.set('totals', totals)
}

export function getTotals () {
  let totals = {}
  if (LocalStorage.has('totals')) {
    totals = LocalStorage.getItem('totals')
  }
  return totals
}

export function saveConfig (parameter, value) {
  const key = '_config:' + parameter
  LocalStorage.set(key, value)
}

export function getConfig (parameter = undefined) {
  if (parameter) {
    const key = '_config:' + parameter
    return LocalStorage.getItem(key)
  }
  const config = {}
  for (const key of LocalStorage.getAllKeys()) {
    if (key.startsWith('_config:')) {
      const parameter = key.substring(8)
      config[parameter] = LocalStorage.getItem(key)
    }
  }
  return config
}

export function saveFriends (usersArray) {
  LocalStorage.set('friends', usersArray)
}

export function getFriends () {
  let users = []
  if (LocalStorage.has('friends')) {
    users = LocalStorage.getItem('friends')
  }
  return users
}
