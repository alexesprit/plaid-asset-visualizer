import Chart from 'chart.js/auto'

import { processAsset } from './src/process-asset'
import { renderCharts } from './src/render-chart'
import {
  attachBinaryData,
  getFilename,
  setTitle,
  convertObjectKeysToCamelCase,
} from './src/util'
import { normalizeAsset } from './src/normalize-asset'
import { convertAssetToXls } from './src/convert-asset'
import { renderAccounts } from './src/render-accounts'

setupDragArea()
setupAssetInput()

Chart.defaults.font.family = 'Inter, sans-serif'

function setupDragArea() {
  const dropZone = document.querySelector('.dropzone')

  window.addEventListener('dragenter', () => {
    showDropZone()
  })

  dropZone.addEventListener('dragleave', () => {
    hideDropZone()
  })

  dropZone.addEventListener('drop', (evt) => {
    evt.preventDefault()

    hideDropZone()
    handleDrop(evt)
  })

  dropZone.addEventListener('dragenter', allowDrag)
  dropZone.addEventListener('dragover', allowDrag)

  function showDropZone() {
    dropZone.style.display = 'block'
  }

  function hideDropZone() {
    dropZone.style.display = 'none'
  }

  function allowDrag(evt) {
    const { dataTransfer } = evt

    if (dataTransfer.types.includes('Files')) {
      dataTransfer.dropEffect = 'copy'

      evt.preventDefault()
    }
  }
}

function setupAssetInput() {
  const assertInput = document.querySelector('.form-area__input')

  assertInput.addEventListener('change', handleFileSelect)
}

function handleDrop(evt) {
  const { dataTransfer } = evt

  readAsset(dataTransfer.files[0])
}

function handleFileSelect() {
  readAsset(this.files[0])
}

function readAsset(file) {
  const reader = new FileReader()
  reader.readAsText(file)

  reader.onloadend = async () => {
    const rawAsset = convertObjectKeysToCamelCase(JSON.parse(reader.result))
    console.log(rawAsset)
    const normalizedAsset = normalizeAsset(rawAsset)

    const assetAsChart = processAsset(normalizedAsset)
    const filename = getFilename(file.name)

    setTitle(filename)
    renderCharts(assetAsChart)
    renderAccounts(normalizedAsset)

    const assetAsBinary = await convertAssetToXls(normalizedAsset)
    applyDataForDownloadButton(assetAsBinary, filename)
  }
}

function applyDataForDownloadButton(assetAsBinary, filename) {
  const fullname = `${filename}.xlsx`

  const downloadButton = document.querySelector('.form-area__download')
  downloadButton.hidden = false

  attachBinaryData(
    downloadButton,
    fullname,
    assetAsBinary,
    'application/octet-stream'
  )
}
