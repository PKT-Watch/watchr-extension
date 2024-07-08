import { getWallet, deleteWallet } from '/js/modules/wallet.js';
import { showPage, hidePage } from '/js/modules/page.js';
import { formatAddress, unitsToPkt, unitsToPktEl, numberWithCommas } from '/js/modules/utils.js';
import { fetchWallet, fetchWalletMiningIncome, fetchWalletTransactions } from '/js/modules/api.js';
import { buildDashboard } from '/js/modules/dashboard.js';
import { showEditAddress } from '/js/pages/edit-address.js';
import { showTransactionDetails } from '/js/pages/transaction-details.js';
import '/js/modules/clipboard.js';
import { showToast } from '/js/modules/toast.js';

const totalBalanceEl = document.querySelector('#page-wallet-details .balance-header .balance');
const totalUsdEl = document.querySelector('#page-wallet-details .balance-header .usd');
const currentWalletNameEl = document.getElementById('current-wallet-name');
const addressBarEl = document.querySelector('#page-wallet-details .address-bar');
const statGridEl = document.querySelector('#page-wallet-details .stat-grid');
const chartMiningIncomeEl = document.getElementById('chart-mining-income');
const listTransactionsEl = document.querySelector('#page-wallet-details .list-transactions');
const btnWalletDetails_OpenExplorer = document.getElementById('btnWalletDetails_OpenExplorer');
const btnWalletDetails_OpenMiningStats = document.getElementById('btnWalletDetails_OpenMiningStats');
const btnWalletDetails_EditLabel = document.getElementById('btnWalletDetails_EditLabel');
const btnWalletDetails_Delete = document.getElementById('btnWalletDetails_Delete');
const btnQrCode = document.getElementById('btnQrCode');
const templateTransactionListItem = document.getElementById('template-transaction-list-item');

let chart;
const chartColors = {
    live: '#ff007a',
    dummy: '#3f4143',
    grid: '#585a5c'
}
let wallet;
let transactions;

async function showWalletDetails(address, portfolioId) {
    wallet = await getWallet(address, portfolioId);
    const walletDetails = await fetchWallet(address);
    chartMiningIncomeEl.parentElement.classList.remove('no-data');
    const loaderEl = document.createElement('div');
    loaderEl.classList.add('loader');
    listTransactionsEl.innerHTML = '';
    listTransactionsEl.appendChild(loaderEl);
    showPage('page-wallet-details');
    updateUI(walletDetails);
}

async function updateUI(walletDetails) {
    totalBalanceEl.innerHTML = '';
    totalBalanceEl.appendChild(unitsToPktEl(wallet.pkt, 2, true));
    totalUsdEl.textContent = `$${numberWithCommas(wallet.usd)}`;
    updateCurrentWalletName(wallet.label);
    addressBarEl.querySelector('.address').textContent = formatAddress(wallet.address);
    addressBarEl.querySelector('.hidden-address').textContent = wallet.address;
    statGridEl.querySelector('.mined-24').textContent = numberWithCommas(unitsToPkt(walletDetails.mined24, 2, false));
    statGridEl.querySelector('.unconsolidated').textContent = numberWithCommas(walletDetails.balanceCount, 0);
    buildMiningIncomeChart(wallet.address);
    buildTransactionList(wallet.address);
}

btnWalletDetails_OpenExplorer.addEventListener('click', () => {
    chrome.tabs.create({url: `https://packetscan.io/address/${wallet.address}`, active: false});
});

btnWalletDetails_EditLabel.addEventListener('click', () => {
    showEditAddress(wallet);
});

btnWalletDetails_OpenMiningStats.addEventListener('click', () => {
    chrome.tabs.create({url: `https://www.pkt.world/explorer?wallet=${wallet.address}&minutes=60`, active: false});
});

btnWalletDetails_Delete.addEventListener('click', async () => {
    await deleteWallet(wallet.address, wallet.portfolio_id);
    buildDashboard();
    hidePage();
});

btnQrCode.addEventListener('click', () => {
    const qrEl = document.createElement('div');
    const qrCode = new QRCode(qrEl, {
        text: wallet.address,
        width: 180,
        height: 180,
    });
    const addressEl = document.createElement('div');
    addressEl.textContent = wallet.address;
    addressEl.classList.add('address');
    qrEl.appendChild(addressEl);

    showToast({html: qrEl, type: 'qr-code', autoClose: false, overlay: true});
});

listTransactionsEl.addEventListener('click', (e) => {
    if (!e.target.closest('.list-item')) return;
    const txid = e.target.closest('.list-item').dataset.id;
    const transaction = transactions.find(transaction => transaction.txid === txid);
    showTransactionDetails(transaction, wallet);
});

function updateCurrentWalletName(name) {
    currentWalletNameEl.textContent = name;
}

async function buildTransactionList(address) {
    transactions = await fetchWalletTransactions(address);
    
    if (transactions.length === 0) {
        const emptyMessageEl = document.createElement('div');
        emptyMessageEl.classList.add('empty-message');
        listTransactionsEl.appendChild(emptyMessageEl);
        return;
    }

    listTransactionsEl.innerHTML = '';
    transactions.forEach(transaction => {
        const listItemClone = templateTransactionListItem.content.cloneNode(true);
        const listItemEl = listItemClone.querySelector('.list-item');
        listItemEl.dataset.id = transaction.txid;
        listItemEl.querySelector('.icon').appendChild(buildTransactionIcon(transaction));
        listItemEl.querySelector('.address').textContent = transaction.isFolding ? 'Folding' : transaction.isSend ? formatAddress(transaction.output.find((element) => element.address != address).address) : formatAddress(transaction.input[0].address);
        listItemEl.querySelector('.date').textContent = new Date(transaction.firstSeen).toLocaleString();
        if (transaction.isFolding) {
            listItemEl.querySelector('.value').textContent = '--';
        } else if (transaction.isSend) {
            listItemEl.querySelector('.value').textContent = `-${numberWithCommas(unitsToPkt(transaction.value, 2, false))}`;
            listItemEl.querySelector('.value').classList.add('text-danger');
        } else {
            listItemEl.querySelector('.value').textContent = `+${numberWithCommas(unitsToPkt(transaction.value, 2, false))}`;
            listItemEl.querySelector('.value').classList.add('text-success');
        }
        listTransactionsEl.appendChild(listItemEl);
    });
}

function buildTransactionIcon(transaction) {
    const imgEl = document.createElement('img');
    if (transaction.blockTime == null) {
        imgEl.src = '/img/icon-update.svg';
    } else if (transaction.isFolding) {
        imgEl.src = '/img/icon-fold.svg';
    } else if (transaction.isSend) {
        imgEl.src = '/img/icon-circle-minus.svg';
    } else {
        imgEl.src = '/img/icon-circle-plus.svg';
    }
    return imgEl;
}

async function buildMiningIncomeChart(address) {
    let income = await fetchWalletMiningIncome(address);
    let dummyData = false;
    
    if (income.reduce((a, b) => a + b, 0) === 0) {
        income = [25, 59, 31, 52, 46, 84, 97, 44, 47, 56, 82, 32, 28, 7, 15, 64, 58, 27, 2, 53, 18, 70, 89, 69, 72, 87, 47, 71, 80, 90, 90];
        dummyData = true;
        chartMiningIncomeEl.parentElement.classList.add('no-data');
    }

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                display: false,
                beginAtZero: true,
            },
            x: {
                ticks: {
                    display: false,
                    stepSize: 20,
                    maxTicksLimit: 6,
                    color: '#000',
                },
                grid: {
                    drawTicks: false,
                    color: chartColors.grid,
                },
                border: {
                    dash: [8, 4],
                }
            }
        },
        elements: {
            point: {
                borderColor: dummyData ? chartColors.dummy : chartColors.live,
                backgroundColor: dummyData ? chartColors.dummy : chartColors.live,
                radius: 4
            },
            line: {
                borderColor: dummyData ? chartColors.dummy : chartColors.live,
                borderWidth: 3
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: !dummyData,
                displayColors: false,
                backgroundColor: '#ff007a',
                callbacks: {
                    title : () => null // or function () { return null; }
                }
            }
        }
    }

    if (chart) {
        chart.data.datasets[0].data = income;
        chart.options = chartOptions;
        chart.update();
    } else {
        const ctx = chartMiningIncomeEl;

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: income.map((_, i) => i),
                datasets: [{
                    //label: '# of Votes',
                    data: income,
                }]
            },
            options: chartOptions
        });
    }
    
}

export { showWalletDetails, updateCurrentWalletName };