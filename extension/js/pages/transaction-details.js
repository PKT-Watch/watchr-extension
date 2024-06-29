import { showPage, hidePage } from '/js/modules/page.js';
import { formatAddress, unitsToPkt, numberWithCommas } from '/js/modules/utils.js';

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
        listEl.insertAdjacentHTML('beforeend', `
            <div class="list-item">
                <div class="address">
                    ${ io.address }
                </div>
                <div class="trailing">
                    <!--${ io.address === wallet.address ? '' : `<button type="button" class="btn-add-address" data-address="${io.address}"><svg class="icon"><use href="#svg-add"></use></svg></button>` }-->
                </div>
            </div>
        `);
    });
}

function buildTransactionHeader() {
    transationHeaderEl.classList = 'transaction-header';
    if (transaction.blockTime == null) {
        transactionTypeEl.innerHTML = '';
        transactionIconEl.innerHTML =  '<img src="/img/icon-update.svg">';
    } else if (transaction.isFolding) {
        transactionTypeEl.innerHTML = 'Folding';
        transactionAmountEl.innerHTML = '';
        transactionIconEl.innerHTML = '<img src="/img/icon-fold.svg">';
    } else if (transaction.isSend) {
        transationHeaderEl.classList.add('sent');
        transactionTypeEl.innerHTML = 'Sent';
        transactionAmountEl.innerHTML = `-${unitsToPkt(transaction.value, 2, true)}`;
        transactionIconEl.innerHTML =  '<img src="/img/icon-circle-minus.svg">';
    } else {
        transationHeaderEl.classList.add('received');
        transactionTypeEl.innerHTML = 'Received';
        transactionAmountEl.innerHTML = `+${unitsToPkt(transaction.value, 2, true)}`;
        transactionIconEl.innerHTML =  '<img src="/img/icon-circle-plus.svg">';
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