import { LocalStorage } from 'quasar'

export const authenticated = () => {
  if (LocalStorage.has('auth-token')) {
    return true
  }
  return false
}
