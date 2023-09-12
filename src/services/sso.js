
import { ENV } from "@/constants/ENV";
import { getRedirectUrl } from "@/utils/helpers/mask";

// export const sendCodeToGov = async (code) => {
//     // return MOCK_SSO; //mock para tests, TODO: normalizar auth
//     Object.assign(httpSSO.defaults, {
//         headers: { authorization: 'Bearer ' + token },
//     });
//     let url = `/token`
//     const deepLink = getRedirectUrl()
//     const params = []
//         params.push('grant_type='+ 'authorization_code');
//         params.push('&client_id='+ ENV.REACT_APP_CLIENT_ID);
//         params.push('&client_secret='+ ENV.REACT_APP_CLIENT_SECRET);
//         params.push('&redirect_uri='+ deepLink);
//         params.push('&code='+ code);

//     return await httpSSO.post(url, encodeURI(params.join('')))
//         .then(response => {
//             return Promise.resolve(response.data)
//         })
//         .catch(async (error) => {
//             console.log(error)
//             return Promise.reject(ApiAlertError(error))
//         })
// }

export const logoutGov = async (data) => {
    const deepLink = getRedirectUrl();
    const params = []
    params.push('?redirect_uri='+ deepLink);
    let url = `${ENV.REACT_APP_API_SSO}/logout${encodeURI(params.join(''))}`
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