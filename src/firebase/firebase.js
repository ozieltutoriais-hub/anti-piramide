import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxa7L9DcmgA8gft1oqJGvqC6qDOOhitS4",
  authDomain: "autoescolasystem.firebaseapp.com",
  projectId: "autoescolasystem",
  storageBucket: "autoescolasystem.firebasestorage.app",
  messagingSenderId: "1078046723539",
  appId: "1:1078046723539:web:b5c6a5f788ddd10e77f326"
};

const app = initializeApp(firebaseConfig);

export default app;