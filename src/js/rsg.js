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

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
