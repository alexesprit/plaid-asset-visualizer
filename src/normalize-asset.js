export function normalizeAsset(asset) {
  const { items, ...rest } = asset
  const normalizedItems = items.map(normalizeItem)

  return { items: normalizedItems, rest }
}

export function normalizeItem(item) {
  const { accounts, ...rest } = item
  const filteredAccounts = accounts
    .filter(shouldProcessAccount)
    .map(normalizeAccount)

  return { ...rest, accounts: filteredAccounts }
}

function normalizeAccount(account) {
  const { historicalBalances, name, mask, ...rest } = account
  const filteredBalances = historicalBalances.filter(filterLeadingZeroBalance)
  const fullName = normalizeAccountName(name, mask)

  return {
    ...rest,
    mask,
    name: fullName,
    historicalBalances: filteredBalances,
  }
}

function normalizeAccountName(accountName, mask) {
  if (accountName.includes(mask)) {
    return accountName
  }

  return `${accountName} (${mask})`
}

function shouldProcessAccount(account) {
  const { historicalBalances } = account

  return historicalBalances.some(isBalancePresent)
}

function filterLeadingZeroBalance(balance, index, balances) {
  const prevBalance = balances[index - 1]
  if (prevBalance && isBalancePresent(prevBalance)) {
    return true
  }

  return isBalancePresent(balance)
}

function isBalancePresent(balance) {
  return balance.current !== 0
}
