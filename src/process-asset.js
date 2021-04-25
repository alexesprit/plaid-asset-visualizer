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
  const bankName = getBankName(institutionName)

  return {
    labels: dateLabels,
    bankName: bankName,
    accounts: processedAccounts,
  }
}

function convertAccountForChart(account) {
  const { historicalBalances, name, mask } = account
  const data = historicalBalances
    .filter(filterLeadingZeroBalance)
    .map(convertBalanceForChart)
  const fullName = normalizeAccountName(name, mask)

  return { data, name: fullName }
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

function shouldProcessAccount(account) {
  const { historicalBalances } = account

  return historicalBalances.some(isBalancePresent)
}

function isBalancePresent(balance) {
  return balance.current !== 0
}

function normalizeAccountName(accountName, mask) {
  if (accountName.includes(mask)) {
    return accountName
  }

  return `${accountName} (${mask})`
}
