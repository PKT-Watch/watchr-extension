# Watchr - Browser Extension

<p align="center">
    <img src="https://github.com/PKT-Watch/watchr-extension/blob/main/assets/app-store-branding.png?raw=true">
</p>

## About

Watchr is a portfolio tracker browser extension specifically for the PKT Cash blockchain. Track balance, mining income and transactions for any wallet address.

This extension is compatible with Chromium based browsers (Chrome, Edge, Brave etc.) and also Firefox.

Watchr is also available on iOS, iPadOS and Android for free on your favourite app store:

App Store 👉 [Download](https://apps.apple.com/app/watchr-by-pkt-watch/id6448482867)   
Google Play 👉 [Download](https://play.google.com/store/apps/details?id=watch.pkt.walletwatcher.wallet_watcher_cloud)

You can read more about Watchr on the project webpage 👉 https://pkt.watch/watchr/

## Installation

Unless you wish to modify the extension, it is recommended to install directly from the Chrome or Firefox webstore. Browser extensions installed manually will not receive updates, and in Firefox, will be removed when the browser is closed.

Chrome (and other Chromium based browsers)  
👉 [Install](https://chromewebstore.google.com/detail/watchr/dhajjenahhibbkjooihifodpnlnhkadi)

Firefox  
👉 [Install](https://addons.mozilla.org/en-GB/firefox/addon/watchr/)

## Installation from source

The following commands will create a `dist` directory in the root of the project. Within the `dist` directory, a directory containing the unpacked extension for your chosen platform will be created.

To build both Chromium and Firefox:

```npm run build```

To build only Chromium:

```npm run build-chrome```

To build only Firefox:

```npm run build-firefox```

Once you have the unpacked extension, follow these steps to install:

### Chrome and other Chromium based browsers:

Enter `chrome://extensions` in the address bar.  
Enable 'Developer mode' using the switch (usually located in the top right corner of the browser window, but some browsers may vary).  
Click the 'Load unpacked' button.  
Select the `/dist/chrome` directory.  

### Firefox

Enter `about:debugging` in the address bar.  
Choose 'This Firefox' from the menu.  
Click the 'Load Temporary Add-on' button.  
Select the `manifest.json` file located in the `/dist/firefox` directory.  

*nb. Firefox will remove temporary add-ons when the browser is closed.*

## Modifying the source

The CSS for this project is compiled from SCSS files found in the [scss](scss) directory. You will need a Sass compiler if you wish to modify the CSS. The compiled file should be named `main.css` and be located in the [extension/css](extension/css) directory.

All JavaScript can be found in the [extension/js](extension/js) directory. The project makes heavy use of ES6 modules. These can be found in the [extension/js/modules](extension/js/modules) directory.

There are two manifest files located in the extension directory. `manifest.json` is the Chromium version. `manifest.firefox.json` is the Firefox version (this file will be copied and renamed to `manifest.json` when packaged using the build commands specified above).