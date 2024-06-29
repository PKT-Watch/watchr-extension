import { hidePage } from '/js/modules/page.js';
import { storage } from '/js/modules/wallet.js';
import { buildDashboard } from '/js/modules/dashboard.js';
import { openDrawer, closeDrawer } from '/js/modules/drawer.js';
import { showEditPortfolio } from '/js/pages/edit-portfolio.js';
import { showCreateWallet } from '/js/pages/create-wallet.js';
import '/js/modules/dropdown.js';

const listPortfoliosEl = document.getElementById('list-portfolios');
const btnOpenDrawer = document.getElementById('btnOpenDrawer');
const drawer = document.getElementById('drawer');
const btnPageClose = document.querySelectorAll('.btn-page-close');
const btnEditPortfolios = document.getElementById('btnEditPortfolios');
const btnDrawer_PktWatch = document.getElementById('btnDrawer_PktWatch');
const appVersionEl = document.getElementById('app-version');

addEventListener("load", (event) => {
  // Prevents flash of unstyled content from offscreen elements
  document.body.classList.add('loaded');
});

btnOpenDrawer.addEventListener('click', (e) => {
  e.stopPropagation();
  openDrawer();
});

btnPageClose.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.closest('.page').id;
    hidePage(id);
  });
});

btnEditPortfolios.addEventListener('click', () => {
  listPortfoliosEl.classList.toggle('edit-mode');
});

btnDrawer_PktWatch.addEventListener('click', () => {
  const url = 'https://pkt.watch';
  chrome.tabs.create({ url, active: true });
});

listPortfoliosEl.addEventListener('click', async (e) => {
  const selected_portfolio = e.target.closest('.list-item');
  if (!selected_portfolio) return;
  const portfolioId = parseInt(selected_portfolio.dataset.id);
  if (listPortfoliosEl.classList.contains('edit-mode')) {
    closeDrawer();
    showEditPortfolio(portfolioId);
    listPortfoliosEl.classList.toggle('edit-mode');
    return;
  };
  drawer.classList.remove('active');
  await storage.set({ selected_portfolio: portfolioId });
  buildDashboard();
});

appVersionEl.innerText = `Version ${chrome.runtime.getManifest().version}`;

// If the window is created from service-worker.js, we will have query parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('action') && urlParams.get('action') === 'watchAddress') {
  showCreateWallet(urlParams.get('address'));
}

// If the window is already open, we will receive a message from service-worker.js
chrome.runtime.onMessage.addListener((request, sender, response) => {
  //console.log('popup.js received message from service-worker.js');
  //console.log(request);

  if (request.action && request.action === 'watchAddress') {
    showCreateWallet(request.address);
  }

  // Must respond to the message to signal that the window already exists
  response('Hello from popup.js!');
});

buildDashboard();