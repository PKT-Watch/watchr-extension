import { storage, getPortfolio, getPortfolios, deletePortfolio, updatePortfolios } from '/js/modules/portfolio.js';
import { showPage, hidePage } from '/js/modules/page.js';
import { buildDashboard } from '/js/modules/dashboard.js';

const txtEditPortfolio_Label = document.getElementById('txtEditPortfolio_Label');
const btnEditPortfolio = document.getElementById('btnEditPortfolio');
const btnEditPortfolio_Delete = document.getElementById('btnEditPortfolio_Delete');
let portfolio;

async function showEditPortfolio(portfolioId) {
    portfolio = await getPortfolio(portfolioId);
    txtEditPortfolio_Label.value = portfolio.label;

    showPage('page-edit-portfolio');
}

btnEditPortfolio.addEventListener('click', async () => {
    let label = txtEditPortfolio_Label.value;

    if (!label) {
        alert('Please enter a label');
        return;
    }

    if (label.length > 50) {
        label = label.substring(0, 50);
    }

    portfolio.label = label;

    await updatePortfolios([portfolio]);
    buildDashboard();
    hidePage();
});

btnEditPortfolio_Delete.addEventListener('click', async () => {
    await deletePortfolio(portfolio.id);
    const portfolios = await getPortfolios();
    await storage.set({ selected_portfolio: portfolios[0].id });
    buildDashboard();
    hidePage();
});

export { showEditPortfolio };