import { unitsToPkt } from '/js/modules/utils.js';
import { AddressTransaction } from '/js/modules/address-transaction.js';

const apiUrl = 'https://api.packetscan.io/api/v1/PKT/pkt';

async function makeRequest(endpoint) {
    const res = await fetch(`${apiUrl}${endpoint}`);
    if (res.ok) return await res.json();
    return null;
}

async function fetchWalletBalances(wallets) {
    let query = '';
    let separator = '?';
    for (var i = 0; i < wallets.length; i++) {
      if (i > 0) separator = '&';
      query += `${separator}address=${wallets[i].address}`;
    }
    const balances = await makeRequest(`/balance/${query}`);
    return balances;
}

async function fetchWallet(address) {
    const wallet = await makeRequest(`/address/${address}`);
    return wallet;
}

async function fetchWalletMiningIncome(address) {
    const miningIncome = [];
    const res = (await makeRequest(`/address/${address}/income/30?mining=only`)).results;
    res.reverse().forEach(item => {
        miningIncome.push(unitsToPkt(parseInt(item.received), 0, false));
    });
    return miningIncome;
}

async function fetchWalletTransactions(address) {
    const transactions = [];
    const res = (await makeRequest(`/address/${address}/coins/50/1/?mining=excluded`)).results;
    res.forEach(item => {
        const trans = new AddressTransaction(item, address);
        transactions.push(trans);
    });
    return transactions;
}

async function fetchPrice() {
    const res = await fetch('https://api.pkt.watch/v1/network/price');
    if (res.ok) {
        const json = await res.json();
        return await json.pkt;
    }
}

export { fetchWallet, fetchWalletBalances, fetchWalletMiningIncome, fetchWalletTransactions, fetchPrice };