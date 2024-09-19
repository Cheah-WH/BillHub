import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBB6fQVyWsNlretriFoMgM-u_8RLriKqvw",
  authDomain: "",
  projectId: "billhub-f510f", 
  storageBucket: "billhub-f510f.appspot.com",
  messagingSenderId: "1004848052835",
  appId: "1:1004848052835:android:34984b501d36fb1b0ed656",
};

const app = initializeApp(firebaseConfig);
export default app;