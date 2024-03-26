// authFunctions.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification, signInWithPhoneNumber, updateProfile } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import toast from "react-hot-toast";
import { firebaseConfig } from "../config";


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const messaging = getMessaging(app);



export const generate_Token = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission)
    const token = await getToken(messaging,
        { vapidKey: "BKum-0L7ZzrW4byW9mZJ1JHBubaJP3f8-Yua_1I5NNpQj82b2kmzcFvQN0Hlh0CAlMg8e_pZ1hs8JpLul4-yDjw" });
    console.log(token)
    return token
}

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);

        toast.success("Registration successfully!!");
        return user
    } catch (error) {

        console.error(error.message);
        toast.error("Registration Not Working , Try after sometime.");
    }
};


// done
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        toast.success(`Login successfully!!!`);
        return user
    } catch (error) {

        let errorMessage = "";
        switch (error.code) {
            case "auth/invalid-email":
                errorMessage = "Invalid email address. Please enter a valid email.";
                break;
            case "auth/user-disabled":
                errorMessage = "Your account has been disabled. Please contact support.";
                break;
            case "auth/user-not-found":
                errorMessage = "User not found. Please check your email and try again.";
                break;
            case "auth/invalid-credential":
                errorMessage = "Invalid password. Please check your password and try again.";
                break;

            default:
                errorMessage = "Problem with login , please try after sometime!!";
                break;
        }
        toast.error(errorMessage);
    }
};

// done
export const getCurrentUser = () => {
    try {

        const user = auth.currentUser;
        console.log(user);
        return !!(user);
    } catch (error) {
        console.error(error.message);
        toast.error("Problem in getting current user");
    }
};


// done
export const logoutUser = async () => {
    await signOut(auth)
        .then(() => {
            toast.error('Sign-out successful.');

        })
        .catch((error) => {
            console.error('An error happened.');
        });
};

// done
export const forgotPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent successfully.');
        toast.success('Reset email sent successfully. Check your inbox or spam.');

    } catch (error) {
        console.error(error.message);
        toast.error('Please Enter Email');
    }
};

// done
export const handlSendEmailVerification = async () => {
    const user = auth.currentUser;
    try {
        await sendEmailVerification(user);
        toast.success('Verification email sent successfully. Check your inbox.');
    } catch (error) {
        console.error(error);
        let errorMessage = "An error occurred while sending the verification email. Please try again later.";
        switch (error.code) {
            case "auth/too-many-requests":
                errorMessage = "Too many requests. Please try again later.";
                break;
            case "auth/invalid-recipient-email":
                errorMessage = "Invalid recipient email. Please check the email address and try again.";
                break;
            // Add more cases for other error codes as needed
            default:
                break;
        }
    }
};

// done
export const checkEmailVerification = () => {
    const user = auth.currentUser;
    if (user) {
        if (user.emailVerified) {
            console.log('Email is verified.');
            toast.success('Email is verified.');
        } else {
            console.log('Email is not verified.');
            toast.error('Email is not verified.');
        }
    } else {
        console.log('No user logged in.');
        toast.error('No user logged in.');
    }
};



export const sendPhoneNumberVerification = async (phone) => {
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phone);
        window.confirmationResult = confirmationResult;
        console.log('SMS sent successfully. Confirmation Result:', confirmationResult);
        toast.success('SMS sent successfully. Enter the code sent to your phone.');
    } catch (error) {
        console.error('Firebase Authentication Error:', error);
        if (error.serverResponse) {
            console.error('Server Response:', error.serverResponse);
        }
        toast.error(error.message);
    }
};

export const verifyPhoneNumber = (verificationCode) => {
    const code = verificationCode;
    const confirmationResult = window.confirmationResult;

    if (confirmationResult) {
        confirmationResult.confirm(code)
            .then((result) => {
                console.log('Phone number verified successfully.');
                toast.success('Phone number verified successfully.');
            })
            .catch((error) => {
                console.error('Firebase Authentication Error:', error);
                toast.error(error.message);
            });
    } else {
        toast('Confirmation result is not available. Please request verification code again.');
    }
};
