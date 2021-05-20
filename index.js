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
  const dropArea = document.querySelector('.drop-area')

  function highlight() {
    dropArea.classList.add('highlight')
  }

  function unhighlight() {
    dropArea.classList.remove('highlight')
  }

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  ;['dragenter', 'dragover'].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight)
  })
  ;['dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight)
  })

  dropArea.addEventListener('drop', handleDrop, false)
}

function setupAssetInput() {
  const assertInput = document.querySelector('.drop-area__input')

  assertInput.addEventListener('change', handleFileSelect)
}

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
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

  const downloadButton = document.querySelector('.drop-area__download')
  downloadButton.hidden = false

  attachBinaryData(
    downloadButton,
    fullname,
    assetAsBinary,
    'application/octet-stream'
  )
}
