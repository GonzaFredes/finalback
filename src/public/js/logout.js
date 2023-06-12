const btnLogout = document.getElementById('btnLogout');

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        // fetch('/logout');
        fetch('/api/session/logout').then(()=>{
            window.location.replace('/login')
        })
    })
}
