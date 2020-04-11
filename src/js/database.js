import axios from 'axios'
import { LocalStorage } from 'quasar'

const BACKEND = 'http://192.168.0.233:5000'

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
  const dateString = date.toISOString().split('T').shift()
  const data = {
    userid: user,
    score: score,
    timestamp: date.getTime(),
    tzoffset: date.getTimezoneOffset()
  }
  let res
  try {
    res = await axios.post(BACKEND + '/session', data)
  } catch (e) {
    // FIXME: do something
    // Если мы не получаем ответ от сервера, мы не прячем scoreDialog
    console.log(e)
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
    if (lastSessionDate === dateString) {
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
