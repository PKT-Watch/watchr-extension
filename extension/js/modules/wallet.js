const storage = chrome.storage.local;

async function getWallet(address, portfolioId) {
    let wallets = (await storage.get('wallets')).wallets;
    return wallets.find(wallet => wallet.address === address && wallet.portfolio_id === portfolioId);
}

async function getWallets(portfolioId) {
    let wallets = (await storage.get('wallets')).wallets || [];
    if (portfolioId) {
      return wallets.filter(wallet => wallet.portfolio_id === portfolioId);
    }
  
    return wallets;
}

async function storeWallets(wallets) {
    await storage.set({ wallets: wallets });
}

async function updateWallets(wallets) {
    let currentWallets = await getWallets();
    currentWallets = currentWallets.map(wallet => wallets.find(w => w.address === wallet.address && w.portfolio_id === wallet.portfolio_id) || wallet);
    await storeWallets(currentWallets);
}

async function deleteWallet(address, portfolioId) {
    let wallets = await getWallets();
    wallets = wallets.filter(wallet => (wallet.address !== address || wallet.portfolio_id !== portfolioId));
    await storeWallets(wallets);
}

async function deleteWalletsByPortfolio(portfolioId) {
    let wallets = await getWallets();
    wallets = wallets.filter(wallet => wallet.portfolio_id !== portfolioId);
    await storeWallets(wallets);
}

export { storage, getWallet, getWallets, storeWallets, updateWallets, deleteWallet, deleteWalletsByPortfolio };