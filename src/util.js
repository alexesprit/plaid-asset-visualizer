export function setTitle(subtitle) {
  document.title = `Plaid Asset Vizualizer | ${subtitle}`
}

export function attachBinaryData(el, filename, dataAsStr, blobType) {
  const blob = new Blob([dataAsStr], { type: blobType })

  el.href = URL.createObjectURL(blob)
  el.download = filename
}

export function formatCurrency(number, n = 2, x = 3, s = ',', c = '.') {
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')'
  const num = number.toFixed(Math.max(0, ~~n))

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ',')
  )
}

export function getFilename(filenameWithExt) {
  return filenameWithExt.split('.')[0]
}

export function convertDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}

export function titleize(sentence) {
  return sentence.split(' ').map(titleizeWord).join(' ')
}

export function convertObjectKeysToCamelCase(o) {
  let newO, origKey, newKey, value

  if (o instanceof Array) {
    return o.map(function(value) {
      if (typeof value === "object") {
        value = convertObjectKeysToCamelCase(value)
      }
      return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (toCamel(origKey))
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = convertObjectKeysToCamelCase(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

function titleizeWord(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
