//DEV
export const MODE = 'DEV';

const ENVORIMENTS = {
  DEV: {
    // API_URL_AUTH: "http://www.carteirafuncional.rj.gov.br/",
    API_URL: "https://localhost:8000/",
    API_VERSION: "api/v1/",
    REACT_APP_CLIENT_ID: "sgtp",
    REACT_APP_API_SSO: "https://dev.login.rj.gov.br/auth/realms/rj/protocol/openid-connect",
    REACT_APP_API_SSO_KEY: "Api-Key 7nAQ4uv8.JTLoeV2Y5moaVEe3wx8PBwROBidxdmkx",
    HOST: "https://127.0.0.1:5173",
  },
  HML: {
    API_URL: "https://localhost:8000/",
    API_VERSION: "api/v1/",
    REACT_APP_CLIENT_ID: "sgtp",
     REACT_APP_API_SSO: "https://login.rj.gov.br/auth/realms/rj/protocol/openid-connect",
    REACT_APP_API_SSO_KEY: "Api-Key 7nAQ4uv8.JTLoeV2Y5moaVEe3wx8PBwROBidxdmkx",
    HOST: "https://127.0.0.1:5173",
  },
  PROD: {

  }
}
export const ENV = ENVORIMENTS[MODE];

//PROD
// const API_URL_AUTH= "http://www.carteirafuncional.rj.gov.br/";
// const API_URL= "http://www.cartdigital.rj.gov.br/index.php/detran/";
// const REACT_APP_CLIENT_ID= "carteira-digital";
// export const REACT_APP_CLIENT_SECRET= "8f3efc1e-0578-4a11-b542-e9beb73c470f";
// export const REACT_APP_API_SSO= "https://login.rj.gov.br/auth/realms/rj/protocol/openid-connect";
// export const REACT_APP_API_SSO_KEY= "Api-Key 7nAQ4uv8.JTLoeV2Y5moaVEe3wx8PBwROBidxdmkx";
