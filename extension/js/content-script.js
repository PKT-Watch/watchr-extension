const urlSegments = window.location.pathname.split("/");
if (urlSegments[1] === 'address' && urlSegments[2]) {
    const address = urlSegments[2];
    const btn = document.createElement('button');
    btn.classList.add('btn-watchr');

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('icon');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xml:space', 'preserve');
    svg.setAttribute('style', 'enable-background:new 0 0 226 260');
    svg.setAttribute('viewBox', '0 0 226 260');
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute('d', 'm113 0 113 65v130l-113 65L0 195V65L113 0');
    path1.setAttribute('style', 'fill:#ff007a');
    svg.appendChild(path1);
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute('d', 'M142.3 130c-16.1 0-29.2-13.1-29.2-29.2 0-11.9 7.1-22.1 17.2-26.6-5.6-1.7-11.4-2.6-17.2-2.6-32.3 0-58.5 26.2-58.5 58.5s26.2 58.5 58.5 58.5 58.5-26.2 58.5-58.5c0-6-.9-11.8-2.6-17.2-4.7 10-14.9 17.1-26.7 17.1z');
    svg.appendChild(path2);
    btn.appendChild(svg);
    const span = document.createElement('span');
    span.textContent = 'Watch this address';
    btn.appendChild(span);

    btn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: "watchAddress",
            address: address
        });
    });
    document.querySelector('.element-details.address-details .header').appendChild(btn);
}