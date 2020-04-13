import { SessionStorage } from 'quasar'

export const log = (message) => {
  let log = []
  const date = new Date()
  const localTime = date.toTimeString().split(' ').shift()
  if (SessionStorage.has('log')) {
    log = SessionStorage.getItem('log')
  }
  log.push(localTime + ' ' + message)
  SessionStorage.set('log', log)
}

export const getLogs = () => {
  let log = []
  if (SessionStorage.has('log')) {
    log = SessionStorage.getItem('log')
  }
  return log
}
