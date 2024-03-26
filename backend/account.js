// import React, { useState, useEffect } from 'react';
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPhoneNumber, sendEmailVerification } from "firebase/auth";

// const Account = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loginEmail, setLoginEmail] = useState('');
//     const [loginPassword, setLoginPassword] = useState('');
//     const [phone, setPhone] = useState('');
//     const [verificationCode, setVerificationCode] = useState('');


//     const save_to_db= async (user)=>{
//         try {
//             const response = await fetch(`${url}/register`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(user)
//             });
    
//             if (!response.ok) {
//               throw new Error('data saved to db');
//             }
//             // const data = await response.json();
//             // console.log(data); // Output the response from the server
//           } catch (error) {
//             console.error('Error saving data:', error.message);
//           }
//     }

//     const handleRegister = async () => {
//         try {
//             const auth = getAuth();
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
//             console.log('i am here to save details');
         
//             alert("Registration successfully!!");

//         } catch (error) {
//             console.error(error.message);
//             alert(error.message);
//         }
//     };

//     const handleLogin = async () => {
//         try {
//             const auth = getAuth();
//             const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
//             const user = userCredential.user;
//             console.log(user);
//             alert(`${user.email} Login successfully!!!`);
//             // You can set the display logic for logout button here if needed
//         } catch (error) {
//             console.error(error.message);
//             alert(error.message);
//         }
//     };

//     const handleLogout = () => {
//         const auth = getAuth();
//         auth.signOut().then(() => {
//             console.log('Sign-out successful.');
//             alert('Sign-out successful.');
//         }).catch((error) => {
//             console.error('An error happened.');
//         });
//     };

//     const handleForgotPassword = async () => {
//         try {
//             const auth = getAuth();
//             await sendPasswordResetEmail(auth, email);
//             console.log('Password reset email sent successfully.');
//             alert('Password reset email sent successfully. Check your inbox.');
//         } catch (error) {
//             console.error(error.message);
//             alert(error.message);
//         }
//     };

//     const handleSendEmailVerification = async () => {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         try {
//             await sendEmailVerification(user);
//             console.log('Verification email sent successfully.');
//             alert('Verification email sent successfully. Check your inbox.');
//         } catch (error) {
//             console.error(error.message);
//             alert(error.message);
//         }
//     };

//     const handleCheckEmailVerification = () => {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//             if (user.emailVerified) {
//                 console.log('Email is verified.');
//                 alert('Email is verified.');
//             } else {
//                 console.log('Email is not verified.');
//                 alert('Email is not verified.');
//             }
//         } else {
//             console.log('No user logged in.');
//             alert('No user logged in.');
//         }
//     };

//     const handleSendPhoneNumberVerification = async () => {
//         try {
//             const auth = getAuth();

//             const confirmationResult = await signInWithPhoneNumber(auth, phone, auth.RecaptchaVerifier('recaptcha-container'));
//             window.confirmationResult = confirmationResult;
//             console.log('SMS sent successfully. Confirmation Result:', confirmationResult);
//             alert('SMS sent successfully. Enter the code sent to your phone.');
//         } catch (error) {
//             console.error('Firebase Authentication Error:', error);
//             if (error.serverResponse) {
//                 console.error('Server Response:', error.serverResponse);
//             }
//             alert(error.message);
//         }
//     };

//     const handleVerifyPhoneNumber = () => {
//         const code = verificationCode;
//         const confirmationResult = window.confirmationResult;

//         if (confirmationResult) {
//             confirmationResult.confirm(code)
//                 .then((result) => {
//                     console.log('Phone number verified successfully.');
//                     alert('Phone number verified successfully.');
//                 })
//                 .catch((error) => {
//                     console.error('Firebase Authentication Error:', error);
//                     alert(error.message);
//                 });
//         } else {
//             alert('Confirmation result is not available. Please request verification code again.');
//         }
//     };

//     return (
//         <div>
//             <h2>React Firebase Authentication</h2>
//             {/* Register */}
//             <label>Email:</label>
//             <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <label>Password:</label>
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button onClick={handleRegister}>Register</button>

//             {/* Login */}
//             <label>Email:</label>
//             <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
//             <label>Password:</label>
//             <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
//             <button onClick={handleLogin}>Login</button>

//             {/* Logout */}
//             <button onClick={handleLogout}>Logout</button>

//             {/* Forgot Password */}
//             <label>Email:</label>
//             <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <button onClick={handleForgotPassword}>Forgot Password</button>

//             {/* Email Verification */}
//             <button onClick={handleSendEmailVerification}>Send Verification Email</button>
//             <button onClick={handleCheckEmailVerification}>Check Email Verification</button>

//             {/* Phone Number Verification */}
//             <label>Phone Number:</label>
//             <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
//             <button onClick={handleSendPhoneNumberVerification}>Send Phone Verification</button>

//             {/* Verify Phone Number */}
//             <label>Verification Code:</label>
//             <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
//             <button onClick={handleVerifyPhoneNumber}>Verify Phone Number</button>
//         </div>
//     );
// };

// export default Account;
