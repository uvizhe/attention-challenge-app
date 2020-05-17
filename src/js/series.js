function deepCopy (multiSeries) {
  const copy = {}
  for (const date in multiSeries) {
    const values = multiSeries[date].slice()
    copy[date] = values
  }
  return copy
}

export function appendValue (multiSeries, dateValue, pos = 0) {
  /*
    pos: 0 - user, 1..4 - friends
  */
  const newMultiSeries = deepCopy(multiSeries)
  const [date, value] = Object.entries(dateValue).pop()
  if (!Object.keys(newMultiSeries).length) {
    // series is empty yet
    newMultiSeries[date] = [value]
  } else {
    if (date in newMultiSeries) {
      newMultiSeries[date].splice(pos, 1, value)
    } else {
      const lastDate = Object.keys(newMultiSeries).sort().pop()
      const lastValues = newMultiSeries[lastDate]
      newMultiSeries[date] = lastValues.slice(0, pos)
        .concat(value)
        .concat(lastValues.slice(pos + 1))
    }
  }
  return newMultiSeries
}

export function addSeries (multiSeries, newSeries, pos) {
  /*
    multiSeries: {
      date0: [userVal0, src0Val0, src1Val0, ...],
      date1: [userVal1, src0Val1, src1Val1, ...],
      ...
    }
    newSeries: {dateA: valueA, dateB: valueB, ...}
  */
  const newMultiSeries = deepCopy(multiSeries)
  const population = Object.values(newMultiSeries).length
    ? Object.values(newMultiSeries).pop().length
    : 0
  const msDates = Object.keys(newMultiSeries)
  const newDates = Object.keys(newSeries)
  const uniqueDates = [...new Set(msDates.concat(newDates))].sort()
  let prevDate
  let prevNewSeriesValue = 0
  for (const date of uniqueDates) {
    if ((date in newMultiSeries) && !(date in newSeries)) {
      // this date is missing in newSeries
      newMultiSeries[date].splice(pos, 0, prevNewSeriesValue)
    } else if (!(date in newMultiSeries) && (date in newSeries)) {
      // this date is missing in multiSeries
      if (pos && !population) {
        // we add friend and user has no sessions
        newMultiSeries[date] = [0, newSeries[date]]
      } else if (prevDate) {
        newMultiSeries[date] = newMultiSeries[prevDate].slice()
        newMultiSeries[date].splice(pos, 1, newSeries[date])
      } else {
        // this date precedes multiSeries
        newMultiSeries[date] = Array(population).fill(0)
        newMultiSeries[date].splice(pos, 0, newSeries[date])
      }
    } else {
      newMultiSeries[date].splice(pos, 0, newSeries[date])
    }
    prevDate = date
    prevNewSeriesValue = newMultiSeries[date].slice(pos, pos + 1).pop()
  }
  return newMultiSeries
}

export function removeSeries (multiSeries, pos) {
  const newMultiSeries = deepCopy(multiSeries)
  const msDates = Object.keys(newMultiSeries).sort()
  const datesToRemove = []
  let prevDate
  for (const date of msDates) {
    const values = newMultiSeries[date]
    newMultiSeries[date] = values.slice(0, pos)
      .concat(values.slice(pos + 1))
    if (prevDate) {
      // remove duplicate data originating from addition of this series
      if (newMultiSeries[date].join() === newMultiSeries[prevDate].join()) {
        datesToRemove.push(date)
      }
    }
    prevDate = date
  }
  for (const date of datesToRemove) {
    delete newMultiSeries[date]
  }
  return newMultiSeries
}
