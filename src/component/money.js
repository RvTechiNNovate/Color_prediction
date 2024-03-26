import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Money = () => {


    const appStyle = {
        textAlign: 'center',
        
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        maxWidth: '400px',
        alignItems: 'center',
        height: '100vh',
        paddingTop: '40vh'
      };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '10px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    return (
        <Container style={appStyle}>
            <div>
                <h2>Manage Your Money</h2>
                <Link to="/recharge">
                    <button style={buttonStyle}>Recharge</button>
                </Link>
                <Link to="/withdraw">
                    <button style={buttonStyle}>Withdraw</button>
                </Link>
            </div>
        </Container>
    );
};

export default Money;
