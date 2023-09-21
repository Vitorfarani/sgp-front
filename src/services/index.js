import { ENV } from "@/constants/ENV";
import { getStatusMessage } from "@/utils/helpers/httpHelpers";
import { formatErrorsToHTML } from "@/utils/helpers/validators";
import axios from "axios";

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
  .catch((response) => Promise.reject(axiosError(response)))
}
export async function _post(url, data) {
  return httpSgp.post(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(axiosError(response)))
}

export async function _put(url, data) {
  return httpSgp.put(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(axiosError(response)))
}
export async function _patch(url, data) {
  return httpSgp.patch(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(axiosError(response)))
}
export async function _delete(url, data) {
  return httpSgp.delete(url, data)
  .then(({data}) =>  Promise.resolve(data))
  .catch((response) => Promise.reject(axiosError(response)))
}

export const standartResponseApiError = (message) => ({title: 'Error', message, color: 'var(--bs-danger)'});

export const axiosError = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      try {
        if(error.response.status == 422) {
          return {
            title: getStatusMessage(error.response.status),
            subtitle:  error.response.data.message,
            message:  formatErrorsToHTML(error.response.data),
            color: 'var(--bs-danger)',
            code: error.response.status
          }
        }
        if(error.response.status == 405) {
          return {
            title: getStatusMessage(error.response.status),
            message:  'Rota não habilitada na API',
            color: 'var(--bs-danger)',
            code: error.response.status
          }
        }
        
        return {
          title: getStatusMessage(error.response.status),
          message:  error.response.data.message,
          color: 'var(--bs-danger)',
          code: error.response.status
        }
      } catch (exception) {
        return standartResponseApiError('Erro durante a solicitação: '+ error.message);
      }
    } else {
      return standartResponseApiError('Erro durante a solicitação: '+ error.message);
    }
  } else {
    const confirmResult = confirm('Erro inexperado no front, Deseja enviar um e-mail com o erro para o suporte?');

    if (confirmResult) {
        // Criar um link "mailto" com a mensagem de retorno
        const email = '';
        const assunto = 'Erro no SGP-Front';
        const corpoEmail = `Ocorreu um erro na aplicação:\n\n${error.message}`;

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;

        // Abra o cliente de e-mail padrão com a mensagem de erro
        window.location.href = mailtoLink;
    }
    return standartResponseApiError(error.message);

   }
}
export const fakeFetch = (mock) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mock);
    }, 1000); // Simulando um atraso de 1 segundo
  });
};