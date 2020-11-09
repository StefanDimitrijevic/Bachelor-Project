import firebase from 'firebase';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkiezSdtXbDPayBYzeb69QXUHotbRE0RA",
    authDomain: "hca-bachelor.firebaseapp.com",
    databaseURL: "https://hca-bachelor.firebaseio.com",
    projectId: "hca-bachelor",
    storageBucket: "hca-bachelor.appspot.com",
    messagingSenderId: "117163129610",
    appId: "1:117163129610:web:87f199f439a670e418d8f3",
    measurementId: "G-9719XCP0PX"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;