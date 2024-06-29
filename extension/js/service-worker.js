// Seed the initial list of portfolios
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      chrome.storage.local.set({
        // wallets: [
        //   {label: 'Pkt.watch', address: 'pkt1q6sj0mchq7ltwm8c9tpm2wteqmeldr2ye5lcr60', pkt: 0.00, usd: 0.00, portfolio_id: 1, order: 1}, 
        //   {label: 'Main', address: 'pkt1qgjtzma5380t4470v56fqg35sum0qxw8p99rt9j', pkt: 0.00, usd: 0.00, portfolio_id: 1, order: 0},
        // ],
        portfolios: [
          {label: 'Main Portfolio', id: 1, pkt: 0.00, usd: 0.00, order: 0}, 
          //{label: 'Another', id: 2, pkt: 0.00, usd: 0.00, order: 1}
        ],
        selected_portfolio: 1
      });
    }
});

// Handle events raised in content-script.js
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === 'watchAddress') {
      //console.log('watchAddress event received');

      // Send message to see if there is a popup window open
      // If there is, the message will be handled in popup.js
      chrome.runtime.sendMessage({
        action: "watchAddress",
        address: request.address
      }, null, function(response) {
          if (chrome.runtime.lastError) {
              // No one listening
              // Create a new window
              //console.log('No one listening');
              chrome.windows.create({
                url: chrome.runtime.getURL(`popup.html?action=watchAddress&address=${request.address}`),
                type: "popup",
                top: 200,
                //left: screen.width-360,
                width: 360,
                height: 600,
            });
          } else {
              // Someone is listening
              // The messaage will be handled in popup.js
          }
      });   
    }
  }
);

// Listen for changes to storage
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//       console.log(
//         `Storage key "${key}" in namespace "${namespace}" changed.`,
//         `Old value was "${oldValue}", new value is "${newValue}".`
//       );
//     }
// });