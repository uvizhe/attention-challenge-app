export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    initialized: false,
    /* Config variables BEGIN */
    sessionDuration: 15 * 60,
    bellsDeferral: 0,
    wakeLock: false,
    dndMode: true,
    username: '',
    locale: '',
    /* Config variables END */
    /* Data variables BEGIN */
    lastSessionDate: '',
    sessions: [],
    avgs: [],
    friends: [],
    friendsSessions: [],
    /* Data variables END */
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
