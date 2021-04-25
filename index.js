import Chart from 'chart.js/auto'

import { processAsset } from './src/process-asset'
import { renderCharts } from './src/render-chart'
import { attachBinaryData, getFilename } from './src/util'
import { normalizeAsset } from './src/normalize-asset'
import { convertAssetToCsv } from './src/convert-asset'

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

  reader.onloadend = function () {
    const rawAsset = JSON.parse(reader.result)
    const normalizedAsset = normalizeAsset(rawAsset)

    const assetAsChart = processAsset(normalizedAsset)
    const assetAsCsv = convertAssetToCsv(normalizedAsset)
    const filename = getFilename(file.name, 'csv')

    renderCharts(assetAsChart)
    applyDataForDownloadButton(assetAsCsv, filename)
  }
}

function applyDataForDownloadButton(assetAsCsv, filename) {
  const fullname = `${filename}.csv`

  const downloadButton = document.querySelector('.drop-area__download')
  downloadButton.hidden = false

  attachBinaryData(downloadButton, fullname, assetAsCsv, 'text/csv')
}
