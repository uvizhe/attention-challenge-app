import { LocalStorage } from 'quasar'

export function updateChartsData () {
  // move localstorage avgs30 to avgs
  if (LocalStorage.has('avgs30')) {
    const avgs = LocalStorage.getItem('avgs30')
    LocalStorage.set('avgs', avgs)
    LocalStorage.remove('avgs30')
  }
}
