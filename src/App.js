import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';

import Home from './component/home';
import RechargeForm from './component/recharge';
import Footer from './component/footer';
import UserProfile from './component/user';
import AuthComponent from './component/AuthPage';
import Header from './component/header';
import { fetchUserBalance } from 'C:/A_Local_disk_D/POC/Game_poc/colorfantasy/src/component/utils.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import DepositRequests from './component/DepositRequests';
import Withdraw from './component/withdraw';
import Transaction from './component/transactions';
import Money from './component/money';
import toast, { Toaster } from 'react-hot-toast';
import { onMessage } from "firebase/messaging";

import { generate_Token, messaging } from './component/authFunctions';

function App() {

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    generate_Token();
    onMessage(messaging, (payload) => {
      const { title, body, image } = payload.notification;

      toast((t) => (
        <div style={{ display: "flex", alignItems: "center", minWidth: "350px" }}>
          <div style={{ marginRight: "10px" }}>
            <img src={image} alt="Notification" style={{ width: "25px", height: "25px", borderRadius: "50%" }} />
          </div>
          <div>
            <h5 style={{ margin: 0 }}>{title}</h5>
            <p style={{ margin: 0, color: 'gray' }}>{body}</p>
          </div>
          <div style={{ position: "absolute", top: "50%", right: "5px", transform: "translateY(-50%)", cursor: "pointer" }} onClick={() => toast.dismiss(t.id)}>
            ❌
          </div>
        </div>
      ), {
        duration: 3000, // Duration in milliseconds
        onClick: () => {
          // Handle click action
          console.log("Toast clicked!");
        },
        onClose: () => {
          // Handle close action
          console.log("Toast closed!");
        }
      });

      console.log(payload);
    });
  }, []);

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


  return (
    <Router>
      <div className="App">
        <Toaster />
        <Header balance={balance} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthComponent />} />
          <Route path="/recharge" element={<RechargeForm />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/depositreq" element={< DepositRequests />} />
          <Route path="/withdraw" element={< Withdraw />} />
          <Route path="/search" element={< Transaction />} />
          <Route path="/money" element={< Money />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
