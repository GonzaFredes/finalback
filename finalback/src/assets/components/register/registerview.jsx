import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

function Register() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Firstname, setName] = useState('');
  const [Lastname, setLastName] = useState('');
  const [Edad, setEdad] = useState('');
  const navigate = useNavigate();
  const registeruser = async () => {
    const res = await axios.post('http://localhost:8080/api/session/register/', {
      first_name: Firstname,
      last_name: Lastname,
      age: Edad,
      email: Email,
      password: Password,
    });
    const data = res.data;
    console.log(data);
    if (data) {
      Swal.fire({
        icon: 'success',
        title: `Bienvenido ${data.first_name + ' ' + data.last_name}, ahora eres usuario de este sitio.`,
        showConfirmButton: true,
      })
      setTimeout(function () {navigate('/')},3000)
    }
  };  
  return (
    <>
    <div className="formContainer">
      <div className='formRegister'>
      <h3>Ingresa los siguientes datos para crear su nuevo usuario:</h3>
      <FloatingLabel controlId="floatingInput" label="Nombre" className="mb-3">
        <Form.Control
          value={Firstname}
          type="name"
          placeholder="Josue"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput" label="Apellido" className="mb-3">
        <Form.Control
          value={Lastname}
          type="lastname"
          placeholder="Ramirez"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput" label="Edad" className="mb-3">
        <Form.Control
          value={Edad}
          type="age"
          placeholder="23"
          onChange={(e) => {
            setEdad(e.target.value);
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
        <Form.Control
          value={Email}
          type="email"
          placeholder="name@example.com"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Contraseña">
        <Form.Control
          value={Password}
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FloatingLabel>
      <br />
      <div className='buttonsRegister'>
        <Button onClick={registeruser} variant="primary">
          Registrarse
        </Button>
        <br />
        <br />
        <Link to="/" className="btn btn-primary">
          Logueate
        </Link>
      </div>
      </div>
    </div>
    </>
  );
}
export default Register;