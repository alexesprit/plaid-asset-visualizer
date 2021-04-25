export function processAsset(asset) {
  return asset.items.map(convertAssetItemForChart)
}

function convertAssetItemForChart(itemInfo) {
  const { accounts, institutionName } = itemInfo
  const processedAccounts = accounts.map(convertAccountForChart)

  const longestBalances = findLongestBalances(accounts)
  const dateLabels = getDateLabels(longestBalances)
  const bankName = getBankName(institutionName)

  return {
    labels: dateLabels,
    bankName: bankName,
    accounts: processedAccounts,
  }
}

function convertAccountForChart(account) {
  const { historicalBalances, name } = account
  const data = historicalBalances.map(convertBalanceForChart)

  return { data, name }
}

function convertBalanceForChart(balance) {
  return balance.current
}

function findLongestBalances(accounts) {
  let longestBalances = []

  for (const account of accounts) {
    const { historicalBalances } = account

    const daysCount = historicalBalances.length
    if (longestBalances.length < daysCount) {
      longestBalances = historicalBalances
    }
  }

  return longestBalances
}

function getBankName(institutionName) {
  if (institutionName.toLowerCase().includes('bank')) {
    return institutionName
  }

  return `${institutionName} Bank`
}

function getDateLabels(balances) {
  return balances.map((balance) => {
    const dateObj = new Date(balance.date)
    return dateObj.toLocaleDateString()
  })
}
