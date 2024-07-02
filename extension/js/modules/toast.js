const toastContainer = document.getElementById('toast-container');

function showToast(options) {
    options = options || {};
    options.message = options.message || 'There was an error';
    options.type = options.type || 'error';
    options.autoClose = typeof options.autoClose === 'undefined' ? true : options.autoClose;
    options.html = options.html || null;
    options.overlay = typeof options.overlay === 'undefined' ? false : options.overlay;

    const toast = document.createElement('div');
    toast.classList.add('toast', ...options.type.split(' '));
    let overlayEl;

    if (options.html) {
        toast.appendChild(options.html);
    } else {
        toast.textContent = options.message;
    }

    if (options.overlay) {
        overlayEl = document.createElement('div');
        overlayEl.classList.add('toast-overlay');
        document.querySelector('body').appendChild(overlayEl);
    }

    toastContainer.innerHTML = '';
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('active');

        if (overlayEl) {
            overlayEl.classList.add('active');
        }
    }, 10);

    if (options.autoClose) {
        setTimeout(() => {
            closeToast()
        }, 4000);

        return;
    }

    let handler = (e) =>  {
        if (!e.target.closest('.toast')) {
            closeToast();
            document.body.removeEventListener('click', handler);
        }
    }
    setTimeout(() => {
        document.body.addEventListener('click', handler);
    }, 10);

    function closeToast() {
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (overlayEl) {
                overlayEl.remove();
            }
        });
        toast.classList.remove('active');
        if (overlayEl) {
            overlayEl.classList.remove('active');
        }
    }
    
}

export { showToast };