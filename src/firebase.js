import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaU0Esxmep6v7aXpjM5dmk-rs-C9-BLu0",
  authDomain: "whatsapp-clone-b22e1.firebaseapp.com",
  projectId: "whatsapp-clone-b22e1",
  storageBucket: "whatsapp-clone-b22e1.appspot.com",
  messagingSenderId: "681820086324",
  appId: "1:681820086324:web:5299948e6c7c0fbb78ea61",
  measurementId: "G-Q5CJDM00ZB",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
