const formatAddress = (address) => {
    return `${address.slice(0, 11)}...${address.slice(-11)}`;
}

const UNITS = [
    ['PKT', 1, 'PKT'],
    ['mPKT', 1000, 'milli-PKT (thousandths)'],
    ['μPKT', 1000000, 'micro-PKT (millionths)'],
    ['nPKT', 1000000000, 'nano-PKT (billionths)']
  ]

const unitsToPkt = (units, decimals, formatted) => {   
    const pkt = units / 1024 / 1024 / 1024;

    if (formatted === false) {
        return (typeof decimals !== 'undefined' && decimals > 0 ? pkt.toFixed(decimals) : pkt);
    }

    return pktToDenomination(pkt, decimals);
}

const pktToDenomination = (pkt, decimals) => {
    if (typeof decimals === 'undefined' && Number(pkt) < 1) {
        return '0.00 PKT';
    }
    decimals = isNaN(decimals) ? 0 : decimals;
    pkt = Number(pkt);
    let fa;
    let u = UNITS[0];
    let i = 0;
    do {
        fa = pkt * UNITS[i][1];
        u = UNITS[i];
        i++;
    } while (fa < 1 && u[0] !== 'nPKT')
    const str = numberWithCommas(fa, decimals);
    const intDec = str.split('.');
    if (parseInt(intDec[0]) === 0 && parseInt(intDec[1]) === 0) {
        return `0.00 <span class="units">PKT</span>`;
    }

    return intDec.length > 1 ?
        `${intDec[0]}.${intDec[1]} <span class="units">${u[0]}</span>` :
        `${intDec[0]} <span class="units">${u[0]}</span>`;
}

const numberWithCommas = (value, decimals) => {
    decimals = typeof decimals === 'undefined' ? 2 : decimals; 
    if (typeof value !== 'number') { value = parseFloat(value) }; 
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { formatAddress, unitsToPkt, numberWithCommas };