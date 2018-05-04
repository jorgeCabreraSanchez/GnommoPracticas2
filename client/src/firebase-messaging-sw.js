importScripts('https://gstatic.com/firebase/4.13.1/firebase-app.js');
importScripts('https://gstatic.com/firebase/4.13.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '271450768634'
});

const messaging = firebase.messaging();