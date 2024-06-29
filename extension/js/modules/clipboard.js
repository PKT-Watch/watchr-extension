import { showToast } from '/js/modules/toast.js';

const clipboardControls = document.querySelectorAll('.clipboard-copy');

clipboardControls.forEach((control) => {
    control.addEventListener('click', e => {
        if (!e.target.closest('.clipboard-copy-button')) return;
        const clipboardControl = e.currentTarget;
        copyToClipboard(clipboardControl.querySelector('.clipboard-copy-value').innerText.trim());
    
        showToast({ message: 'Copied to clipboard', type: 'success'});
    });
});

function copyToClipboard(text) {
    if (!text || text === '') return;

    var copyElement = document.createElement("span");
    copyElement.appendChild(document.createTextNode(text));
    copyElement.id = 'tempCopyToClipboard';
    document.body.append(copyElement);

    // select the text
    var range = document.createRange();
    range.selectNode(copyElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // copy & cleanup
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    copyElement.remove();
}