import { ENV } from "@/constants/ENV";
import axios from "axios";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
      navigator.serviceWorker.register('serviceWorker.js', {scope: '/'}).then(function(registration) {
          console.log('ServiceWorker registration succesful!')
      }, function(err) {
          console.log('ServiceWorker registration failed: ', err);
      });
  });
}

export const httpSSO = axios.create({
  baseURL: 'oauth',
  timeout: 7000,
  headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept' : '*/*',
  }
});

// export const httpAuth = axios.create({
//   baseURL: ENV.API_URL_AUTH,
//   timeout: 3000,
//   headers: {
//       'Content-Type': 'application/json',
//       'Accept': '*/*'
//       }
// });

export const httpSgp = axios.create({
  baseURL: ENV.API_URL + ENV.API_VERSION,
  timeout: 7000,
  headers: {
      'accept' : '*/*',
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('toook') ? 'Bearer ' + localStorage.getItem('toook') : null
  }
});

export async function _get(url) {
  return httpSgp.get(url)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(standartResponseApiError(response)))
}
export async function _post(url, data) {
  return httpSgp.post(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => {
    console.log(response)
    Promise.reject(standartResponseApiError(response))
  })
}

export async function _put(url, data) {
  return httpSgp.put(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(standartResponseApiError(response)))
}
export async function _patch(url, data) {
  return httpSgp.patch(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(standartResponseApiError(response)))
}
export async function _delete(url, data) {
  return httpSgp.delete(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(standartResponseApiError(response)))
}

export const standartResponseApiError = (message) => ({title: 'Error', message, color: 'red'});

export const fakeFetch = (mock) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mock);
    }, 1000); // Simulando um atraso de 1 segundo
  });
};