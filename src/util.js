export function attachBinaryData(el, filename, dataAsStr, blobType) {
  const blob = new Blob([dataAsStr], { type: blobType })

  el.href = URL.createObjectURL(blob)
  el.download = filename
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

function titleizeWord(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
