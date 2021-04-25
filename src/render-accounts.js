import { convertDate, formatCurrency, titleize } from './util'

export function renderAccounts(asset) {
  const { items } = asset
  const globalContainer = getGlobalContainer()
  const hintElement = getHintElement()

  globalContainer.innerHTML = ''
  hintElement.hidden = true

  for (const item of items) {
    const { accounts, institutionName } = item

    for (const account of accounts) {
      const { transactions } = account
      if (transactions.length > 0 && hintElement.hidden) {
        hintElement.hidden = false
      }

      const accountEl = createAccountSummaryElement()
      renderAccountSummary(account, institutionName, accountEl)

      globalContainer.append(accountEl)
    }
  }
}

function renderAccountSummary(account, bankName, container) {
  const { transactions, owners, name } = account

  const nameEl = createNameElement(name, bankName)
  const transactionsEl = createTransactionsContainer(transactions)
  const ownersEl = createOwnersInfoElement(owners)

  container.append(nameEl, ownersEl, transactionsEl)
}

function createTransactionsContainer(transactions) {
  const listEl = createListElement()
  const reversedTransactions = [...transactions].reverse()

  for (const transaction of reversedTransactions) {
    const { date, originalDescription, amount } = transaction
    const dateAsStr = convertDate(date)

    const transactionEl = createTransactionElement(
      dateAsStr,
      originalDescription,
      amount
    )

    listEl.append(transactionEl)
  }

  const spoilerEl = createSpoilerElement()
  spoilerEl.append(listEl)

  return spoilerEl
}

function createOwnersInfoElement(owners) {
  const ownersEl = createOwnersElement()

  for (const owner of owners) {
    const { phoneNumbers, emails, names } = owner

    const namesList = createInfoList(names.map(convertName))
    const addressList = createInfoList(emails.map(convertEmail))
    const phoneList = createInfoList(phoneNumbers)

    ownersEl.append(namesList, addressList, phoneList)
  }

  return ownersEl
}

function getGlobalContainer() {
  return document.querySelector('.transactions')
}

function getHintElement() {
  return document.querySelector('.hint')
}

function createAccountSummaryElement() {
  const container = document.createElement('div')
  container.classList.add('account-summary')

  return container
}

function createOwnersElement() {
  const container = document.createElement('div')
  container.classList.add('owner')

  return container
}

function createListElement() {
  const listEl = document.createElement('ul')
  listEl.classList.add('transactions__list')
  listEl.addEventListener('click', handleOnListClick)

  return listEl
}

function createNameElement(accountName, bankName) {
  const nameEl = document.createElement('div')
  nameEl.classList.add('account')

  const accountNameEl = document.createElement('div')
  accountNameEl.classList.add('account__name')
  accountNameEl.textContent = accountName

  const bankNameEl = document.createElement('div')
  bankNameEl.classList.add('account__bank')
  bankNameEl.textContent = bankName

  nameEl.append(accountNameEl, bankNameEl)
  return nameEl
}

function createSpoilerElement() {
  const detailsEl = document.createElement('details')
  const summaryEl = document.createElement('summary')
  summaryEl.textContent = 'Transactions (click to expand)'
  summaryEl.classList.add('transactions__summary')

  detailsEl.append(summaryEl)
  return detailsEl
}

function createTransactionElement(dateAsStr, desc, amount) {
  const container = document.createElement('li')
  container.classList.add('transaction')

  const dateEl = document.createElement('span')
  dateEl.classList.add('transaction__date')
  dateEl.textContent = dateAsStr

  const descEl = document.createElement('span')
  descEl.classList.add('transaction__desc')
  descEl.title = desc
  descEl.textContent = desc

  const colorClass = amount < 0 ? 'debit' : 'credit'
  const amountEl = document.createElement('span')
  amountEl.classList.add('transaction__amount', colorClass)
  amountEl.textContent = `$${formatCurrency(Math.abs(amount))}`

  container.append(dateEl, descEl, amountEl)
  return container
}

function createInfoList(entries) {
  const listEl = document.createElement('ul')
  listEl.classList.add('owner__info-list')

  for (const element of getUniqueEntries(entries)) {
    const { data, primary } = element
    const itemEl = createInfoElement(data, { isPrimary: primary })

    listEl.append(itemEl)
  }

  return listEl
}

function createInfoElement(text, { isPrimary = false } = {}) {
  const itemEl = document.createElement('li')
  itemEl.classList.add('owner__info-item')
  itemEl.textContent = text

  return itemEl
}

function handleOnListClick(evt) {
  const { target, altKey } = evt

  if (altKey) {
    collapseDetails(target)
  }
}

function collapseDetails(element) {
  const closestSpoilerEl = element.closest('details')
  closestSpoilerEl.open = false
}

function convertName(name) {
  return { data: titleize(name) }
}

function convertEmail(emailEntry) {
  const { data, ...rest } = emailEntry
  return { ...rest, data: data.toLowerCase() }
}

function getUniqueEntries(entries) {
  const result = []
  const uniqueData = new Set()

  for (const entry of entries) {
    const { data } = entry

    if (!uniqueData.has(data)) {
      uniqueData.add(data)
      result.push(entry)
    }
  }

  return result
}
