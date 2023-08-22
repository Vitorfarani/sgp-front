
import { API_URL_AUTH } from '@/constants/environment';
import axios from 'axios';
import { httpAuth } from '.';

export const MOCK_SSO = {
    access_token: 'fake_hash_000000000000000000',

}

export const MOCK_USER = {
    id: 1,
    name: 'Lucas Mota',
    email: 'lucas.marques@extreme.digital',
    roles: ['ADMIN', 'DEVELOPER'],
    
}


export const loginHml = async (idFuncional) => {
    let url = `/api/degase`
 
    return httpAuth.post(url, {"idFuncional": idFuncional, "pass": ""})
        .then(response => {
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}

export const loginApi = async (token) => {
    let url = `/api/degase/loginsso`
    Object.assign(httpAuth.defaults, {
        headers: { authorization: 'Bearer ' + token },
    });
    return httpAuth.get(url)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}
export const firstLoginCall = async (data) => {
    let url = `/api/degase/firstlogin`
    return httpAuth.post(url, data)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}
export const firstLoginPersist = async (data) => {
    let url = `/api/degase/firstlogin`
    return httpAuth.put(url, data)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}

export function ApiAlertError(error) {
    if(![404, 400, 401, 422, 500].includes(error.response.status)){
        return {title: 'Error', message: 'Servidor em manutenção, tente novamente mais tarde!', color: 'red'}
    } else {
        if(error.response.status === 401) {
            return {title: 'Error', message: 'Usuário inválido.', color: 'red'}
        }
        if(error.response.data?.exceptionType === 'java.lang.NullPointerException'){
            return {title: 'Error', message: 'idFuncional não encontrado na base, tente novamente.', color: 'red'}
        }
        return {title: 'Error', message: error.response.data.error, color: 'red'}
      }
    
}