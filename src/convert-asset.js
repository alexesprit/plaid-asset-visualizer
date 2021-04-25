import { convertDate } from './util'

export function convertAssetToCsv(asset) {
  const outputBuf = []

  outputBuf.push('bank;type;subtype;date;balance')

  for (const item of asset.items) {
    const { institutionName: bankName } = item

    for (const account of item.accounts) {
      const { type, subtype } = account
      const { historicalBalances } = account

      for (const balance of [...historicalBalances].reverse()) {
        const { date, current } = balance

        const dateAsStr = convertDate(date)
        const normalizedBalance = convertBalance(current)

        outputBuf.push(
          `${bankName};${type};${subtype};${dateAsStr};${normalizedBalance}`
        )
      }
    }
  }

  return outputBuf.join('\n')
}

function convertBalance(balance) {
  return balance.toString().replace('.', ',')
}
