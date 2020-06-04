export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    /* Config variables BEGIN */
    sessionDuration: 15 * 60,
    wakeLock: false,
    username: '',
    locale: '',
    /* Config variables END */
    initialized: false,
    // TODO: move these below to config variables
    avgs30: [],
    totals: {},
    friends: [],
    languages: [
      {
        label: 'English',
        value: 'en-us'
      },
      {
        label: 'Русский',
        value: 'ru-ru'
      }
    ]
  }
}
