import moment from 'moment-hijri'

/**
 * @example timeToDate("11:35 PM")
 * @param {"12:05 AM"} time
 */
export function timeToDate({time, date}) {
  const am = time.split(' ')[1]
  const [hours, minutes] = time.split(' ')[0].split(':')

  let parsedHours = Number(hours)

  if (am === 'AM') {
    if (parsedHours === 12) parsedHours = 0
    else parsedHours = hours
  } else if (parsedHours + 12 === 24) parsedHours = 0
  else parsedHours += 12

  date = new Date(date)
  date.setHours(parsedHours, Number(minutes), 0)
  return date
}

export function formatTime(datetime) {
  const date = new Date(datetime)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let am = hours < 12 ? 'AM' : 'PM'

  hours = am === 'PM' ? hours - 12 : hours
  hours = hours < 10 ? `0${hours}` : hours
  minutes = minutes < 10 ? `0${minutes}` : minutes

  return `${hours}:${minutes} ${am}`
}

export function formatDate(datetime) {
  return new Date(datetime).toLocaleDateString('en-GB')
}

export function timeFromNow(time, lang) {
  // .fromNow())
  const timeData = moment(time)
  return timeData.locale(lang).fromNow()
}

export function formatDuration(duration = {}, onlyDays = false) {
  if (Object.keys(duration).length === 0) return ''

  let {days, hours, minutes} = duration

  hours = hours < 10 ? `0${hours}` : hours
  minutes = minutes < 10 ? `0${minutes}` : minutes

  if (onlyDays) return `${days} Days`
  if (days) return `${days}D ${hours}H ${minutes}M`
  if (hours !== '00') return `${hours}H ${minutes}M`
  return `${minutes}M`
}

export const calculateNOfDaysBetween = ({date1, date2}) => {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date2 - date1) / oneDay) + 1)
}

export function getDateFromTime(date, time) {
  const [hours, min] = time.split(':')
  const [minutes, AM] = min.split(' ')
  const d = new Date(date)

  if (hours.trim() === '12')
    if (AM.trim() === 'AM') d.setHours(0)
    else d.setHours(12)
  else d.setHours(AM.trim() === 'AM' ? hours : Number(hours) + 12)

  d.setMinutes(minutes)
  return d
}
