const SIGNAL_COUNT = 5 // Assumed the most constant value ever
const STANDARD_SESSION = 15 * 60
const SHORT_SESSION = 10 * 60
const STANDARD_MIN_T = 1 * 60

export function randomSignals (session, offset = 0) {
  /*
    We suppose that mean interval value (minT+maxT)/2 == session/signal_count
    from what follows that for session=15*60, signal_count=5 and minT=1*60
    maxT shoud be 5*60.
    Adding new signal to session shortens session and decreases signal_count
    and we should reassess maxT and minT (the former can't be more than
    initial, the latter can't be less than initial).
  */
  let minT = STANDARD_MIN_T
  if (session < STANDARD_SESSION) {
    minT = adjustMinT(session)
  }
  let doubleMean = Math.floor(2 * session / SIGNAL_COUNT)
  const maxT = doubleMean - minT

  const signals = []
  let timeRemaining = session
  let signalsLeft = SIGNAL_COUNT
  let newMinT = minT
  let newMaxT = maxT
  // generate random intervals
  for (let i = 1; i < SIGNAL_COUNT; i++) {
    doubleMean = Math.floor(2 * timeRemaining / signalsLeft)
    newMaxT = doubleMean - newMinT
    while (newMaxT > maxT) {
      // adjust values
      newMinT += 1
      newMaxT = doubleMean - newMinT
    }
    const interval = getRandomIntInclusive(newMinT, newMaxT)
    timeRemaining -= interval
    const randomPos = getRandomIntInclusive(0, signals.length)
    signals.splice(randomPos, 0, interval)
    signalsLeft = SIGNAL_COUNT - signals.length
  }
  // apply offset
  signals.push(session + offset)
  if (offset) {
    signals[0] += offset
  }
  // substitute interval lengths with timestamps
  for (let i = 1; i < signals.length - 1; i++) {
    signals[i] = signals[i - 1] + signals[i]
  }
  return signals
}

function adjustMinT (sessionDuration) {
  let minT
  if (sessionDuration < SHORT_SESSION) {
    switch (sessionDuration) {
      case 5 * 60:
        minT = 30
        break
      case 6 * 60:
        minT = 32
        break
      case 7 * 60:
        minT = 34
        break
      case 8 * 60:
        minT = 36
        break
      case 9 * 60:
        minT = 38
        break
    }
  } else {
    switch (sessionDuration) {
      case 10 * 60:
        minT = 40
        break
      case 11 * 60:
        minT = 44
        break
      case 12 * 60:
        minT = 48
        break
      case 13 * 60:
        minT = 52
        break
      case 14 * 60:
        minT = 56
        break
    }
  }
  return minT
}

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
