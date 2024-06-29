import { updateWallets } from '/js/modules/wallet.js';
import { showPage, hidePage } from '/js/modules/page.js';
import { buildDashboard } from '/js/modules/dashboard.js';
import { updateCurrentWalletName } from '/js/pages/wallet-details.js';

const txtEditAddress_Label = document.getElementById('txtEditAddress_Label');
const btnEditAddress = document.getElementById('btnEditAddress');
let wallet;

async function showEditAddress(_wallet) {
    wallet = _wallet;
    txtEditAddress_Label.value = wallet.label;

    showPage('page-edit-address');
}

btnEditAddress.addEventListener('click', async () => {
    let label = txtEditAddress_Label.value;

    if (!label) {
        alert('Please enter a label');
        return;
    }

    if (label.length > 50) {
        label = label.substring(0, 50);
    }

    wallet.label = label;

    await updateWallets([wallet]);
    buildDashboard();
    updateCurrentWalletName(wallet.label);
    hidePage('page-edit-address');
});

export { showEditAddress };