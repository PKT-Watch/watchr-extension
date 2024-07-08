import { storage, getWallet, getWallets, updateWallets } from '/js/modules/wallet.js';
import { getPortfolio, getPortfolios, updatePortfolios } from '/js/modules/portfolio.js';
import { formatAddress, unitsToPkt, unitsToPktEl, numberWithCommas } from '/js/modules/utils.js';
import { fetchWalletBalances, fetchPrice } from '/js/modules/api.js';
import { closeDrawer } from '/js/modules/drawer.js';
import { showWalletDetails } from '/js/pages/wallet-details.js';
import { showCreateWallet } from '/js/pages/create-wallet.js';
import { showCreatePortfolio } from '/js/pages/create-portfolio.js';
//import Sortable from '/js/vendors/sortable.js';

const listWalletsEl = document.getElementById('list-wallets');
const listPotfoliosEl = document.getElementById('list-portfolios');
const totalBalanceEl = document.querySelector('.balance-header .balance');
const totalUsdEl = document.querySelector('.balance-header .usd');
const currentPortfolioNameEl = document.getElementById('current-portfolio-name');
const btnCreateWallet = document.getElementById('btnCreateWallet');
const btnCreatePortfolio = document.getElementById('btnCreatePortfolio');
const templateWalletListIem = document.getElementById('template-wallet-list-item');
const templatePortfolioListItem = document.getElementById('template-portfolio-list-item');
const templateEmptyPortfoliomessage = document.getElementById('template-empty-portfolio-message');

btnCreateWallet.addEventListener('click', () => {
  showCreateWallet();
});

btnCreatePortfolio.addEventListener('click', () => {
    closeDrawer();
    showCreatePortfolio();
});

listWalletsEl.addEventListener('click', async (e) => {
    const listItem = e.target.closest('.list-item');
    if (!listItem) return;
    const address = listItem.dataset.address;
    const portfolioId = parseInt(listItem.dataset.portfolio);
    showWalletDetails(address, portfolioId);
});

const sortableWallets = Sortable.create(listWalletsEl, {
  onEnd: function (evt) {
    updateWalletOrder();
	},
});

const sortablePortfolios = Sortable.create(listPotfoliosEl, {
  onEnd: function (evt) {
    updatePortfolioOrder();
	},
});

async function updateWalletOrder() {
  const listItems = listWalletsEl.querySelectorAll('.list-item');
  const wallets = [];
  listItems.forEach(async (listItem, index) => {
    const address = listItem.dataset.address;
    const portfolioId = parseInt(listItem.dataset.portfolio);
    const wallet = await getWallet(address, portfolioId);
    wallet.order = index;
    wallets.push(wallet);
  });
  await updateWallets(wallets);
}

async function updatePortfolioOrder() {
  const listItems = listPotfoliosEl.querySelectorAll('.list-item');
  const portfolios = [];
  listItems.forEach(async (listItem, index) => {
    const id = parseInt(listItem.dataset.id);
    const portfolio = await getPortfolio(id);
    portfolio.order = index;
    portfolios.push(portfolio);
  });
  await updatePortfolios(portfolios);
}

function buildWalletList(wallets, loading) {
    const items = [];
    wallets.sort((a,b) => a.order - b.order);
    wallets.forEach(wallet => {
      const listItemClone = templateWalletListIem.content.cloneNode(true);
      const listItemEl = listItemClone.querySelector('.list-item');
      listItemEl.dataset.address = wallet.address;
      listItemEl.dataset.portfolio = wallet.portfolio_id;
      listItemEl.querySelector('.label').textContent = wallet.label;
      listItemEl.querySelector('.address').textContent = formatAddress(wallet.address);
      const pktEl = listItemEl.querySelector('.pkt');
      const usdEl = listItemEl.querySelector('.usd');
      const loadingEl = listItemEl.querySelector('.loader');
      pktEl.appendChild(unitsToPktEl(wallet.pkt, 2, true));
      usdEl.textContent = `$${numberWithCommas(wallet.usd)}`;
      if (loading) {
        pktEl.style.display = 'none';
        usdEl.style.display = 'none';
        loadingEl.style.display = 'block';
      } else {
        pktEl.style.display = 'block';
        usdEl.style.display = 'block';
        loadingEl.style.display = 'none';
      }
      items.push(listItemEl);
    });

    listWalletsEl.replaceChildren(...items);
}

function buildPortfolioList(portfolios, selectedPortfolioId) {
    const items = [];
    portfolios.forEach(portfolio => {
        const listItemClone = templatePortfolioListItem.content.cloneNode(true);
        const listItemEl = listItemClone.querySelector('.list-item');
        listItemEl.dataset.id = portfolio.id;
        listItemEl.querySelector('.title').textContent = portfolio.label;
        if (portfolio.id === selectedPortfolioId) {
          listItemEl.classList.add('selected');
        }
        items.push(listItemEl);
    });

    listPotfoliosEl.replaceChildren(...items);
}

async function updateBalances(wallets, portfolio) {
    const price = await fetchPrice();
    const balances = await fetchWalletBalances(wallets);
    storage.set({ balance_updated: Date.now() });
    let totalBalance = 0;
    balances.forEach(balance => {
      const wallet = wallets.find(wallet => wallet.address === balance.address);
      wallet.pkt = balance.balance;
      wallet.usd = (unitsToPkt(balance.balance, 0, false) * price).toFixed(2);
      totalBalance += parseInt(balance.balance);
    });
    totalBalanceEl.replaceChildren(unitsToPktEl(totalBalance, 2, true));
    totalUsdEl.textContent = `$${(numberWithCommas(unitsToPkt(totalBalance, 0, false) * price))}`;
    storage.set({ total_balance: totalBalance });
    storage.set({ price: price });

    if (portfolio) {
      portfolio.pkt = totalBalance;
      await updatePortfolios([portfolio]);
    }
}

async function buildDashboard(overrideReloadBalances) {
    const selectedPortfolioId = (await storage.get('selected_portfolio')).selected_portfolio;
    const portfolios = await getPortfolios();
    const portfolio = portfolios.find(portfolio => portfolio.id === selectedPortfolioId);
    const wallets = await getWallets(selectedPortfolioId);
    const balanceUpdated = await storage.get('balance_updated');
    const reloadBalances = overrideReloadBalances ? true : !balanceUpdated.balance_updated || Date.now() - balanceUpdated.balance_updated > 60000;
    //const reloadBalances = true;

    buildPortfolioList(portfolios, selectedPortfolioId);

    currentPortfolioNameEl.textContent = portfolio.label;
  
    if (wallets.length === 0) {
      totalBalanceEl.replaceChildren(document.createTextNode('0.00'));
      totalUsdEl.replaceChildren(document.createTextNode('$0.00'));
      const emptyPortfolioMessageClone = templateEmptyPortfoliomessage.content.cloneNode(true);
      listWalletsEl.replaceChildren(emptyPortfolioMessageClone);
      listWalletsEl.querySelector('button').addEventListener('click', () => {
        showCreateWallet();
      });
      return;
    }
  
    buildWalletList(wallets, reloadBalances);
  
    if (reloadBalances) {
      await updateBalances(wallets, portfolio);
      buildWalletList(wallets);
      updateWallets(wallets);
    } else {
      const totalBalance = portfolio.pkt;
      const price = (await storage.get('price')).price;
      totalBalanceEl.replaceChildren(unitsToPktEl(totalBalance, 2, true));
      totalUsdEl.textContent = `$${(numberWithCommas(unitsToPkt(totalBalance, 0, false) * price))}`;
    }
}

export { buildDashboard };
