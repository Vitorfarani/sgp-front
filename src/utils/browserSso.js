import {REACT_APP_API_SSO, REACT_APP_CLIENT_ID} from '@/constants/environment';
import { getRedirectUrl } from './helpers';

export const getCode = async (url) => {
    const code = url.replace(/.*code=/, '');
    if (code) {
     return code
    }
};
export function logInGovBR()  {
    const url = `${REACT_APP_API_SSO}/auth?response_type=code&client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${getRedirectUrl()}`;
    window.location.href = url;
    
}