function openDrawer() {
    drawer.classList.toggle('active');
  
    let handler = (e) =>  {
        if (!e.target.closest('.drawer')) {
            closeDrawer();
            document.body.removeEventListener('click', handler);
        }
    }
    document.body.addEventListener('click', handler);
}

function closeDrawer() {
    drawer.classList.remove('active');
}

export { openDrawer, closeDrawer };