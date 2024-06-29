import { storage, getPortfolios, storePortfolios } from '/js/modules/portfolio.js';
import { showPage, hidePage } from '/js/modules/page.js';
import { buildDashboard } from '/js/modules/dashboard.js';

const btnAddPortfolio = document.getElementById('btnAddPortfolio');
const txtAddPortfolio_Label = document.getElementById('txtAddPortfolio_Label');

async function showCreatePortfolio() {
    txtAddPortfolio_Label.value = '';

    showPage('page-add-portfolio');
}

btnAddPortfolio.addEventListener('click', createPortfolio);

async function createPortfolio() {
    let label = txtAddPortfolio_Label.value;

    if (!label) {
        alert('Please enter a label');
        return;
    }

    if (label.length > 50) {
        label = label.substring(0, 50);
    }

    const portfolios = await getPortfolios();
    const id = portfolios.length+1;
    portfolios.push({ label, id, pkt: 0.00, usd: 0.00});
    await storePortfolios(portfolios);
    await storage.set({ selected_portfolio: id });

    txtAddPortfolio_Label.value = '';

    buildDashboard(true);
    hidePage();
}

export { showCreatePortfolio };