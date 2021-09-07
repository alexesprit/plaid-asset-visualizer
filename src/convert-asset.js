import { convertDate } from './util'

import { Workbook } from 'exceljs/lib/exceljs.bare'

export function convertAssetToXls(asset) {
  const workbook = new Workbook()
  const balancesSheet = workbook.addWorksheet('Balances')
  const transactionsSheet = workbook.addWorksheet('Transactions')

  balancesSheet.columns = createBalancesColumns()
  transactionsSheet.columns = createTransactionColumns()

  for (const item of asset.items) {
    const { institutionName: bankName } = item

    for (const account of item.accounts) {
      const { type, subtype, name } = account
      const { historicalBalances, transactions } = account

      for (const balance of [...historicalBalances].reverse()) {
        const { date, current } = balance
        const dateAsStr = convertDate(date)

        balancesSheet.addRow({
          bank: bankName,
          account: name,
          type: type,
          subtype: subtype,
          date: dateAsStr,
          balance: current,
        })
      }

      for (const transaction of [...transactions].reverse()) {
        const { date, amount, originalDescription } = transaction
        const dateAsStr = convertDate(date)

        transactionsSheet.addRow({
          bank: bankName,
          account: name,
          date: dateAsStr,
          desc: originalDescription,
          amount: -amount,
        })
      }
    }
  }

  return workbook.xlsx.writeBuffer()
}

function createBalancesColumns() {
  return [
    {
      header: 'Bank name',
      key: 'bank',
      width: 24,
    },
    {
      header: 'Account name',
      key: 'account',
      width: 24,
    },
    {
      header: 'Type',
      key: 'type',
      width: 13,
    },
    {
      header: 'Subtype',
      key: 'subtype',
      width: 13,
    },
    {
      header: 'Date',
      key: 'date',
      width: 13,
    },
    {
      header: 'Balance',
      key: 'balance',
      width: 13,
      style: {
        numFmt: currencyFormat,
      },
    },
  ]
}

function createTransactionColumns() {
  return [
    {
      header: 'Bank name',
      key: 'bank',
      width: 24,
    },
    {
      header: 'Account name',
      key: 'account',
      width: 24,
    },
    {
      header: 'Date',
      key: 'date',
      width: 13,
    },
    {
      header: 'Description',
      key: 'desc',
      width: 24,
    },
    {
      header: 'Amount',
      key: 'amount',
      width: 13,
      style: {
        numFmt: currencyFormat,
      },
    },
  ]
}

const currencyFormat =
  '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)'
