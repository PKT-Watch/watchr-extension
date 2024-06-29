function showPage(id) {
    const page = document.getElementById(id);
    page.classList.add('active');
}

function hidePage(id) {
    let page;
    if (id) {
        page = document.getElementById(id);
    } else {
        page = document.querySelector('.page.active');
    }
    page.classList.remove('active');
}

export { showPage, hidePage };