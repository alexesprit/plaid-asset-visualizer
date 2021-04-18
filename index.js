import Chart from 'chart.js/auto'

import { processAsset } from './src/process-asset'
import { renderCharts } from './src/render-chart'

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
    const asset = JSON.parse(reader.result)
    const chartData = processAsset(asset)

    renderCharts(chartData)
  }
}
