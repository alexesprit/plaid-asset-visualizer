export function processAsset(asset) {
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
  const data = historicalBalances
    .filter(filterLeadingZeroBalance)
    .map(convertBalanceForChart)

  return { data, name }
}

function convertBalanceForChart(balance) {
  return balance.current
}

function filterLeadingZeroBalance(balance, index, balances) {
  const prevBalance = balances[index - 1]
  if (prevBalance && isBalancePresent(prevBalance)) {
    return true
  }

  return isBalancePresent(balance)
}

function findLongestBalances(accounts) {
  let longestBalances = []

  for (const account of accounts) {
    const { historicalBalances } = account
    const balances = historicalBalances.filter(filterLeadingZeroBalance)

    const daysCount = balances.length
    if (longestBalances.length < daysCount) {
      longestBalances = balances
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
