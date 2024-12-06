import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore ,Timestamp} from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA-dg5xh-zISY9FV9q7-f7Ec7gWGwZMugk",
  authDomain: "souknet-ce8dc.firebaseapp.com",
  projectId: "souknet-ce8dc",
  storageBucket: "souknet-ce8dc.appspot.com",
  messagingSenderId: "702018026758",
  appId: "1:702018026758:web:714556289a7aea3dccf287"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, Timestamp, storage };