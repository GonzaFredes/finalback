import './App.css';
import Login from './assets/components/login/login';
import Register from './assets/components/register/registerview';
import Navbars from './assets/components/navbar/navbar';
import Home from './assets/components/home/homebody';
// import Profile from './assets/components/profile/profile'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/styles/GenericStyles.css';
import CurrentUser from './assets/components/admin/admin';
import Forgotpass from './assets/components/forgotpass/forgot';
import Cart from './assets/components/cart/cart';
import Logout from './assets/components/logout/logout';
import Users from './assets/components/users/users';
import Stripe from './assets/components/stripe/Stripe';

function App() {
  return (
    <BrowserRouter>
      <Navbars />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Users />} />
        <Route path="/current" element={<CurrentUser />} />
        <Route path="/forgot" element={<Forgotpass />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/stripe/:cid" element={<Stripe />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;