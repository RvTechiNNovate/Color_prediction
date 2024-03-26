// import { getMessaging } from "firebase/messaging";

// const NotificationComponent = () => {
//     const sendNotification = async () => {

//         const messaging = getMessaging();
//         console.log("i am here in send notification")
//         console.log(messaging)
//         try {
//             const payload = {
//                 notification: {
//                     title: 'New Notification',
//                     body: 'This is a notification sent from the component.',
//                     // Add more properties as needed
//                 },
//             };
//             await messaging.send(payload);
//             console.log('Notification sent successfully.');
//         } catch (error) {
//             console.error('Error sending notification:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={sendNotification}>Send Notification</button>
//         </div>
//     );
// };

// export default NotificationComponent;