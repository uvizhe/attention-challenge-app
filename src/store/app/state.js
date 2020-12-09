export default function () {
  return {
    pageHeader: false,
    pageHeaderTitle: '',
    newUser: false,
    offline: false,
    initialized: false,
    showFriends: true,
    /* Config variables BEGIN */
    sessionDuration: 15 * 60,
    bellsDeferral: 2,
    soundVolume: 2,
    wakeLock: false,
    dndMode: true,
    tryout: false,
    publicProfile: false,
    username: '',
    locale: '',
    startOfWeekDay: '',
    /* Config variables END */
    /* Data variables BEGIN */
    lastActionTime: 0,
    prevSyncTime: 0,
    lastSyncTime: 0,
    lastSessionDate: '',
    sessionsToday: 0,
    sessions: [],
    avgs: [],
    friendsSessions: {},
    offlineSessions: [],
    /* Data variables END */
    languages: [
      {
        label: 'English',
        value: 'en-us'
      },
      {
        label: 'русский',
        value: 'ru-ru'
      }
    ]
  }
}
