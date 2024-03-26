importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


firebase.initializeApp({
        apiKey: "AIzaSyD3YM1gWfHq-lICltbozlshPwiRhOUxbig",
        authDomain: "colorpicker-7466e.firebaseapp.com",
        projectId: "colorpicker-7466e",
        storageBucket: "colorpicker-7466e.appspot.com",
        messagingSenderId: "947613416693",
        appId: "1:947613416693:web:63c580bcd1503f7ccc99bc",
        measurementId: "G-J20ZR00MMR"
    });
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
