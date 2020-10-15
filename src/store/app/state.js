export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    offline: false,
    initialized: false,
    showFriends: true,
    /* Config variables BEGIN */
    sessionDuration: 15 * 60,
    bellsDeferral: 0,
    wakeLock: false,
    dndMode: true,
    publicProfile: false,
    username: '',
    locale: '',
    /* Config variables END */
    /* Data variables BEGIN */
    prevSyncTime: 0,
    lastSyncTime: 0,
    lastSessionDate: '',
    sessions: [],
    avgs: [],
    friendsSessions: {},
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
