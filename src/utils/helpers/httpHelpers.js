export function getStatusMessage(statusCode) {
  const httpStatusCodes = {
      200: 'OK',
      201: 'Criado',
      204: 'Sem Conteúdo',
      400: 'Requisição Inválida',
      401: 'Não Autorizado',
      403: 'Proibido',
      404: 'Não Encontrado',
      405: 'Método não habilitado',
      422: 'Erro no processamento',
      500: 'Erro Interno do Servidor',
      // Adicione mais códigos de status e traduções conforme necessário
  };

  return httpStatusCodes[statusCode] || 'Status Desconhecido';
}