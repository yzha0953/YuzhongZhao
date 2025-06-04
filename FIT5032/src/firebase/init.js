import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzukkKnwE3JNr4RdU-f56ukSM71hmeFBM",
  authDomain: "week7-yuzhongzhao.firebaseapp.com",
  projectId: "week7-yuzhongzhao",
  storageBucket: "week7-yuzhongzhao.appspot.com",
  messagingSenderId: "546619547760",
  appId: "1:546619547760:web:da3559440a2174ea8694b5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app); 
const functions = getFunctions(app);

// //Connect to local emulator if running in localhost
//  if (window.location.hostname === "localhost") {
//      connectFirestoreEmulator(db, "localhost", 8082);
//      connectFunctionsEmulator(functions, "localhost", 5001);
//      connectAuthEmulator(auth, "http://localhost:9099");
// }

// set the admin account
const adminEmail = "admin@medicalhome.com";

// save role in Firestore
export const saveUserDataToFirestore = async (user) => {
  try {
    const role = (user.email === adminEmail) ? 'admin' : 'user';  

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      uid: user.uid,
      role: role, 
      createdAt: new Date(),
    });
    
    console.log('User data saved to Firestore');
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export { db, auth, functions };
