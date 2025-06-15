// js/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBLMCQk2zpsYr1fgTBw_OslnAOJvlNw1Ag",
  authDomain: "mtarslan-1ae92.firebaseapp.com",
  projectId: "mtarslan-1ae92",
  storageBucket: "mtarslan-1ae92.appspot.com",
  messagingSenderId: "980206613434",
  appId: "1:980206613434:web:0ec37a34f8e251b5626383"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
