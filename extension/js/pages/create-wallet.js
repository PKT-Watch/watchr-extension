import { storage, getWallets, storeWallets } from '/js/modules/wallet.js';
import { getPortfolios } from '/js/modules/portfolio.js';
import { showPage, hidePage } from '/js/modules/page.js';
import { buildDashboard } from '/js/modules/dashboard.js';
import { fetchWallet } from '/js/modules/api.js';
import { showToast } from '/js/modules/toast.js';

const btnAddWallet = document.getElementById('btnAddWallet');
const txtAddWallet_Address = document.getElementById('txtAddWallet_Address');
const txtAddWallet_Label = document.getElementById('txtAddWallet_Label');
const ddlAddWallet_Portfolio = document.getElementById('ddlAddWallet_Portfolio');

async function showCreateWallet(address = '') {
    txtAddWallet_Address.value = address;
    txtAddWallet_Label.value = '';

    const selected_portfolio = (await storage.get('selected_portfolio')).selected_portfolio;
    const portfolios = await getPortfolios();

    portfolios.forEach(portfolio => {
        const option = document.createElement('option');
        option.value = portfolio.id;
        option.innerText = portfolio.label;
        ddlAddWallet_Portfolio.appendChild(option);
    });

    ddlAddWallet_Portfolio.value = selected_portfolio;

    showPage('page-add-address');
}

btnAddWallet.addEventListener('click', createWallet);

async function createWallet() {
    const address = txtAddWallet_Address.value;
    let label = txtAddWallet_Label.value;

    if (!address) {
        alert('Please enter an address');
        return;
    }

    if (!label) {
        label = `Address ${address.slice(-6)}`
    }

    const wallet = await fetchWallet(address);

    if (!wallet) {
        showToast({message: 'That address doesn\'t seem to be a valid PKT address.', type: 'error'});
        return;
    }

    const selected_portfolio = parseInt(ddlAddWallet_Portfolio.value);
    const wallets = await getWallets();

    const existingWallet = wallets.find(w => w.address === address && w.portfolio_id === selected_portfolio);

    if (existingWallet) {
        showToast({message: 'That address is already in your portfolio.', type: 'error'});
        return;
    }

    wallets.push({ address, label, portfolio_id: selected_portfolio, pkt: 0.00, usd: 0.00, order: wallets.length});
    await storeWallets(wallets);
    await storage.set({ selected_portfolio: selected_portfolio });

    txtAddWallet_Address.value = '';
    txtAddWallet_Label.value = '';

    buildDashboard(true);
    hidePage();
}

export { showCreateWallet };