import { deleteWalletsByPortfolio } from '/js/modules/wallet.js';
import { showToast } from '/js/modules/toast.js';

const storage = chrome.storage.local;

async function getPortfolio(portfolioId) {
    let portfolios = (await storage.get('portfolios')).portfolios;
    return portfolios.find(portfolio => portfolio.id === portfolioId);
}

async function getPortfolios(portfolioId) {
    let portfolios = (await storage.get('portfolios')).portfolios;
    portfolios.sort((a,b) => a.order - b.order);
    if (portfolioId) {
      return portfolios.filter(portfolio => portfolio.id === portfolioId);
    }
 
    return portfolios;
}

async function storePortfolios(portfolios) {
    await storage.set({ portfolios: portfolios });
}

async function updatePortfolios(portfolios) {
    let currentPortfolios = await getPortfolios();
    currentPortfolios = currentPortfolios.map(portfolio => portfolios.find(w => w.id === portfolio.id) || portfolio);
    await storePortfolios(currentPortfolios);
}

async function deletePortfolio(portfolioId) {
    let portfolios = await getPortfolios();
    portfolios = portfolios.filter(portfolio => portfolio.id !== portfolioId);

    if (portfolios.length === 0) {
        showToast({ message: 'You need at least one portfolio', type: 'error'});
        return;
    }

    await storePortfolios(portfolios);
    await deleteWalletsByPortfolio(portfolioId);
}

export { storage, getPortfolio, getPortfolios, storePortfolios, updatePortfolios, deletePortfolio };