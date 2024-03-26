import React, { useState, useEffect } from 'react';
import { auth, logoutUser, handlSendEmailVerification } from './authFunctions';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loader from './loader';
const url = "http://localhost:5000"

const appStyle = {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    maxWidth: '400px',
    height: '100vh',
    paddingTop: '30px'
};

const buttonStyle = {
    margin: '10px',
    padding: '8px 12px',
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
};
const ProfileContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;


const ProfileHeader = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const UserProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const ProfileDetail = styled.div`
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VerifyButton = styled(Button)`
  background-color: #28a745;
  border-color: #28a745;
`;

const EditButton = styled(Button)`
  background-color: #007bff;
  border-color: #007bff;
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  border-color: #dc3545;
`;


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedUser, setEditedUser] = useState({
        displayName: '',
        email: '',
        photoURL: '',
        phoneNumber: '',
        address: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        console.log(currentUser)
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${url}/profile/${currentUser.uid}`);
                console.log(response)
                if (response.ok) {
                    const result = await response.json();
                    console.log(result)
                    if (result.data) {
                        setUser(currentUser);
                        setEditedUser({
                            full_name: result.data.full_name || '',
                            email: currentUser.email || '',
                            photoURL: currentUser.photoURL || '',
                            phoneNumber: result.data.phone_number || '',
                            address: result.data.address || '',
                            dob: result.data.dob || '',
                        });
                    } else {
                        // Handle the case where the profile does not exist
                        console.error('Profile not found for the specified user_id');
                    }
                } else {
                    // Handle the case where the API request fails
                    console.error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        if (currentUser) {
            fetchUserProfile();
        } else {
            // If the user is not logged in, redirect to the login page
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        await logoutUser(); // Ensure logout is completed before navigating
        navigate('/login');
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
    };

    const handleEditSubmit = async () => {
        const currentUser = auth.currentUser;
        try {
            const response = await fetch(`${url}/profile/${currentUser.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: editedUser.full_name,
                    date_of_birth: editedUser.dob,
                    address: editedUser.address,
                    phone_number: editedUser.phoneNumber,
                }),

            });

            if (!response.ok) {
                throw new Error(`Failed to update or insert profile. Status code: ${response.status}`);
            }

            // Assuming the response is a JSON object with a 'message' property
            const responseData = await response.json();
            console.log(responseData.message);

            // Update the local state or perform any other actions as needed
            // ...

            // Close the edit modal
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating or inserting profile:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const modalStyle = {
        backgroundColor: '#c5c5c529',
        maxWidth: '400px',
        minWidth: '350px',
        alignItems: 'center',
        margin: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '50px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        paddingLeft: '0px',
      };

    return (
        <Container style={appStyle}>

            {user ? (
                <div>

                    <Container className="mt-5">
                        <ProfileContainer>
                            <ProfileHeader>User Profile</ProfileHeader>
                            <ProfileImage src={'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png'} alt="Profile" />
                            <UserProfileInfo>
                                <ProfileDetail>Name: {editedUser.full_name}</ProfileDetail>
                                <ProfileDetail>Email: {editedUser.email}</ProfileDetail>
                                <ProfileDetail>DOB: {editedUser.dob}</ProfileDetail>
                                <ProfileDetail>Phone Number: {editedUser.phoneNumber}</ProfileDetail>
                                <ProfileDetail>Address: {editedUser.address}</ProfileDetail>
                                <ProfileDetail>Verified: {editedUser.emailVerified ? 'Yes' : 'No'}</ProfileDetail>
                            </UserProfileInfo>
                            <ButtonContainer>
                                {!editedUser.emailVerified && (
                                    <VerifyButton onClick={handlSendEmailVerification}>
                                        Verify Email
                                    </VerifyButton>
                                )}
                                <EditButton onClick={handleEditClick}>Edit Profile</EditButton>
                                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                            </ButtonContainer>
                        </ProfileContainer>

                        {/* Edit Modal */}
                        <Modal style={modalStyle} show={showEditModal} onHide={handleEditClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formDisplayName" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter display name"
                                            name="displayName"
                                            value={editedUser.full_name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="email"
                                            disabled
                                            value={editedUser.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPhotoURL" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter profile photo URL"
                                            name="photoURL"
                                            value={editedUser.photoURL}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPhoneNumber" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter phone number"
                                            name="phoneNumber"
                                            value={editedUser.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDOBNumber" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter DOB"
                                            name="dob"
                                            value={editedUser.dob}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formAddress" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter address"
                                            name="address"
                                            value={editedUser.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleEditClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleEditSubmit}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>

                </div>
            ) : (
                <Loader />
            )}
        </Container>
    );
};

export default UserProfile;
