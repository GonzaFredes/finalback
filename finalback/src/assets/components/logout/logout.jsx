import { useEffect} from 'react';
import Button from 'react-bootstrap/Button';
// import axios from 'axios';

function Logout() {

  const buttonclick = useEffect(() => {
    fetch('http://localhost:8080/api/session/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(()=>{
        window.location.replace('/')
    })
  });

  return (
        <Button onClick={buttonclick} variant="primary">Logout</Button>
  );
}

export default Logout;