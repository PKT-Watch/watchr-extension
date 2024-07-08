import { showPage } from '/js/modules/page.js';
import { unitsToPktEl } from '/js/modules/utils.js';

const pageEl = document.getElementById('page-transaction-details');
const transationHeaderEl = pageEl.querySelector('.transaction-header');
const transactionTypeEl = transationHeaderEl.querySelector('.type');
const transactionIconEl = transationHeaderEl.querySelector('.icon');
const transactionAmountEl = transationHeaderEl.querySelector('.amount');
const transactionDateEl = pageEl.querySelector('.transaction-date .date');
const txidEl = pageEl.querySelector('.txid');
const txidHiddenEl = pageEl.querySelector('.hidden-txid');
const listInputsEl = pageEl.querySelector('.list-inputs');
const listOutputsEl = pageEl.querySelector('.list-outputs');
const btnTransactionDetails_OpenExplorer = document.getElementById('btnTransactionDetails_OpenExplorer');
const templateIoListItem = document.getElementById('template-io-list-item');

let transaction;
let wallet;

async function showTransactionDetails(_transaction, _wallet) {
    transaction = _transaction;
    wallet = _wallet;
    updateUI();
    showPage('page-transaction-details');
}

async function updateUI() {
    transactionDateEl.textContent = new Date(transaction.blockTime).toLocaleString();
    txidEl.textContent = transaction.txid;
    txidHiddenEl.textContent = transaction.txid;
    buildTransactionHeader();
    buildIOList(transaction.input, listInputsEl);
    buildIOList(transaction.output, listOutputsEl);
}

function buildIOList(ios, listEl) {
    listEl.innerHTML = '';
    ios.forEach(io => {
        const listItemClone = templateIoListItem.content.cloneNode(true);
        listItemClone.querySelector('.address').textContent = io.address;
        listEl.appendChild(listItemClone);
    });
}

function buildTransactionHeader() {
    transationHeaderEl.classList = 'transaction-header';
    transactionTypeEl.innerHTML = '';
    transactionAmountEl.innerHTML = '';
    transactionIconEl.innerHTML = '';
    const iconElement = document.createElement('img');

    if (transaction.blockTime == null) {
        iconElement.src = '/img/icon-update.svg';
        transactionIconEl.appendChild(iconElement);

    } else if (transaction.isFolding) {
        transactionTypeEl.textContent = 'Folding';
        iconElement.src = '/img/icon-fold.svg';
        transactionIconEl.appendChild(iconElement);

    } else if (transaction.isSend) {
        transationHeaderEl.classList.add('sent');
        transactionTypeEl.textContent = 'Sent';
        transactionAmountEl.textContent = '-';
        transactionAmountEl.appendChild(unitsToPktEl(transaction.value, 2, true));
        iconElement.src = '/img/icon-circle-minus.svg';
        transactionIconEl.appendChild(iconElement);

    } else {
        transationHeaderEl.classList.add('received');
        transactionTypeEl.textContent = 'Received';
        transactionAmountEl.textContent = '+';
        transactionAmountEl.appendChild(unitsToPktEl(transaction.value, 2, true));
        iconElement.src = '/img/icon-circle-plus.svg';
        transactionIconEl.appendChild(iconElement);
    }
}

// listInputsEl.addEventListener('click', (e) => {
//     const btn = e.target.closest('.btn-add-address');
//     if (btn) {
//         const address = btn.getAttribute('data-address');
//         console.log('Add address', address);
//     }
// });

btnTransactionDetails_OpenExplorer.addEventListener('click', () => {
    chrome.tabs.create({url: `https://packetscan.io/tx/${transaction.txid}`, active: false});
});

export { showTransactionDetails };