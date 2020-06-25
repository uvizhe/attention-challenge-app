export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    /* Config variables BEGIN */
    sessionDuration: 15 * 60,
    bellsDeferral: 0,
    wakeLock: false,
    dndMode: true,
    username: '',
    locale: '',
    /* Config variables END */
    initialized: false,
    // TODO: move these below to config variables
    avgs: [],
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
