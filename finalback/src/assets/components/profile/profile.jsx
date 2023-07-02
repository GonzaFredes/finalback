import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function Profile() {
  const [data, setData] = useState ();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Firstname, setName] = useState('');
  const [Lastname, setLastName] = useState('');
  
  const fetchUser = async () => {
    const response = await axios.get('http://localhost:8080/usernow',{
      first_name: Firstname,
      last_name: Lastname,
      email: Email,
      password: Password,
    });
    console.log(response);
  };
  fetchUser();
  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Profile</Card.Title>
        <Card.Text>Nombre y Apellido: {Firstname} {Lastname}</Card.Text>
        <Button variant="primary">Actualizar datos</Button>
      </Card.Body>
    </Card>
  );
}

export default Profile;