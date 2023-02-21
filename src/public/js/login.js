const formLogin = document.getElementById('formLogin');
const email = document.getElementById('email');
const password = document.getElementById('password');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value })
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            Swal.fire({
                icon: 'success',
                title: `Bienvenido ${data.first_name + ' ' + data.last_name}`,
                showConfirmButton: false,
            })
            setTimeout(function () {location.replace('/products');},3000)
        } else {
            Swal.fire({
                icon:'error',
                title: 'Oops! Something went wrong',
                text: json.error
            })
        }
    })
        // .then((res) => res.json())
        // .then((data) => {
        //     window.alert(`Bienvenido ${data.first_name}`);
        //     window.location.href = '/products'
        // })
        // .catch((error) => { window.alert('Error al iniciar sesion'); });
});
