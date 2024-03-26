// AuthComponent.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';

import { auth, registerUser, loginUser, forgotPassword } from './authFunctions';
import { api_url } from '../config';

const AuthComponent = () => {

    const url = api_url

    const [isLogin, setisLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const save_to_db_Register = async (user) => {
        console.log("i am in store to db registration")
        console.log(user)
        try {
            const response = await fetch(`${url}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('data saved to db');
            }

        } catch (error) {
            console.error('Error saving data:', error.message);
        }
    }

    const updateOrInsertProfile = async (user_id, profileData) => {
        try {
            const response = await fetch(`${url}/profile/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            // Handle the successful response, if needed
            return data;
        } catch (error) {
            console.error('Error:', error.message);
            // Handle errors, if needed
            throw error;
        }
    };


    const handleAuth = async (e) => {
        e.preventDefault();

        try {
            setError(null);

            if (isLogin) {
                // User is trying to log in
                await loginUser(email, password);

            } else {
                // User is trying to register
                const user = await registerUser(email, password);
                const fullNames = ['John', 'Sam', 'Peter'];
                const randomFullName = fullNames[Math.floor(Math.random() * fullNames.length)];
                const data = {
                    user_id: user.uid,
                    username: randomFullName,
                    email: email,
                    password: password

                }
                save_to_db_Register(data)

                const profileData = {
                    user_id: user.uid,
                    full_name: randomFullName,
                    date_of_birth: '',
                    address: '',
                    phone_number: '',
                };

                updateOrInsertProfile(user.uid, profileData)


            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const checkAuthState = () => {
            const user = auth.currentUser;

            if (user) {
                // User is logged in, hide login and register buttons

                navigate('/user');
                setisLogin(false);
                // Redirect to user profile if already signed in
            } else {
                // User is logged out, show login and register buttons
                setisLogin(true);

            }
        };

        // Call the function on component mount
        checkAuthState();
        // Subscribe to auth state changes
        const unsubscribe = auth.onAuthStateChanged(checkAuthState);

        // Unsubscribe from auth state changes on component unmount
        return () => unsubscribe();
    }, [navigate]);

    const appStyle = {
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        maxWidth: '400px',
        minWidth: '400px',
        alignItems: 'center',
        height: '100vh'
    };

    const formStyle = {
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '50px',
        padding: '20px',
        // border: '1px solid #ccc',
        borderRadius: '8px',
        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    };

    const buttonStyle = {
        width: '100%',
    };
    return (
        <Container style={appStyle}>
            <div style={formStyle}>
                {true ? (
                    <div>
                        <h2>{isLogin ? 'Log In' : 'Register'}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleAuth}>
                            <Form.Group controlId="formEmail">
                                {/* <Form.Label>Email address</Form.Label> */}
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <br></br>
                            <Form.Group controlId="formPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br></br>
                            <Button variant="primary" type="submit" style={buttonStyle}>
                                {isLogin ? 'Log In' : 'Register'}
                            </Button>
                        </Form>

                        <p className="mt-2">
                            {isLogin ? 'New user? ' : 'Already have an account? '}
                            <Link onClick={() => setisLogin(!isLogin)}>
                                <span>{isLogin ? 'Register' : 'Log In'}</span>
                            </Link>
                        </p>
                        <Link onClick={() => forgotPassword(email)}>
                            <span>Forget password</span>
                        </Link>
                    </div>) : null
                }
            </div>
        </Container>
    );
};

export default AuthComponent;
