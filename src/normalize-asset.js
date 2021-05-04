import { titleize } from './util'

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
  const { historicalBalances, name, ...rest } = account
  const { mask, subtype } = rest

  const filteredBalances = historicalBalances.filter(filterLeadingZeroBalance)
  const fullName = normalizeAccountName(name, mask, subtype)

  return {
    ...rest,
    name: fullName,
    historicalBalances: filteredBalances,
  }
}

function normalizeAccountName(accountName, mask, subtype) {
  let newName = titleize(accountName)
  let newNameLowerCase = newName.toLowerCase()

  if (subtype === 'credit card' && !newNameLowerCase.includes('credit')) {
    if (newNameLowerCase.includes('card')) {
      newName = newName.replace(/Card/i, 'Credit Card')
    } else {
      newName = `${newName} Credit Card`
    }
  }

  if (newName.includes(mask)) {
    return newName
  }

  return `${newName} (${mask})`
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
