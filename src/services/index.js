import { API_URL, API_URL_AUTH, REACT_APP_API_SSO } from "@/constants/environment";
import axios from "axios";

export const httpSSO = axios.create({
  baseURL: REACT_APP_API_SSO,
  timeout: 7000,
  headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept' : '*/*',
  }
});


export const httpAuth = axios.create({
  baseURL: API_URL_AUTH,
  timeout: 3000,
  headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
      }
});

export const httpSgp = axios.create({
  baseURL: API_URL,
  timeout: 7000,
  headers: {
      'accept' : '*/*',
  }
});

export async function _get(url) {
  return httpSgp.get(url)
  .then(({data}) =>  Promise.resolve(data))
  .catch(({response}) => Promise.reject(response))
}
export async function _post(url, data) {
  return httpSgp.post(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch(({response}) => Promise.reject(response))
}

export async function _put(url, data) {
  return httpSgp.put(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch(({response}) => Promise.reject(response))
}
export async function _patch(url, data) {
  return httpSgp.patch(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch(({response}) => Promise.reject(response))
}
export async function _delete(url, data) {
  return httpSgp.delete(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch(({response}) => Promise.reject(response))
}

export const fakeFetch = (mock) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mock);
    }, 1000); // Simulando um atraso de 1 segundo
  });
};