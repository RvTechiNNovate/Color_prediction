import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Modal, Toast } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import { useNavigate, } from 'react-router-dom';

import * as clipboard from 'clipboard-polyfill';
import WithdrawPage from './withdraw';
import toast from 'react-hot-toast';
import { api_url } from '../config';
const url = api_url

const RechargeForm = () => {
  const [step, setStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showUpiCopyModal, setShowUpiCopyModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleCustomAmountSubmit = () => {
    if (customAmount === '') {
      toast('Please enter an amount.');
      return;
    }
    setAmount(customAmount);
    setCustomAmount(customAmount)
    setIsAmountSelected(true)
    setShowModal(false);
    // setStep(2); // Proceed to Step 2 after entering custom amount
  };

  const handleAmountSelection = (selectedAmount) => {
    setAmount(selectedAmount);
    setIsAmountSelected(true);
    // setStep(2); // Proceed to Step 2 after selecting the amount
  };

  // const handleAmountSelection = (amount) => {
  //   setAmount(amount)
  // }
  const handleShowQRCode = () => {
    setShowQRCodeModal(true);
  };

  const handleCloseQRCodeModal = () => {
    setShowQRCodeModal(false);
    handleNextStep();
  };

  const handleShowUpiCopyModal = () => {
    setShowUpiCopyModal(true);
  };

  const handleCloseUpiCopyModal = () => {
    setShowUpiCopyModal(false);
    handleNextStep();
  };

  const handleNextStep = () => {
    setStep(2);
  };



  const fileToBytes = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const bytes = new Uint8Array(arrayBuffer);
        resolve(bytes);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  // Example usage:
  const makeDepositRequest = async (user_id) => {
    const imageBytes = await fileToBytes(screenshot);
    const requestBody = JSON.stringify({
      "amount": amount,
      "reference_id": referenceNumber,
      "image_data": Array.from(imageBytes)
    });

    console.log(requestBody)

    try {
      const response = await fetch(`${url}/deposit_request/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error('Failed to submit deposit request');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error submitting deposit request:', error.message);
    }
  };



  const handleDepositRequest = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)

    // depositRequest(user)
    // depositRequestImage(user)

    console.log("this is screenshot --------------############")
    console.log(screenshot)
    console.log("this is screenshot --------------############")
    makeDepositRequest(user.uid);
  };

  const [isAmountSelected, setIsAmountSelected] = useState(false);
  const handleVerifyPayment = async () => {
    if (!referenceNumber.trim()) { 
      toast.error('Reference number cannot be blank.');
      return;
    }
    if (!screenshot) {
      toast.error('Select the screenshot of payment', {
        icon: '📲', // Optional: You can customize the icon
      });
      return;
    }
    // Add logic for payment verification here
    // Once payment is verified, you can perform further actions
    await handleDepositRequest()

    toast.success('Your balance will be update shortly! Thankyou for your patience', {
      icon: '⌛'
    });
    navigate('/');
  };


  const handleCopyUPIID = () => {
    clipboard.writeText('rvriteshwar167-2@oksbi')
      .then(() => {
        toast.success('UPI ID copied to clipboard!');
        // setIsUPIIDCopied(true);
      })
      .catch((error) => console.error('Clipboard operation failed:', error));
  };

  const handleCustomAmount = (e) => {

    const amount = parseInt(e.target.value);
    if (amount >= 500) {
      setCustomAmount(amount);
    } else {
      // If the entered amount is less than 500, set it to 500
      setCustomAmount(500);
      setIsAmountSelected(true);
    }
  };

  const handleCustomAmountBlur = () => {
    // Ensure that the customAmount is at least 500 when the input field loses focus
    if (customAmount < 500) {
      setCustomAmount(500);
      setIsAmountSelected(true);
    }
  };


  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
  };


  const amounts = [50, 100, 150, 200, 300, 400, 500,];

  const appStyle = {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    maxWidth: '400px',
    alignItems: 'center',
    height: '100vh',
    paddingTop: '20vh'
  };

  const modalStyle = {
    backgroundColor: '#c5c5c529',
    maxWidth: '400px',
    // minWidth: '400px',
    alignItems: 'center',
    margin: 'auto',
    marginLeft: 'auto', // Add this property
    marginRight: 'auto', // Add this property
    marginBottom: '50px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    margin: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    outline: 'none',
  };

  return (
    <Container style={appStyle}>

      <Row className="justify-content-center">
        <Col >
          {step === 1 && (
            <>
              {/* <h2>Step 1</h2> */}

              <h7 className='text-decoration-underline'>Choose Payment Method</h7>

              <br></br>
              <div>
                <Button
                  style={buttonStyle}
                  variant="primary"
                  className='mt-3 mb-3 w-50'
                  onClick={handleShowQRCode}
                  disabled={!isAmountSelected}
                >
                  Use QR Code
                </Button>
                <br />
                <Button
                  style={buttonStyle}
                  variant="success"
                  className='mt-3 mb-3 w-50'
                  onClick={handleShowUpiCopyModal}
                  disabled={!isAmountSelected}
                >
                  Copy UPI ID
                </Button>

                <div>Amount : {amount}</div>
              </div>
              <div>
                <Container>
                  <Row className="justify-content-center">
                    <Col md={10}>
                      <Row className="">
                        {amounts.map((value, index) => (
                          <Col key={index} xs={12} md={3} className="mb-3 p-1">
                            <Button
                              style={{ width: '100%', height: '50px', backgroundColor: 'green', fontSize: '18px' }}
                              onClick={() => handleAmountSelection(value)}
                            >
                              {value}
                            </Button>
                          </Col>
                        ))}
                        <Col xs={12} md={3} className="mb-3 p-1">
                          <Button
                            style={{ width: '100%', height: '50px', backgroundColor: 'green', fontSize: '18px' }}
                            onClick={handleOpenModal}
                          >
                            More
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* Custom Amount Modal */}
                  <Modal style={modalStyle} show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Enter Custom Amount</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Control
                        type="number"
                        min={500}
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomAmount}
                        onBlur={handleCustomAmountBlur} // Handle blur event
                        required
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleCustomAmountSubmit}>
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>


                </Container>

              </div>
            </>

          )}

          {step === 2 && (
            <div >


              <h7 className='text-decoration-underline'>Verify Payment</h7>
              <br></br>
              <Form className='mt-3 m-lg-5'>
                <Form.Group controlId="referenceNumber">
                  <Form.Label>Reference Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <br></br>
                <Form.Group controlId="amount">
                  <Form.Label>Enter Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled
                  />
                </Form.Group>
                <br></br>
                <Form.Group controlId="screenshot">
                  <Form.Label>Upload Screenshot</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                  />
                </Form.Group>
                <br></br>
                <Button style={buttonStyle} variant="primary" onClick={handleVerifyPayment}>
                  Verify Payment
                </Button>
              </Form>
            </div>
          )}

          {/* QR Code Modal */}
          <Modal style={modalStyle} show={showQRCodeModal} onHide={handleCloseQRCodeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>QR Code Payment</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
              <QRCode value="upi://pay?pa=rvriteshwar167-2@oksbi&pn=Ritesh Vishwakarma&am" />
              <br></br>
              <Button variant="primary" onClick={handleCloseQRCodeModal}>
                Done
              </Button>
            </Modal.Body>
          </Modal>

          {/* UPI ID Copy Modal */}
          <Modal style={modalStyle} show={showUpiCopyModal} onHide={handleCloseUpiCopyModal}>
            <Modal.Header closeButton>
              <Modal.Title>Copy UPI ID</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>UPI ID:</p>
              <Form.Group controlId="upiID">
                <Form.Control type="text" value="rvriteshwar167-2@oksbi" readOnly />
              </Form.Group>
              <Button variant="success" onClick={handleCopyUPIID}>
                Copy
              </Button>
              <p>Copy this UPI ID and proceed with the payment.</p>
              <Button variant="primary" onClick={handleCloseUpiCopyModal}>
                Done
              </Button>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default RechargeForm;
