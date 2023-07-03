import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../styles/NavBarStyles.css';

function Navbars() {
  const { role } = JSON.parse(localStorage.getItem('usuario')) || {};
  return (
    <Navbar expand="lg" className="navbarestilos">
      <Container>
        <Navbar.Brand href="/home">Pragon Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <NavDropdown title="Categorías" id="basic-nav-dropdown">
              <NavDropdown.Item href="#remeras">Remeras</NavDropdown.Item>
              <NavDropdown.Item href="#pantalones">Pantalones</NavDropdown.Item>
              <NavDropdown.Item href="#zapatillas">Zapatillas</NavDropdown.Item>
            </NavDropdown> */}
            <div className="privado">
              <Nav.Link className="profile" href="/current">Perfil</Nav.Link>
              <Nav.Link className="carrito" href="/cart">Carrito</Nav.Link>
              {role === 'admin' && <Nav.Link href="/profile">Users Managament</Nav.Link>}
              <Nav.Link className="logout" href="/logout">Logout</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;