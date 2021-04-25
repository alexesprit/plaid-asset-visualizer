import { convertDate } from './util'

export function renderTransactions(asset) {
  const { items } = asset
  const globalContainer = getGlobalContainer()
  const hintElement = getHintElement()

  globalContainer.innerHTML = ''
  hintElement.hidden = true

  for (const item of items) {
    const { accounts, institutionName } = item

    for (const account of accounts) {
      const { transactions, name } = account
      if (transactions.length > 0 && hintElement.hidden) {
        hintElement.hidden = false
      }

      const nameEl = createNameElement(name, institutionName)
      const listEl = createListElement()
      const spoilerEl = createSpoilerElement()
      const transactionsEl = createTransactionsContainer()

      spoilerEl.append(listEl)
      transactionsEl.append(nameEl, spoilerEl)
      globalContainer.append(transactionsEl)

      renderTransactionsList(transactions, listEl)
    }
  }
}

function renderTransactionsList(transactions, listEl) {
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
}

function getGlobalContainer() {
  return document.querySelector('.transactions')
}

function getHintElement() {
  return document.querySelector('.hint')
}

function createTransactionsContainer() {
  const container = document.createElement('div')
  container.classList.add('transactions__info')

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
  nameEl.classList.add('transactions__name')

  const accountNameEl = document.createElement('div')
  accountNameEl.classList.add('transactions__account-name')
  accountNameEl.textContent = accountName

  const bankNameEl = document.createElement('div')
  bankNameEl.classList.add('transactions__bank-name')
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
  amountEl.textContent = `$${Math.abs(amount)}`

  container.append(dateEl, descEl, amountEl)
  return container
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
