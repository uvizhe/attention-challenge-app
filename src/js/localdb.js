import { LocalStorage } from 'quasar'

export function authenticated () {
  return LocalStorage.has('auth-token')
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

export function saveData (parameter, value) {
  const key = '_data:' + parameter
  LocalStorage.set(key, value)
}

export function getData (parameter = undefined) {
  if (parameter) {
    const key = '_data:' + parameter
    return LocalStorage.getItem(key)
  }
  const config = {}
  for (const key of LocalStorage.getAllKeys()) {
    if (key.startsWith('_data:')) {
      const parameter = key.substring(6)
      config[parameter] = LocalStorage.getItem(key)
    }
  }
  return config
}
