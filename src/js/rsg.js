export const randomSignals = (session, count, minT, maxT) => {
  const signals = [session]
  let timeRemaining = session - minT
  let signalsLeft = count - 1
  let newMaxT
  // generate random intervals
  for (let i = 1; i < count; i++) {
    newMaxT = timeRemaining - (signalsLeft * minT)
    newMaxT = maxT < newMaxT ? maxT : newMaxT
    const interval = getRandomIntInclusive(minT, newMaxT)
    timeRemaining -= interval
    const randomPos = getRandomIntInclusive(0, signals.length - 1)
    signals.splice(randomPos, 0, interval)
    signalsLeft = count - signals.length
  }
  // substitute interval lengths with timestamps
  for (let i = 1; i < signals.length - 1; i++) {
    signals[i] = signals[i - 1] + signals[i]
  }
  return signals
}

export const randomSignalsNew = (session, count, minT, maxT) => {
  /*
    This function is experimental and needs to be tested.
    We suppose that mean interval value (minT+maxT)/2 == session/count
    from what follows that for session=15*60, count=5 and minT=1*60
    maxT shoud be 5*60.
    Adding new signal to session shortens session and decreases count
    and we should reassess maxT and minT (the former can't be more than
    initial, the latter can't be less than initial).
  */
  const signals = []
  let timeRemaining = session
  let signalsLeft = count
  let newMinT = minT
  let newMaxT = maxT
  // generate random intervals
  for (let i = 1; i < count; i++) {
    const doubleMean = Math.floor(2 * timeRemaining / signalsLeft)
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
    signalsLeft = count - signals.length
  }
  signals.push(session)
  // substitute interval lengths with timestamps
  for (let i = 1; i < signals.length - 1; i++) {
    signals[i] = signals[i - 1] + signals[i]
  }
  return signals
}

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
