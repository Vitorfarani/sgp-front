export const isMobile =  window.innerWidth <= 768; // Ou outro valor de largura que você considera como ponto de quebra para dispositivos móveis


export function getDificuldade(value) {
  var numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
      return 'Valor inválido';
  }

  if (numericValue >= 0 && numericValue < 2.5) {
      return 'Muito Fácil';
  } else if (numericValue < 5) {
      return 'Fácil';
  } else if (numericValue < 7.5) {
      return 'Normal';
  } else if (numericValue < 10) {
      return 'Difícil';
  } else {
      return 'Muito Difícil';
  }
};