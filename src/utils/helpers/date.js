import moment from 'moment';
import 'moment/dist/locale/pt-br';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarMinus } from 'react-icons/fa';

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
    
    return dataAtual.locale('pt-br').diff(moment(dataNascimento, 'YYYY-MM-DD'), 'years');
}

export const diffDatetimes = (datetime1, datetime2, type = 'hours') =>  {
  if (!datetime1) return false;
 return moment(datetime1, 'YYYY-MM-DD[T]HH:mm').locale('pt-br').diff(moment(datetime2, 'YYYY-MM-DD[T]HH:mm'), type);
}

export const diffDatetimesHumanized = (datetime1, datetime2) =>  {
  if (!datetime1) return false;
 return moment.duration(moment(datetime1, 'YYYY-MM-DD[T]HH:mm').locale('pt-br').diff(moment(datetime2, 'YYYY-MM-DD[T]HH:mm'))).humanize();
}

export function isExpired(init, expireIn, unit = 'seconds') {
  const now = moment();
  const tempoExpiracao = moment(init).add(expireIn, unit);
  return now.isAfter(tempoExpiracao)
}

// export const dateDiffWithLabels = (dataFimEstimado, dataFimReal = null) => {
//   const dataAtual = moment();
//   if(!dataFimEstimado) return false;
//   dataFimEstimado = moment(dataFimEstimado, 'YYYY-MM-DD[T]HH:mm');
//   dataFimReal = !!dataFimReal  ? moment(dataFimReal, 'YYYY-MM-DD[T]HH:mm') : null;
//   console.log(dataFimEstimado.isAfter(dataAtual))
//   if (!!dataFimReal && dataFimEstimado.isAfter(dataFimReal)) {
//     return { label: 'Entregue Atrasado', color: 'var(--bs-warning)' };
//   } else if (dataFimEstimado.isBefore(dataAtual) && !dataFimReal) {
//     return { label: 'Atrasado', color: 'var(--bs-danger)' };
//   } else  if(dataFimEstimado.isSameOrBefore(dataFimReal)) {
//     return { label: 'Entregue', color: 'var(--bs-green)' };
//   } else {
//     return { label: 'aguardando', color: 'var(--bs-green)' };
//     return false
//   }
// }
export const dateDiffWithLabels = (dataFimEstimado, dataFimReal = null) => {
  
  const dataAtual = moment();
  if (!dataFimEstimado) return false;

  dataFimEstimado = moment(dataFimEstimado, 'YYYY-MM-DD[T]HH:mm');
  dataFimReal = !!dataFimReal ? moment(dataFimReal, 'YYYY-MM-DD[T]HH:mm') : null;

  if (dataFimReal && dataFimEstimado.isSameOrAfter(dataFimReal)) {
    return { label: 'Entregue', diff: null, Icon: FaCalendarCheck, color: 'var(--bs-green)' };
  } else if (dataFimReal && dataFimEstimado.isBefore(dataFimReal)) {
    return { label: 'Entregue com '+moment.duration(dataFimEstimado.diff(dataFimReal)).humanize()+' de atraso', diff:  '', Icon: FaCalendarAlt, color: 'var(--bs-warning)' };
  } else if (dataFimEstimado.isBefore(dataAtual)) {
    return { label: moment.duration(dataFimEstimado.diff(dataAtual)).humanize()+ ' de atraso', diff: '',  Icon: FaCalendarMinus, color: 'var(--bs-danger)' };
  } else {
    return { label: moment.duration(dataFimEstimado.diff(dataAtual)).humanize()+' até o fim do prazo', diff: '', Icon: FaCalendarAlt, color: 'var(--bs-info)' };
  }
};
