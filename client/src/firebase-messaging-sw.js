importScripts('https://gstatic.com/firebase/4.13.1/firebase-app.js');
importScripts('https://gstatic.com/firebase/4.13.1/firebase-messaging.js');

var config = {
    apiKey: 'AIzaSyBhNntcL5UgZZ0hPwsFDkoYBmZea0PJqFY',
    authDomain: 'app-pruebas-972aa.firebaseapp.com',
    databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
    projectId: 'app-pruebas-972aa',
    storageBucket: 'app-pruebas-972aa.appspot.com',
    messagingSenderId: '271450768634'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'Hello World';
    const options = {
        body: payload.data.status
    };
    return self.registration.showNotification(title, options);
});