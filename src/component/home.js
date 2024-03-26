import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Row, Col, Modal, Form, Toast, } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Timer from './Timer';
import { fetchUserBalance, place_order, fetchGameResultsall, fetchorderdetail, updateorderstatus, deposit_money } from './utils.js';
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import Loader from './loader';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api_url } from '../config.js';

// import GameComponent from './playing_buttons.js';

const url = api_url

const appStyle = {
  backgroundColor: 'white',
  maxWidth: '400px',
  minWidth: '350px',
  alignItems: 'center',
  margin: 'auto',
  marginBottom: '50px',
  height: '100%',
  paddingTop: '55px'
}
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
const modalTimerStyle = {
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
  borderRadius: "8px", // Add border radius for rounded corners
  fontSize: '50px', // Set the font size for the Timer component
};


const Home = () => {

  const button_disabled_time = 10;

  const [currentOrderValue, setCurrentOrderValue] = useState('');

  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [showJoinColorModal, setShowJoinColorModal] = useState('');
  const [showRuleModal, setShowRuleModal] = useState('');
  const [balance, setBalance] = useState();
  const [active1, setActive1] = useState(true)
  const [quantity, setQuantity] = useState(0);

  const [timerModal, setTimerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [ordered, setOrdered] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(true);
  const [style, setStyle] = React.useState("flip");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userBalance = await fetchUserBalance(authUser.uid);
        if (userBalance !== null) {
          setBalance(userBalance);
        }
      } else {
        setBalance(0); // Set balance to 0 when the user is not logged in
      }
    });

    return () => unsubscribe();
  }, []);


  const [gameResults, setGameResults] = useState([]);

  const [skip, setSkip] = useState(0);

  useEffect(() => {

    const fetchGameResults = async () => {

      setIsLoading(true);

      try {

        const data = await fetchGameResultsall(skip)

        // console.log(data)


        setGameResults((prevResults) => {
          // Filter out duplicates based on the array structure
          const uniqueResults = data.Results.filter(
            (result) =>
              !prevResults.some(
                (existingResult) =>
                  existingResult[0] === result[0] && existingResult[1] === result[1]
              )
          );

          const res = [...prevResults, ...uniqueResults]

          setCurrentPeriod(res[0][1])
          return res
        });
      } catch (error) {
        console.error('Error fetching game results:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameResults();
  }, [skip,]);

  const handleShowMore = () => {
    setSkip((prevSkip) => prevSkip + 5);
  };


  useEffect(() => {
    // Connect to the WebSocket
    let socket = new WebSocket('ws://localhost:8000/ws');
    // Listen for messages from the WebSocket
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established.');
    });
    socket.addEventListener('message', async (event) => {
      const newElapsedTime = parseFloat(event.data);
      setElapsedTime(newElapsedTime);
      if (newElapsedTime <= button_disabled_time) {
        setActive1(false)
        handleClosePlaceOrderModal()

      }
      if (newElapsedTime === button_disabled_time) {
        handleShowModalTimer()
      }
      if (newElapsedTime === 1) {

        setTimeout(() => {
          const auth = getAuth();
          const user = auth.currentUser
          // Perform API call after 2 seconds
          if (user) { checkUserWon(user.uid); }
        }, 1000); // Change timeout duration to 2000 milliseconds (2 seconds)
        handleCloseModalTimer()
        setActive1(true)
      }
    });
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      // Retry connection after a delay
      setTimeout(() => {
        // Reconnect WebSocket
        console.log('Attempting to reconnect...');
        socket = new WebSocket('ws://localhost:8000/ws');
      }, 3000); // Retry after 3 seconds
    });

    const checkUserWon = async (user_id) => {
      try {

        const data1 = await fetchorderdetail(user_id);
        console.log(data1)
        if (data1.data.length) {
          console.log("you have ordered")

          const data23 = await fetchGameResultsall(0)

          const searchTermString = String(data1.data[2]).toLowerCase();

          const isInList = data23.Results[0].slice(2, 5).some(item => {
            const itemString = String(item).toLowerCase();
            return itemString === searchTermString;
          });

          // console.log(data23.Results[0])
          console.log(data23.Results[0].slice(2, 5))
          if (isInList) {

            toast.success("You won the match ", {
              icon: '🎉🎉'
            })

            when_won(user_id, 10)
          } else {

            toast("You loose the match")
          }

          await updateorderstatus(user_id)

          setTimeout(() => {
            // window.location.reload();
          }, 3000);

        }
        else {
          console.log("0 order found")
        }

      } catch (error) {
        console.error('Error checking user win status:', error.message);
      }
      finally {
        setOrdered(false)
      }
    };

    const when_won = async (user_id, amount) => {
      deposit_money(user_id, amount)
    }



    // Save the socket connection in state
    setSocket(socket);
    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);


  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleShowModalTimer = () => {
    setTimerModal(true)
  }

  const handleCloseModalTimer = () => {
    setTimerModal(false)
  }

  const handleNumberJoinButtonClick = (rowIndex, colIndex) => {
    const buttonKey = rowIndex * 5 + colIndex + 1;

    setCurrentOrderValue(buttonKey - 1)
    setShowJoinColorModal(true);
    // Perform your desired action with the buttonKey
  };
  const handleColorJoinButtonClick = (color) => {

    setCurrentOrderValue(color)
    setShowJoinColorModal(true);

  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowJoinColorModal(false)
    setShowRuleModal(false)
  };

  const handleClosePlaceOrderModal = () => {
    setShowModal(false);
    setShowJoinColorModal(false)
  }

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const placeOrderAndShowToast = async (order) => {
    try {
      // Use toast.promise to handle async operation and display appropriate messages
      const newBalance = await toast.promise(
        place_order(order), // Call the function to place the order
        {
          loading: 'Placing order...', // Loading message while the order is being processed
          success: <b>Order placed successfully!</b>, // Success message when the order is successfully placed
          error: <b>Failed to place order. Please try again later.</b>, // Error message if the order placement fails
        }
      );
      // Update the balance with the new value
      setBalance(newBalance);
    } catch (error) {
      // Handle any errors here
      console.error('Error placing order:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in first.");
        navigate('/login');
        return;
      }

      const order = {
        "user_id": user.uid,
        "color_prediction": currentOrderValue,
        "quantity": quantity
      };

      if (quantity <= 0) {
        toast.error("Amount can not be 0.")
        return
      }
      const dat = await fetchorderdetail(user.uid)

      if (dat.data.length > 0) {

        toast.error("You have already placed a order")
        return
      }
      if (quantity >= balance) {
        toast.error(
          <div>
            Low Balance !!, <Link to="/recharge">Click here</Link> to recharge.
          </div>,
        )
        return
      }
      if (quantity > 0 && quantity <= balance) {
        await placeOrderAndShowToast(order); // Call the function to place the order and display toast
        setOrdered(true);
      }

      handleCloseModal()
      setQuantity(0)
      // window.location.reload();
    } catch (error) {
      toast.error("Problem in placing order. ")
    }
  }

  const handleClick = (data) => {
    setQuantity(data)
    // console.log(data)
  };
  const handleIncrement = () => {
    setQuantity(prevAmount => prevAmount + 10);
  };

  const handleDecrement = () => {
    if (quantity >= 10) {
      setQuantity(prevAmount => prevAmount - 10);
    }
  };

  return (
    <div> {isLoading ? (<Loader />) : null}
      <Toaster />

      <div style={appStyle} >
        <div className='p-3'>
          <h1><Timer value={formatTime(elapsedTime)} style={style} /></h1>
          <Modal style={modalTimerStyle} show={timerModal} onHide={handleCloseModalTimer} centered>
            <Modal.Body style={{ backgroundColor: 'black' }}>
              <Timer value={formatTime(elapsedTime)} />
            </Modal.Body>
          </Modal>
        </div>

        <div className='p-3'>

          <Modal style={modalStyle} show={showJoinColorModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Join Contest</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form>
                <Form.Group controlId="quantity">
                  <Form.Label>Amount</Form.Label>
                  <div className="d-flex align-items-center justify-content-center">
                    <Button variant='danger' className="flex-grow-1 m-2" onClick={() => handleDecrement()}> -10 </Button>
                    <p className="flex-grow-1 m-2 text-center">{quantity}</p>
                    <Button variant='success' className="flex-grow-1 m-2" onClick={() => handleIncrement()}> +10 </Button>
                  </div>

                  <div className='d-flex align-items-center justify-content-center'>
                    <Button variant="outline-secondary" onClick={() => handleClick(50)}>50</Button>
                    <Button variant="outline-secondary" onClick={() => handleClick(100)}>100</Button>
                    <Button variant="outline-secondary" onClick={() => handleClick(150)}>150</Button>
                  </div>

                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handlePlaceOrder}>
                Place Order
              </Button>
              <Button variant="primary" onClick={() => { setQuantity(0) }}>
                Clear
              </Button>

            </Modal.Footer>
          </Modal>
          <Table className='mb-2 mt-1' >

            <thead className="text-center">
              <tr >
                <th style={{ width: '33%' }}> <h6>🏆 Period</h6> </th>
                <th style={{ width: '33%' }}> </th>
                <th style={{ width: '33%' }}><h6>{currentPeriod}</h6></th>
              </tr>
            </thead>

          </Table>

          <Container className="mb-2 mt-2 p-1">
            <Row>
              <Col className="d-flex justify-content-center" xs={4}>
                <Button
                  disabled={!active1}
                  variant='danger'
                  style={{ width: '100%' }}
                  onClick={() => handleColorJoinButtonClick("red")}
                >
                  Join Red
                </Button>
              </Col>
              <Col active className="d-flex justify-content-center" xs={4}>
                <Button
                  disabled={!active1}
                  style={{ width: '100%', backgroundColor: '#871F78', borderColor: '#871F78' }}

                  onClick={() => handleColorJoinButtonClick("voilet")}
                >
                  Join Voilet
                </Button>
              </Col>
              <Col className="d-flex justify-content-center" xs={4}>
                <Button
                  disabled={!active1}
                  variant="success"
                  style={{ width: '100%' }}

                  onClick={() => handleColorJoinButtonClick("green")}
                >
                  Join Green
                </Button>
              </Col>
            </Row>

            <Container className="mb-2 mt-2 p-1">
              <Row >
                <Col className="d-flex justify-content-center" xs={6}>
                  <Button
                    disabled={!active1}
                    style={{ width: '100%' }}
                    onClick={() => handleColorJoinButtonClick("small")}
                  >
                    Join Small
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center" xs={6}>
                  <Button
                    disabled={!active1}
                    style={{ width: '100%' }}
                    onClick={() => handleColorJoinButtonClick("big")}
                  >
                    Join Big
                  </Button>
                </Col>
              </Row>
            </Container>
          </Container>
          <Container className="mb-2 mt-4 p-1">
            {[...Array(2)].map((_, rowIndex) => (
              <Row key={rowIndex} className="mb-2">
                {[...Array(5)].map((_, colIndex) => (
                  <Col
                    className="d-flex justify-content-center"
                    key={colIndex}
                  >
                    <Button
                      disabled={!active1}
                      variant={(rowIndex * 5 + colIndex) % 2 === 0 ? "success" : "danger"}
                      style={{
                        width: '40px', // Set your desired width
                        height: '40px', // Set your desired height
                        borderRadius: '50%', // Make the button circular
                        backgroundImage: 'url("path/to/texture-image.jpg")', // Set the path to your texture image
                        backgroundSize: 'cover',
                      }}

                      onClick={() => handleNumberJoinButtonClick(rowIndex, colIndex)}
                    >
                      {rowIndex * 5 + colIndex}
                    </Button>
                  </Col>
                ))}
              </Row>
            ))}
          </Container>
        </div>
        <div style={{ height: '100vh', overflow: 'auto' }} className='p-2 pb-3 pt-0 '>
          <Table size='sm' >
            <thead className="text-center">
              <tr>
                <th style={{ width: '25%' }} >Period</th>
                <th style={{ width: '25%' }}>Size</th>
                <th style={{ width: '25%' }}>Number</th>
                <th style={{ width: '25%' }}>Color</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {gameResults.map((result, index) => (
                <tr key={index} >

                  <td>{result[1]}</td>
                  <td >{result[3]}</td>
                  <td>{result[2]}</td>
                  <td>
                    <div style={{
                      borderRadius: '50%',
                      margin: 'auto',
                      // height: '100vh',
                      width: '20px',
                      height: '20px',
                      backgroundColor: result[4]
                    }}>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ paddingBottom: '70px' }} className="text-center">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
