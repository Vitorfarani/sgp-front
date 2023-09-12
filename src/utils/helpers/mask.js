import { ENV } from '@/constants/ENV';
import moment from 'moment/moment';

export function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
export function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
export const cpfMask = value => {
  if (!value) return ''
  return String(value)
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}
export const celularMask = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  let match;
  if (match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  } else if (match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/)) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  } else {
    return phoneNumber;

  }
}

export const dateMask = value => {
  if (!value) return 'N/A'
  return String(value).split('-').reverse().join('/')
}
export function searchLike(text, query) {
  const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`.*${escapedQuery}.*`, 'i');

  return regex.test(text);
}
export function getRedirectUrl() {
  return ENV.HOST + '/login'
}



export function pessoaNomeAbreviadoMask(nomeCompleto) {
  const preposicoes = ['da', 'de', 'do', 'di', 'du'];
  const palavras = nomeCompleto.split(' ');
  if (palavras.length > 1) {
    const primeiroNome = palavras[0];
    const ultimoNome = palavras[palavras.length - 1];
    const nomeMeio = palavras
      .slice(1, palavras.length - 1)
      .filter(palavra => !preposicoes.includes(palavra))
      .map(palavra => palavra[0])
      .join('. ');

    return `${primeiroNome} ${nomeMeio ? `${nomeMeio} ` : ''}${ultimoNome}`;
  }
  return nomeCompleto;
}