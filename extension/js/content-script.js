const urlSegments = window.location.pathname.split("/");
if (urlSegments[1] === 'address' && urlSegments[2]) {
    const address = urlSegments[2];
    const btn = document.createElement('button');
    btn.classList.add('btn-watchr');
    btn.innerHTML = `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 226 260" viewBox="0 0 226 260"><path d="m113 0 113 65v130l-113 65L0 195V65L113 0" style="fill:#ff007a"/><path d="M142.3 130c-16.1 0-29.2-13.1-29.2-29.2 0-11.9 7.1-22.1 17.2-26.6-5.6-1.7-11.4-2.6-17.2-2.6-32.3 0-58.5 26.2-58.5 58.5s26.2 58.5 58.5 58.5 58.5-26.2 58.5-58.5c0-6-.9-11.8-2.6-17.2-4.7 10-14.9 17.1-26.7 17.1z"/></svg>
        <span>Watch this address</span>
    `;
    btn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: "watchAddress",
            address: address
        });
    });
    document.querySelector('.element-details.address-details .header').appendChild(btn);
}