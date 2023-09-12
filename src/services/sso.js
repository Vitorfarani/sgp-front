
import { ENV } from "@/constants/ENV";
import { getRedirectUrl } from "@/utils/helpers/mask";


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