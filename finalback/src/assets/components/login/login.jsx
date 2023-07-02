import { useState } from 'react';
import axios from 'axios';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginuser = async () => {
    const res = await axios.post('http://localhost:8080/api/session/login/', {
      email: Email,
      password: Password,
    }).catch( (error) => {
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal, por favor vuelve a intentarlo!',
          footer: 'Tip: Revisa los valores ingresados, si persiste el problema, dirígete a la opción para recuperar la contraseña'
        })
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        console.log(error.request);
      }
    });
    const data = res.data;
    console.log(data);
    if (data) {
      Swal.fire({
        icon: 'success',
        title: `Bienvenido ${data.first_name + ' ' + data.last_name}`,
        showConfirmButton: true,
      })
      setTimeout(function () {
        localStorage.setItem('usuario', JSON.stringify(data));
        navigate('/home')},3000)
    }
  };

  return (
    <div className="formContainer">
      <form className='formLogin'>
        <br />
          <h3 className='texts'>Iniciar Sesion</h3>

          <div className='campos'>
            <div className="mb-3">
              <label className='texts'>Email</label>
              <input
                value={Email}
                type="email"
                className="form-control"
                placeholder="Ingrese email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="mb-3">
              <label className='texts'>Contraseña</label>
              <input
                value={Password}
                type="password"
                className="form-control"
                placeholder="Ingrese contraseña"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className='loginButton'>
            <div className="d-grid">
              <button onClick={loginuser} type="button" className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
          <br />
          <div className='loginLinks'>
            <p className="forgot-password text-right">
              <a className='loginLinks' href="/register">Registrarse</a>
            </p>
            <p className="forgot-password text-right">
              <a className='loginLinks' href="/forgot">Olvidé mi contraseña</a>
            </p>
          </div>
        </form>
    </div>
    // <>
    //   <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
    //     <Form.Control
    //       value={Email}
    //       type="email"
    //       placeholder="name@example.com"
    //       onChange={(e) => {
    //         setEmail(e.target.value);
    //       }}
    //     />
    //   </FloatingLabel>
    //   <FloatingLabel controlId="floatingPassword" label="Password">
    //     <Form.Control
    //       value={Password}
    //       type="password"
    //       placeholder="Password"
    //       onChange={(e) => {
    //         setPassword(e.target.value);
    //       }}
    //     />
    //   </FloatingLabel>
    //   <Button onClick={loginuser} variant="primary">
    //     Login
    //   </Button>
    //   <Link to="/register" className="btn btn-primary">
    //     Regístrate Aquí
    //   </Link>
    // </>
  );
}
export default Login;