import Chart from 'chart.js/auto'

const chartColors = [
  [249, 65, 68],
  [243, 114, 44],
  [249, 199, 79],
  [144, 190, 109],
  [67, 170, 139],
  [87, 117, 144],
]

export function renderCharts(chartData) {
  const chartList = document.querySelector('.charts')
  chartList.innerHTML = ''

  for (const data of chartData) {
    const chatContainer = renderChart(data)
    chartList.append(chatContainer)
  }
}

function renderChart(chartData) {
  const { accounts, bankName, labels } = chartData
  const chartContainer = createChartContainer()

  const ctx = chartContainer.querySelector('.chart__canvas').getContext('2d')
  const header = chartContainer.querySelector('.chart__header')

  header.textContent = bankName

  const colorsCount = chartColors.length
  const randomIndexOffset = Math.floor(Math.random() * colorsCount)

  const datasets = accounts.map((data, index) => {
    const [r, g, b] = chartColors[(index + randomIndexOffset) % colorsCount]

    return {
      label: data.name,
      data: data.data,
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
      borderWidth: 2,
    }
  })

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          reverse: true,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  })

  return chartContainer
}

function createChartContainer() {
  const chartContainer = document.createElement('div')
  chartContainer.classList.add('chart')

  const chartBankName = document.createElement('h2')
  chartBankName.classList.add('chart__header')

  const chartCanvas = document.createElement('canvas')
  chartCanvas.classList.add('chart__canvas')

  chartContainer.append(chartBankName, chartCanvas)
  return chartContainer
}
