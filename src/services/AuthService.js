
import { redirect } from 'react-router-dom';
import { httpSgp, standartResponseApiError } from '.';


export const loginApi = async (code) => {
    let url = `login`
    return httpSgp.post(url, {code: code})
        .then(response => {
            localStorage.setItem('toook', response.data.token.access_token)
            Object.assign(httpSgp.defaults, {
                headers: { authorization: 'Bearer ' + response.data.token.access_token },
            });
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}
export const loginDEVApi = async () => {
    let url = `login-dev`
    return httpSgp.post(url)
        .then(response => {
            localStorage.setItem('toook', response.data.token.access_token)
            Object.assign(httpSgp.defaults, {
                headers: { authorization: 'Bearer ' + response.data.token.access_token },
            });
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}
export const me = async () => {
    let url = `me`
    return httpSgp.get(url)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}

export const logout = async () => {
    let url = `logout`
    return httpSgp.post(url)
        .then(response => {
            window.location.href = (response.data.redirectTo)
            return Promise.resolve(response)
        })
        .catch((error) => {
            return Promise.reject(ApiAlertError(error))

        })
}

export function ApiAlertError(error) {
    if(error.code === "ERR_NETWORK") {
        return standartResponseApiError("Serviço fora do ar, tente novamente mais tarde!")
    } else if(![500].includes(error.response.status)){
        return standartResponseApiError('Serviço fora do ar, tente novamente mais tarde!')
    } else {
        if(error.response.status === 401) {
            return standartResponseApiError('Sessão expirada')
        }
        return standartResponseApiError(error.response.data.error)
      }
    
}