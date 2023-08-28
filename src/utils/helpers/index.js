import { ENV } from '@/constants/ENV';
import moment from 'moment/moment';

export function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  export function diff_minutes(dt2, dt1) 
  {
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  } 
  export const cpfMask = value => {
    if(!value) return ''
    return String(value)
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  }
  export const dateMask = value => {
    if(!value) return 'N/A'
    return String(value).split('-').reverse().join('/')
  }

// export const createTask = () => {
//   const timerId = BackgroundTimer.setInterval(async () => {
//     createSearchPessoaTask(cpf)
//     .then((result) => {
//       if (result === expectedResult) {
//         BackgroundTimer.clearInterval(timerId);
//       }
//     })
//     .catch((err) => {
//       console.error(err.response)
//     })
   
//   }, 3 * 60 * 1000); // 3 minutos em milissegundos
// }

// export function isBase64(str) {
//   if (str ==='' || str.trim() ===''){ return false; }
//   try {
//       return btoa(atob(str)) == str;
//   } catch (err) {
//       return false;
//   }
// }

export function getRedirectUrl() {
  return ENV.HOST+'/login'
}

export function isExpired(init, expireIn, unit = 'seconds') {
  const now = moment();
  const tempoExpiracao = moment(init).add(expireIn, unit);
  return now.isAfter(tempoExpiracao)
}
