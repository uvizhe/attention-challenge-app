import { LocalStorage } from 'quasar'
import { ping } from './database'

export const authenticated = () => {
  if (LocalStorage.has('auth-token')) {
    if (ping()) {
      return true
    }
  }
  return false
}
