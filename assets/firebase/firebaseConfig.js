import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
apiKey: "AIzaSyAQUjioZBfdIAvuXeO0ktdNDtfBBREuSHA",
  authDomain: "studioghibli-513bd.firebaseapp.com",
  projectId: "studioghibli-513bd",
  storageBucket: "studioghibli-513bd.firebasestorage.app",
  messagingSenderId: "482475502624",
  appId: "1:482475502624:web:36535c8f822cf1e4c22045",
  measurementId: "G-Y64GNQ44RM"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };