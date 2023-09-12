import { ENV } from '@/constants/ENV';
import { getRedirectUrl } from './helpers/mask';

export const getCode = async (url) => {
    const code = url.replace(/.*code=/, '');
    if (code) {
     return code
    }
};
export function logInGovBR()  {
    const url = `${ENV.REACT_APP_API_SSO}/auth?response_type=code&client_id=${ENV.REACT_APP_CLIENT_ID}&redirect_uri=${getRedirectUrl()}`;
    window.location.href = url;
    
}