import { _delete, _get, _post, _put, fakeFetch } from "..";
let MOCK_observacoes = [
  {
    colaborador: {
      id: 1,
      nome: 'lucas mota',
    },
    content: '<p>aqui e agora<p>',
    anexos: [
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'pdf',
        title: null

      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'image',
        title: null

      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'file',
        title: null

      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'file',
        title: null

      },
    ]
  },
  {
    colaborador: {
      id: 2,
      nome: 'ana silva',
    },
    content: '<p>conteúdo da observação<p>',
    anexos: [
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'pdf',
        title: null
      },
    ]
  },
  {
    colaborador: {
      id: 3,
      nome: 'pedro almeida',
    },
    content: '<p>outro conteúdo interessante<p>',
    anexos: []
  },
  {
    colaborador: {
      id: 4,
      nome: 'maria santos',
    },
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    anexos: [
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'image',
        title: ''

      },
    ]
  },
  {
    colaborador: {
      id: 5,
      nome: 'joão oliveira',
    },
    content: '<p>reflexões sobre o projeto<p>',
    anexos: [
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'file',
        title: 'certificado de contrrato de alerja hj a noite .pem'
      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c9a71fd8665cf00012d9f8c/1554218355509-M6FBDMSSYE7V6CGR4TJ5/Screen+Shot+2019-04-02+at+11.18.44+AM.png?format=2500w',
        type: 'pdf',
        title: 'Gestão de contrato'
      }
    ]
  }
];


export const listProjetoObservacoes = async (params) => {
  let url = `projetoobservacao${params}`;
  return _get(url);
}

export const createProjetoObservacao = async (data) => {
  let url = 'projetoobservacao/store';
  return _post(url, data);
}

// export const editProjetoObservacao = async (id, data) => {
//   let url = `projetoObservacaos/${id}`;
//   return _put(url, data);
// }

export const deleteProjetoObservacao = async (id) => {
  let url = `projetoobservacao/delete/${id}`;
  return _delete(url);
}