import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faMoneyBillAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  
    const appStyle = { 
        backgroundColor: 'white', 
        maxWidth: '400px',
        minWidth: '350px',
        alignItems: 'center',
        margin: 'auto', 
        height:'60px'
      }
      
  return (
    <Navbar style={appStyle} fixed="bottom" bg="light" variant="light" className="justify-content-around">
      <Container>
        <Nav className="justify-content-between w-100">
          <Nav.Link as={Link} to="/" className="d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faHome} size="lg" />
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/money" className="d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
            Money
          </Nav.Link>
          <Nav.Link as={Link} to="/search" className="d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faSearch} size="lg" />
            Search
          </Nav.Link>
          <Nav.Link as={Link} to="/user" className="d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faUser} size="lg" />
            User
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Footer;
