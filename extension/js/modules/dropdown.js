document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', e => {
        if (e.target.closest('.dropdown-button')) {
            dropdown.classList.toggle('active');
        }
    });

    dropdown.querySelector('.dropdown-menu').addEventListener('click', e => {
        dropdown.classList.remove('active');
    });
});