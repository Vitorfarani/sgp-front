
import { REACT_APP_API_SSO, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } from "@/constants/environment";
import { getRedirectUrl } from "@/utils/helpers";
import axios from 'axios';
import { MOCK_SSO } from "./AuthService";

const httpSSO = axios.create({
    baseURL: REACT_APP_API_SSO,
    timeout: 7000,
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept' : '*/*',
    }
});

export const sendCodeToGov = async (code) => {
    return MOCK_SSO; //mock para tests, TODO: normalizar auth
    let url = `/token`
    const deepLink = getRedirectUrl()
    const params = []
        params.push('&grant_type='+ 'authorization_code');
        params.push('&client_id='+ REACT_APP_CLIENT_ID);
        params.push('&client_secret='+ REACT_APP_CLIENT_SECRET);
        params.push('&redirect_uri='+ deepLink);
        params.push('&code='+ code);

    return await httpSSO.post(url, encodeURI(params.join('')))
        .then(response => {
            return Promise.resolve(response.data)
        })
        .catch(async (error) => {
            console.log(error)
            return Promise.reject(ApiAlertError(error))
        })
}
export const logoutGov = async (data) => {
    const deepLink = getRedirectUrl()
    const params = []
    params.push('?redirect_uri='+ deepLink);
    let url = `${REACT_APP_API_SSO}/logout${encodeURI(params.join(''))}`
}

export function ApiAlertError(error) {
    if(error.message){
        return {title: 'Error', message: error.message, color: 'red'}
    }
    if(![404, 400, 422].includes(error.response?.status)){
        return {title: 'Error', message: 'Serviço do gov.br fora do ar ou em manutenção, tente novamente mais tarde!', color: 'red'}
    } else {
        return {title: 'Error', message: error.response.data.toString(), color: 'red'}
      }
    
}