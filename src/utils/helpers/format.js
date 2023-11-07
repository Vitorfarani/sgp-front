import imageCompression from 'browser-image-compression';

const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']

export function humanStorageSize (bytes) {
  let u = 0

  while (parseInt(bytes, 10) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(1)} ${units[u]}`
}

export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function between (v, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, v))
}

export function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1)

  let index = min + (v - min) % size
  if (index < min) {
    index = size + index
  }

  return index === 0 ? 0 : index // fix for (-a % a) => -0
}

export function pad (v, length = 2, char = '0') {
  let val = '' + v
  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}

export const buildQueryString = (paramsObj, prefix = '?') => {
  const queryParams = Object.keys(paramsObj)
    .map((key) => {
      if(key === "selectedRows") return`${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key].join(','))}` 
      if(typeof paramsObj[key] !== "undefined") return`${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`
    })
    .join('&');

  return queryParams ? `${prefix}${queryParams}` : '';
};

export const toBase64 = (file, onProgressExtract = () => { }, maxSizeMB = 0.5) => new Promise(async (resolve, reject) => {
  const dataQueue = [];  // Fila para armazenar os dados
  const processingInterval = 10;  // Intervalo de processamento em milissegundos (0,5 segundos)
  function addToQueue(data) {
    dataQueue.push(data);
    if (!processing) {
      processQueue();
    }
  }

  let processing = false;  // Indica se há processamento em andamento
  function processQueue() {
    if (dataQueue.length === 0) {
      processing = false;  // Não há mais processamento em andamento

      return;
    }

    const dataToProcess = dataQueue.shift();  // Remove o primeiro dado da fila
    onProgressExtract(dataToProcess)
    console.log({lazyValue: dataToProcess})
    setTimeout(processQueue, processingInterval);
    processing = true;  // Indica que há processamento em andamento
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    onProgress: (value) => {
      addToQueue(value)
      // onProgressExtract(value)
    }
  }
  try {
    const compressedFile = await imageCompression(file, options);
    let base64 = await imageCompression.getDataUrlFromFile(compressedFile)

    resolve(base64)
  } catch (error) {
    reject(error);
  }
});


export default {
  humanStorageSize,
  capitalize,
  between,
  normalizeToInterval,
  pad,
  buildQueryString,
  toBase64
}