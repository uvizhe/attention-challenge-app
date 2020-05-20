import { LocalStorage } from 'quasar'

export const saveAvgs30 = (avgs30) => {
  LocalStorage.set('avgs30', avgs30)
}

export const getAvgs30 = () => {
  let avgs30 = []
  if (LocalStorage.has('avgs30')) {
    avgs30 = LocalStorage.getItem('avgs30')
  }
  return avgs30
}

export const saveTotals = (totals) => {
  LocalStorage.set('totals', totals)
}

export const getTotals = () => {
  let totals = {}
  if (LocalStorage.has('totals')) {
    totals = LocalStorage.getItem('totals')
  }
  return totals
}

export const saveConfig = (parameter, value) => {
  const key = '_config:' + parameter
  LocalStorage.set(key, value)
}

export const getConfig = (parameter = undefined) => {
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