export function processAsset(assetContents) {
  const asset = JSON.parse(assetContents)

  return asset.items.map(convertAssetItemForChart)
}

function convertAssetItemForChart(itemInfo) {
  const { accounts, institutionName } = itemInfo
  const processedAccounts = accounts
    .filter(shouldProcessAccount)
    .map(convertAccountForChart)

  const longestBalances = findLongestBalances(accounts)
  const dateLabels = getDateLabels(longestBalances)

  return {
    labels: dateLabels,
    bankName: institutionName,
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

function getDateLabels(balances) {
  return balances.map((balance) => {
    const dateObj = new Date(balance.date)
    return dateObj.toLocaleDateString()
  })
}

function shouldProcessAccount(account) {
  const { historicalBalances } = account

  return historicalBalances.some(isBalancePresent)
}

function isBalancePresent(balance) {
  return balance.current !== 0
}
