import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { app_name } from '../config';

const appStyle = {
  backgroundColor: 'white',
  maxWidth: '400px',
  minWidth: '350px',
  alignItems: 'center',
  margin: 'auto',
  height: '50px'
}




const Header = ({ balance }) => {

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  };

  return (

    <Navbar style={appStyle} bg="dark" variant="dark" fixed="top" className="justify-content-around">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleHomeClick}>{app_name}</Navbar.Brand>
        <Navbar.Text as={Link} to="/recharge" className="ml-auto">Balance: 💰 {balance}</Navbar.Text>
      </Container>
    </Navbar>

  );
};

export default Header;