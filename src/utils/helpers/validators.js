export function validarCpf(strCPF) {
    let Soma
    let Resto
    Soma = 0
    strCPF = strCPF.replace(/\D/g, '')
    console.log(strCPF)
    let invalids = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '99999999999']

    if (invalids.indexOf(strCPF) !== -1) {
      return false
    }

    if (strCPF === '00000000000') return false

    let i
    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
    Resto = (Soma * 10) % 11

    if ((Resto === 10) || (Resto === 11)) Resto = 0
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false

    Soma = 0
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
    Resto = (Soma * 10) % 11

    if ((Resto === 10) || (Resto === 11)) Resto = 0
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false
    return true
}

export function validarCnpj(value) {
    if (!value) return false

    const isString = typeof value === 'string'
    const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

    if (!validTypes) return false

    if (isString) {
      if (value.length > 18) return false

      const digitsOnly = /^\d{14}$/.test(value)
      const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value)

      if (digitsOnly || validFormat) true
      else return false
    }

    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []

    if (numbers.length !== 14) return false

    const items = [...new Set(numbers)]
    if (items.length === 1) return false

    const calc = (x) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0

      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }

      const result = 11 - (sum % 11)

      return result > 9 ? 0 : result
    }

    const digits = numbers.slice(12)

    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false

    const digit1 = calc(13)
    if (digit1 === digits[1]) {
      return true
    } else {
      return false
    }
}
export function isValidDate(str, lang = 'en') {
  if (lang === 'pt-br') {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      return rej('Data inválida')
    }
    var date = str.split('/')
    var newDate = date['2'] + '-' + date[1] + '-' + date[0]
    return !!new Date(newDate).getTime()
  }
  return !!new Date(str).getTime()
}

export  function validateImageFileType(fileName){
  var idxDot = fileName.lastIndexOf(".") + 1;
  var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
      return true
  }else{
      return false
  }   
}

export function formatErrorsToHTML(errors) {
  console.log(errors)
  if (!errors || !errors.error) {
    return ''; // Retorna uma string vazia se não houver erros ou se a propriedade "error" for falsa.
  }

  const errorHTML = `
    <div class="error-message">
      <p>${errors.message}</p>
      <ul>
        ${Object.keys(errors.errors).map((field) => {
          return errors.errors[field].map((errorMessage) => {
            return `<li><strong>${field}:</strong> ${errorMessage}</li>`;
          }).join('');
        }).join('')}
      </ul>
    </div>
  `;

  return errorHTML;
}


