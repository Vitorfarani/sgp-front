import moment from "moment"

export const dateEnToPt = function (d) {
  d = String(d).split('-')
  if (d.length < 3) {
    return
  }
  d = `${d[2]}/${d[1]}/${d[0]}`
  return d
}
export const datePtToEn = function (d) {
  d = String(d).split('/')
  if (d.length < 3) {
    return
  }
  d = `${d[2]}-${d[1]}-${d[0]}`
  return d
}

export const datetimeToEn = function (d) {
  let dt = d.split(' ')
  d = dt[0].split('/')
  let time = dt[1]
  let timeArr = time.split(':')
  if (timeArr.length < 3) {
    timeArr.push('00')
  }
  d = `${d[2]}-${d[1]}-${d[0]} ${timeArr.join(':')}`
  return d
}

export const convertDate = function (varDate, splitDateTime = false) {
  if (varDate && varDate.date) {
    let _dt = varDate.date
    _dt = moment(_dt, 'DD/MM/YYYY HH:mm')
    if (splitDateTime) {
      return String(_dt).split(' ')
    }
    return _dt
  }
  return null
}

export const getIdade = (dataNascimento) =>  {
    let dataAtual = moment();
    return dataAtual.diff(moment(dataNascimento, 'YYYY-MM-DD'), 'years');
}

export function isExpired(init, expireIn, unit = 'seconds') {
  const now = moment();
  const tempoExpiracao = moment(init).add(expireIn, unit);
  return now.isAfter(tempoExpiracao)
}